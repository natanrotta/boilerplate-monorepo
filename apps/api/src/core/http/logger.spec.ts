import { vi } from "vitest";
import pino from "pino";

vi.mock("../config", () => ({
  env: { LOG_LEVEL: "info", NODE_ENV: "test" },
}));

import { redactPaths, pathOnly } from "./logger";

describe("logger redact paths", () => {
  it("mirrors every sensitive path under both req.* and request.*", () => {
    // The customProps block emits the request under `request.*`; without the
    // mirror, fast-redact (exact-path) would miss them. This is the SEC-C7 leak.
    for (const path of [
      "req.headers.authorization",
      "request.headers.authorization",
      "req.headers.cookie",
      "request.headers.cookie",
      'req.headers["x-csrf-token"]',
      'request.headers["x-csrf-token"]',
      "req.body.summary",
      "request.body.summary",
      "req.body.fieldValues",
      "request.body.fieldValues",
      "req.body.password",
      "request.body.password",
      "req.body.access_token",
      "request.body.access_token",
    ]) {
      expect(redactPaths).toContain(path);
    }
  });

  it("redacts the e-mail address in a request body (identity, not just secrets)", () => {
    // Every auth payload carries `email`; a 4xx on sign-in or password-reset
    // would otherwise write the address into the log line.
    expect(redactPaths).toContain("req.body.email");
    expect(redactPaths).toContain("request.body.email");
  });

  it("functionally redacts credentials, identity and free text in a customProps-shaped record", () => {
    let line = "";
    const sink = pino(
      { redact: { paths: redactPaths, censor: "[REDACTED]" } },
      { write: (s: string) => (line = s) },
    );

    sink.warn({
      request: {
        method: "POST",
        url: "/api/auth/sign-in",
        headers: {
          authorization: "Bearer super-secret-jwt",
          cookie: "boilerplate_rt=abc",
        },
        body: {
          email: "person@example.com",
          summary: "free-form user content",
          password: "p@ss",
        },
      },
    });

    const parsed = JSON.parse(line);
    expect(parsed.request.headers.authorization).toBe("[REDACTED]");
    expect(parsed.request.headers.cookie).toBe("[REDACTED]");
    expect(parsed.request.body.email).toBe("[REDACTED]");
    expect(parsed.request.body.summary).toBe("[REDACTED]");
    expect(parsed.request.body.password).toBe("[REDACTED]");
    expect(line).not.toContain("super-secret-jwt");
    expect(line).not.toContain("person@example.com");
    expect(line).not.toContain("free-form user content");
  });
});

describe("pathOnly", () => {
  it("strips the query string (PII/token) from a URL", () => {
    expect(pathOnly("/api/users?search=Jo%C3%A3o+Silva")).toBe("/api/users");
    expect(pathOnly("/imports/stream?access_token=secret")).toBe(
      "/imports/stream",
    );
  });

  it("returns the path unchanged when there is no query", () => {
    expect(pathOnly("/health")).toBe("/health");
  });

  it("handles undefined", () => {
    expect(pathOnly(undefined)).toBeUndefined();
  });
});
