import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type InternalAxiosRequestConfig,
} from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorCodes } from "@boilerplate/shared-types";
import { AppError } from "@/core/errors/AppError";
import { STORAGE_KEYS } from "@/shared/constants/storageKeys";
import { getCsrfToken, httpClient, setAuthExpiredHandler } from "./httpClient";

const CSRF_COOKIE = "boilerplate_csrf";

// A non-auth route: the interceptor short-circuits every `/auth/` URL before
// the refresh branch, so a silent-refresh case has to ride a different path.
const PROTECTED_PATH = "/health";

function setCsrfCookie(value: string | null) {
  document.cookie = value
    ? `${CSRF_COOKIE}=${value}; path=/`
    : `${CSRF_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/** Headers are asserted off the config the transport actually received, so the
 *  test pins the outgoing request rather than the interceptor's internals. */
function headerOf(config: InternalAxiosRequestConfig, name: string): unknown {
  return (config.headers as unknown as Record<string, unknown>)[name];
}

function okResponse(config: InternalAxiosRequestConfig, data: unknown) {
  return {
    data,
    status: 200,
    statusText: "OK",
    headers: new AxiosHeaders(),
    config,
  };
}

function capturingAdapter(captured: InternalAxiosRequestConfig[]): AxiosAdapter {
  return async (config) => {
    captured.push(config);
    return okResponse(config, { ok: true, data: null });
  };
}

function bodyAdapter(body: unknown): AxiosAdapter {
  return async (config) => okResponse(config, body);
}

function failingAdapter(
  status: number,
  body: unknown,
  headers: Record<string, string> = {}
): AxiosAdapter {
  return async (config) => {
    throw new AxiosError(String(status), "ERR_BAD_REQUEST", config, null, {
      data: body,
      status,
      statusText: "Error",
      headers: new AxiosHeaders(headers),
      config,
    });
  };
}

const expiredEnvelope = {
  ok: false,
  error: { message: "Token expired", code: ErrorCodes.AUTH_TOKEN_EXPIRED },
};

/** First call: 401 with an expired app token. Every later call: 200 `{ ok, data }`.
 *  Lets one request exercise "fail → refresh → replay" end to end. */
function expiringAdapter(): AxiosAdapter {
  let calls = 0;
  return async (config) => {
    calls += 1;
    if (calls === 1) {
      throw new AxiosError("401", "ERR_BAD_REQUEST", config, null, {
        data: expiredEnvelope,
        status: 401,
        statusText: "Unauthorized",
        headers: new AxiosHeaders(),
        config,
      });
    }
    return okResponse(config, { ok: true, data: { retried: true } });
  };
}

const originalAdapter = httpClient.defaults.adapter;

// The real handler navigates via `window.location.href`, which jsdom cannot do.
// Registering a spy keeps the redirect observable AND keeps the suite quiet.
const authExpired = vi.fn();

beforeEach(() => {
  setAuthExpiredHandler(authExpired);
});

afterEach(() => {
  httpClient.defaults.adapter = originalAdapter;
  setCsrfCookie(null);
  vi.restoreAllMocks();
  authExpired.mockReset();
});

describe("getCsrfToken", () => {
  it("decodes the cookie value so the header matches the token the server issued", () => {
    // Cookie values are percent-encoded on the wire; handing the raw form back
    // would make the double-submit comparison fail for any token with a `+`.
    setCsrfCookie("tok%2Ben%3D1");

    expect(getCsrfToken()).toBe("tok+en=1");
  });

  it("returns null when the cookie is absent", () => {
    expect(getCsrfToken()).toBeNull();
  });
});

describe("httpClient request interceptor", () => {
  it("echoes the CSRF cookie back as the double-submit header", async () => {
    const captured: InternalAxiosRequestConfig[] = [];
    httpClient.defaults.adapter = capturingAdapter(captured);
    setCsrfCookie("csrf-abc");

    await httpClient.get(PROTECTED_PATH);

    expect(headerOf(captured[0]!, "X-CSRF-Token")).toBe("csrf-abc");
  });

  it("omits the CSRF header when there is no cookie", async () => {
    const captured: InternalAxiosRequestConfig[] = [];
    httpClient.defaults.adapter = capturingAdapter(captured);

    await httpClient.get(PROTECTED_PATH);

    expect(headerOf(captured[0]!, "X-CSRF-Token")).toBeUndefined();
  });

  it("attaches the scoped verification bearer only on the e-mail verification routes", async () => {
    // The scoped `email:verify` token must never shadow the session cookie on a
    // normal request — the API reads the Bearer header before the cookie.
    sessionStorage.setItem(STORAGE_KEYS.emailVerifyToken, "scoped-token");
    const captured: InternalAxiosRequestConfig[] = [];
    httpClient.defaults.adapter = capturingAdapter(captured);

    await httpClient.post("/auth/email-verification/send");
    await httpClient.get(PROTECTED_PATH);

    expect(headerOf(captured[0]!, "Authorization")).toBe("Bearer scoped-token");
    expect(headerOf(captured[1]!, "Authorization")).toBeUndefined();
  });

  it("forwards the stored UI language so the API localizes its error messages", async () => {
    localStorage.setItem(STORAGE_KEYS.language, "es");
    const captured: InternalAxiosRequestConfig[] = [];
    httpClient.defaults.adapter = capturingAdapter(captured);

    await httpClient.get(PROTECTED_PATH);

    expect(headerOf(captured[0]!, "Accept-Language")).toBe("es");
  });

  it("strips the JSON Content-Type from a FormData body but keeps it for a JSON one", async () => {
    // A multipart body labelled `application/json` reaches the API with no
    // boundary and is rejected before the upload handler ever runs. Only the
    // removal is this interceptor's contract — whatever the transport fills in
    // afterwards (the browser's multipart boundary) is out of its hands.
    const captured: InternalAxiosRequestConfig[] = [];
    httpClient.defaults.adapter = capturingAdapter(captured);
    const formData = new FormData();
    formData.append("file", new File(["x"], "avatar.png", { type: "image/png" }));

    await httpClient.put("/auth/profile/avatar", formData);
    await httpClient.put("/auth/profile", { name: "Ana" });

    expect(headerOf(captured[0]!, "Content-Type")).not.toBe("application/json");
    expect(headerOf(captured[1]!, "Content-Type")).toBe("application/json");
  });
});

describe("httpClient response envelope", () => {
  it("unwraps `{ ok, data }` so callers receive the payload, not the envelope", async () => {
    httpClient.defaults.adapter = bodyAdapter({ ok: true, data: { id: "u1" } });

    await expect(httpClient.get<never, { id: string }>(PROTECTED_PATH)).resolves.toEqual({
      id: "u1",
    });
  });

  it("passes a body that is not an envelope through untouched", async () => {
    // Not every response is enveloped (static payloads, proxies). Unwrapping
    // blindly would turn those into `undefined`.
    httpClient.defaults.adapter = bodyAdapter({ version: "1.2.3" });

    await expect(httpClient.get<never, { version: string }>(PROTECTED_PATH)).resolves.toEqual({
      version: "1.2.3",
    });
  });
});

describe("httpClient silent refresh", () => {
  const refreshResponse = {
    data: {},
    status: 200,
    statusText: "OK",
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() } as InternalAxiosRequestConfig,
  };

  it("renews the session cookie once and replays the original request", async () => {
    httpClient.defaults.adapter = expiringAdapter();
    const refreshSpy = vi.spyOn(axios, "post").mockResolvedValue(refreshResponse);

    const data = await httpClient.get<never, { retried: boolean }>(PROTECTED_PATH);

    expect(data).toEqual({ retried: true });
    expect(refreshSpy).toHaveBeenCalledTimes(1);
    const [url, body, config] = refreshSpy.mock.calls[0]!;
    expect(url).toMatch(/\/auth\/refresh$/);
    // The refresh token rides an httpOnly cookie, so the body stays empty and
    // the call only has to opt into credentials.
    expect(body).toEqual({});
    expect(config).toMatchObject({ withCredentials: true });
    expect(authExpired).not.toHaveBeenCalled();
  });

  it("does not refresh on a 401 that carries a domain code", async () => {
    // A wrong password on a sensitive action answers 401 too. Refreshing (or
    // signing out) there would kick a perfectly valid session.
    httpClient.defaults.adapter = failingAdapter(401, {
      ok: false,
      error: { message: "Credenciais inválidas.", code: ErrorCodes.AUTH_INVALID_CREDENTIALS },
    });
    const refreshSpy = vi.spyOn(axios, "post");

    const error = await httpClient.get(PROTECTED_PATH).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).code).toBe(ErrorCodes.AUTH_INVALID_CREDENTIALS);
    expect((error as AppError).statusCode).toBe(401);
    expect(refreshSpy).not.toHaveBeenCalled();
    expect(authExpired).not.toHaveBeenCalled();
  });

  it("leaves a flagged session probe alone instead of refreshing it", async () => {
    // The boot probe's 401 only means "not signed in". Running the
    // session-expired machinery there bounces anonymous visitors off the
    // public pages (/register, /invite, /forgot-password).
    httpClient.defaults.adapter = failingAdapter(401, expiredEnvelope);
    const refreshSpy = vi.spyOn(axios, "post");

    const error = await httpClient
      .get(PROTECTED_PATH, { skipSessionExpiredRedirect: true })
      .catch((e: unknown) => e);

    expect((error as AppError).code).toBe(ErrorCodes.AUTH_TOKEN_EXPIRED);
    expect(refreshSpy).not.toHaveBeenCalled();
    expect(authExpired).not.toHaveBeenCalled();
  });

  it("clears the session without refreshing when an auth route itself returns 401", async () => {
    httpClient.defaults.adapter = failingAdapter(401, expiredEnvelope);
    const refreshSpy = vi.spyOn(axios, "post");

    await expect(httpClient.post("/auth/sign-out")).rejects.toBeInstanceOf(AppError);

    expect(refreshSpy).not.toHaveBeenCalled();
    expect(authExpired).toHaveBeenCalledTimes(1);
  });

  it("signs the user out when the renewal itself fails", async () => {
    httpClient.defaults.adapter = failingAdapter(401, expiredEnvelope);
    vi.spyOn(axios, "post").mockRejectedValue(new Error("refresh rejected"));

    const error = await httpClient.get(PROTECTED_PATH).catch((e: unknown) => e);

    expect((error as AppError).code).toBe(ErrorCodes.AUTH_TOKEN_EXPIRED);
    expect((error as AppError).statusCode).toBe(401);
    expect(authExpired).toHaveBeenCalledTimes(1);
  });
});

describe("httpClient error mapping", () => {
  it("surfaces retry-after on a 429 so callers can show a real countdown", async () => {
    httpClient.defaults.adapter = failingAdapter(
      429,
      { ok: false, error: { message: "Muitas tentativas.", code: ErrorCodes.AUTH_RATE_LIMIT } },
      { "retry-after": "30" }
    );

    const error = (await httpClient.post("/auth/sign-in", {}).catch((e: unknown) => e)) as AppError;

    expect(error.code).toBe(ErrorCodes.AUTH_RATE_LIMIT);
    expect(error.statusCode).toBe(429);
    expect(error.details).toEqual({ retryAfter: 30 });
  });

  it("maps a transport failure with no response to NETWORK_ERROR", async () => {
    httpClient.defaults.adapter = async () => {
      throw new Error("connection refused");
    };

    const error = (await httpClient.get(PROTECTED_PATH).catch((e: unknown) => e)) as AppError;

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe("NETWORK_ERROR");
    expect(error.statusCode).toBe(0);
  });

  it("falls back to UNKNOWN_ERROR when the API answers without an error envelope", async () => {
    // Proxies and gateways return bare HTML/text bodies. Callers still need a
    // stable `code` to branch on instead of parsing a message.
    httpClient.defaults.adapter = failingAdapter(502, "<html>bad gateway</html>");

    const error = (await httpClient.get(PROTECTED_PATH).catch((e: unknown) => e)) as AppError;

    expect(error.code).toBe("UNKNOWN_ERROR");
    expect(error.statusCode).toBe(502);
  });
});

describe("httpClient cancellation", () => {
  it("reports an aborted request as a NETWORK_ERROR rather than leaking the axios error", async () => {
    // There is no dedicated cancellation branch: `CanceledError` carries no
    // `response`, so it lands in the same bucket as a transport failure. This
    // pins that contract — callers that need to tell the two apart must check
    // the abort signal themselves.
    httpClient.defaults.adapter = (config) =>
      new Promise((_resolve, reject) => {
        config.signal?.addEventListener?.("abort", () =>
          reject(new axios.CanceledError(undefined, undefined, config))
        );
      });
    const controller = new AbortController();

    const request = httpClient.get(PROTECTED_PATH, { signal: controller.signal });
    controller.abort();

    const error = (await request.catch((e: unknown) => e)) as AppError;
    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe("NETWORK_ERROR");
  });
});
