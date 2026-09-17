import { beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorCodes } from "@boilerplate/shared-types";
import { AppError } from "@/core/errors/AppError";
import { STORAGE_KEYS } from "@/shared/constants/storageKeys";
import { HttpAuthRepository } from "./HttpAuthRepository";

const { getMock, postMock, putMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
  postMock: vi.fn(),
  putMock: vi.fn(),
}));

// Mocked at the transport boundary: these tests own the repository's wire
// contract (path, payload, mapping), not axios or the interceptors.
vi.mock("@/core/http/httpClient", () => ({
  httpClient: { get: getMock, post: postMock, put: putMock },
}));

const ME = {
  id: "u1",
  name: "Demo",
  email: "demo@example.com",
  emailVerified: true,
  avatarUrl: "https://cdn.test/a.png",
  language: "en",
};

const MAPPED_ME = {
  id: "u1",
  name: "Demo",
  email: "demo@example.com",
  emailVerified: true,
  avatarUrl: "https://cdn.test/a.png",
  language: "en",
};

const repository = new HttpAuthRepository();

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
});

describe("HttpAuthRepository.signIn", () => {
  it("posts only the credentials and returns the mapped session user", async () => {
    postMock.mockResolvedValueOnce({ user: ME, token: "ignored", csrfToken: "ignored" });

    const session = await repository.signIn({ email: "demo@example.com", password: "pw" });

    expect(postMock).toHaveBeenCalledWith("/auth/sign-in", {
      email: "demo@example.com",
      password: "pw",
    });
    // The body still echoes a JWT, but the session credential is the httpOnly
    // cookie — the mapped session must not carry a token the app could store.
    expect(session).toEqual({ user: MAPPED_ME });
  });

  it("fills the optional wire fields with their UI defaults", async () => {
    // An older/lean payload must still produce a fully-shaped AuthUser, or the
    // profile screen renders `undefined` in the avatar and language controls.
    postMock.mockResolvedValueOnce({ user: { id: "u1", name: "Demo", email: "d@e.com" } });

    const session = await repository.signIn({ email: "d@e.com", password: "pw" });

    expect(session.user).toEqual({
      id: "u1",
      name: "Demo",
      email: "d@e.com",
      emailVerified: true,
      avatarUrl: "",
      language: "pt-BR",
    });
  });
});

describe("HttpAuthRepository.signUp", () => {
  it("stores the scoped token and routes the caller to the verification step", async () => {
    postMock.mockResolvedValueOnce({
      requiresEmailVerification: true,
      token: "scoped-token",
      email: "new@example.com",
    });

    const result = await repository.signUp({
      name: "New",
      email: "new@example.com",
      password: "pw",
    });

    expect(postMock).toHaveBeenCalledWith("/auth/sign-up", {
      name: "New",
      email: "new@example.com",
      password: "pw",
    });
    expect(result).toEqual({ kind: "verify-email", email: "new@example.com" });
    // The follow-up send/verify calls authenticate with this token only — losing
    // it strands the user on /verify-email with no way to receive a PIN.
    expect(sessionStorage.getItem(STORAGE_KEYS.emailVerifyToken)).toBe("scoped-token");
  });

  it("forwards the UI language only when one was chosen", async () => {
    // Sending `language: undefined` would override the backend default with a
    // null-ish value once the payload is serialized.
    postMock.mockResolvedValue({ requiresEmailVerification: true, token: "t", email: "e@e.com" });

    await repository.signUp({ name: "New", email: "e@e.com", password: "pw", language: "es" });

    expect(postMock.mock.calls[0]![1]).toEqual({
      name: "New",
      email: "e@e.com",
      password: "pw",
      language: "es",
    });
  });
});

describe("HttpAuthRepository e-mail verification", () => {
  it("requests a PIN without a body — the scoped token identifies the user", async () => {
    postMock.mockResolvedValueOnce(undefined);

    await repository.sendVerificationPin();

    expect(postMock).toHaveBeenCalledWith("/auth/email-verification/send");
  });

  it("drops the scoped token once the PIN upgrades it into a real session", async () => {
    // Leaving it behind makes the next `getCurrentUser` short-circuit to null
    // and log the freshly-verified user straight back out.
    sessionStorage.setItem(STORAGE_KEYS.emailVerifyToken, "scoped-token");
    postMock.mockResolvedValueOnce({ user: ME });

    const session = await repository.verifyEmailPin("123456");

    expect(postMock).toHaveBeenCalledWith("/auth/email-verification/verify", { pin: "123456" });
    expect(session).toEqual({ user: MAPPED_ME });
    expect(sessionStorage.getItem(STORAGE_KEYS.emailVerifyToken)).toBeNull();
  });

  it("discards an abandoned verification locally, with no network call", async () => {
    sessionStorage.setItem(STORAGE_KEYS.emailVerifyToken, "scoped-token");

    repository.discardEmailVerification();

    expect(sessionStorage.getItem(STORAGE_KEYS.emailVerifyToken)).toBeNull();
    expect(postMock).not.toHaveBeenCalled();
  });
});

describe("HttpAuthRepository.signInWithGoogle", () => {
  it("posts the credential and maps both branches of the discriminated response", async () => {
    postMock.mockResolvedValueOnce({ kind: "sign-up", user: ME });

    const session = await repository.signInWithGoogle({ credential: "g-cred", language: "pt-BR" });

    expect(postMock).toHaveBeenCalledWith("/auth/google", {
      credential: "g-cred",
      language: "pt-BR",
    });
    // Sign-in and sign-up differ only in the `kind` discriminator; both hand
    // back the same session, so the caller never branches on it here.
    expect(session).toEqual({ user: MAPPED_ME });
  });

  it("omits the language when the caller has none", async () => {
    postMock.mockResolvedValueOnce({ kind: "sign-in", user: ME });

    await repository.signInWithGoogle({ credential: "g-cred" });

    expect(postMock.mock.calls[0]![1]).toEqual({ credential: "g-cred" });
  });
});

describe("HttpAuthRepository.signOut", () => {
  it("asks the server to clear the cookies and drops the scoped token", async () => {
    sessionStorage.setItem(STORAGE_KEYS.emailVerifyToken, "scoped-token");
    postMock.mockResolvedValueOnce(undefined);

    await repository.signOut();

    expect(postMock).toHaveBeenCalledWith("/auth/sign-out");
    expect(sessionStorage.getItem(STORAGE_KEYS.emailVerifyToken)).toBeNull();
  });

  it("still drops the scoped token when the sign-out request fails", async () => {
    // Offline sign-out must not leave a usable credential behind on a shared
    // machine — the local cleanup runs in a `finally`.
    sessionStorage.setItem(STORAGE_KEYS.emailVerifyToken, "scoped-token");
    postMock.mockRejectedValueOnce(new AppError("offline", "NETWORK_ERROR", 0));

    await expect(repository.signOut()).rejects.toBeInstanceOf(AppError);

    expect(sessionStorage.getItem(STORAGE_KEYS.emailVerifyToken)).toBeNull();
  });
});

describe("HttpAuthRepository.getCurrentUser", () => {
  it("flags the probe so a 401 does not trigger the session-expired redirect", async () => {
    getMock.mockResolvedValueOnce(ME);

    const user = await repository.getCurrentUser();

    expect(getMock).toHaveBeenCalledWith("/auth/me", { skipSessionExpiredRedirect: true });
    expect(user).toEqual(MAPPED_ME);
  });

  it.each([
    ["an expired token", new AppError("x", ErrorCodes.AUTH_TOKEN_EXPIRED, 401)],
    ["an invalid token", new AppError("x", ErrorCodes.AUTH_TOKEN_INVALID, 401)],
    ["a network failure", new AppError("x", "NETWORK_ERROR", 0)],
    ["a non-AppError", new Error("boom")],
  ])("resolves to null on %s instead of rejecting", async (_label, error) => {
    // The probe answers one question — "is there a session?". Any failure means
    // "no", and the route guards own the redirect, so it must never throw into
    // the auth bootstrap.
    getMock.mockRejectedValueOnce(error);

    await expect(repository.getCurrentUser()).resolves.toBeNull();
    expect(getMock).toHaveBeenCalledTimes(1);
  });

  it("skips the probe entirely while an e-mail verification is pending", async () => {
    // Mid-signup there is no session cookie yet: probing would 401 and bounce
    // the user off /verify-email.
    sessionStorage.setItem(STORAGE_KEYS.emailVerifyToken, "scoped-token");

    await expect(repository.getCurrentUser()).resolves.toBeNull();
    expect(getMock).not.toHaveBeenCalled();
  });
});

describe("HttpAuthRepository profile", () => {
  it("puts the partial profile input as-is and maps the refreshed user back", async () => {
    putMock.mockResolvedValueOnce(ME);

    const user = await repository.updateProfile({ name: "Renamed" });

    expect(putMock).toHaveBeenCalledWith("/auth/profile", { name: "Renamed" });
    expect(user).toEqual(MAPPED_ME);
  });

  it("wraps the avatar in a multipart body under the `file` field", async () => {
    // The API's upload middleware reads exactly this field name; renaming it
    // makes every upload fail validation before the handler runs.
    putMock.mockResolvedValueOnce(ME);
    const file = new File(["x"], "avatar.png", { type: "image/png" });

    const user = await repository.uploadAvatar(file);

    const [url, body] = putMock.mock.calls[0]!;
    expect(url).toBe("/auth/profile/avatar");
    expect(body).toBeInstanceOf(FormData);
    expect((body as FormData).get("file")).toBeInstanceOf(File);
    expect(((body as FormData).get("file") as File).name).toBe("avatar.png");
    expect(user).toEqual(MAPPED_ME);
  });
});

describe("HttpAuthRepository password reset", () => {
  it("sends only the e-mail when requesting a reset link", async () => {
    postMock.mockResolvedValueOnce(undefined);

    await repository.requestPasswordReset({ email: "demo@example.com" });

    expect(postMock).toHaveBeenCalledWith("/auth/password/request-reset", {
      email: "demo@example.com",
    });
  });

  it("sends the reset token alongside the new password", async () => {
    postMock.mockResolvedValueOnce(undefined);

    await repository.resetPassword({ token: "reset-token", password: "Senha@123" });

    expect(postMock).toHaveBeenCalledWith("/auth/password/reset", {
      token: "reset-token",
      password: "Senha@123",
    });
  });
});
