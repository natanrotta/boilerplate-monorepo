import { envSchema } from "./schema";

// The REAL contract (schema/index.ts) — not a hand-copied replica. A 32-char
// JWT_SECRET is the floor the auth schema enforces.
const VALID_ENV = {
  DATABASE_URL: "postgresql://localhost:5432/test",
  JWT_SECRET: "0123456789abcdef0123456789abcdef",
};

describe("envSchema", () => {
  it("passes with the two required fields and fills every default", () => {
    const result = envSchema.safeParse(VALID_ENV);
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      NODE_ENV: "local",
      DEV_QUICK_LOGIN_ENABLED: false,
      API_PORT: 3333,
      ALLOWED_ORIGIN: "*",
      LOG_LEVEL: "info",
      SHUTDOWN_TIMEOUT_MS: 30_000,
      REDIS_HOST: "localhost",
      REDIS_PORT: 6379,
      REDIS_DB: 0,
      JWT_EXPIRES_IN: "15m",
      REFRESH_TOKEN_EXPIRES_IN: "30d",
      FRONTEND_URL: "http://localhost:3000",
      PASSWORD_RESET_TOKEN_TTL_MINUTES: 60,
      EMAIL_VERIFICATION_PIN_TTL_MINUTES: 15,
      MAIL_FROM: "Boilerplate <no-reply@example.com>",
      AWS_REGION: "us-east-1",
      GITHUB_REPO: "owner/repo",
      RATE_LIMIT_AUTH_MAX: 10,
    });
  });

  it.each(["local", "development", "staging", "production", "test"])(
    "accepts NODE_ENV=%s",
    (NODE_ENV) => {
      expect(envSchema.safeParse({ ...VALID_ENV, NODE_ENV }).success).toBe(
        true,
      );
    },
  );

  it("keeps the passwordless dev quick login OFF unless explicitly enabled", () => {
    const enabled = envSchema.safeParse({
      ...VALID_ENV,
      DEV_QUICK_LOGIN_ENABLED: "true",
    });
    expect(enabled.data?.DEV_QUICK_LOGIN_ENABLED).toBe(true);
    // Carrying the flag anywhere but a local machine refuses to boot.
    expect(
      envSchema.safeParse({
        ...VALID_ENV,
        NODE_ENV: "production",
        DEV_QUICK_LOGIN_ENABLED: "true",
      }).success,
    ).toBe(false);
    expect(
      envSchema.safeParse({
        ...VALID_ENV,
        NODE_ENV: "staging",
        DEV_QUICK_LOGIN_ENABLED: "true",
      }).success,
    ).toBe(false);
    expect(
      envSchema.safeParse({ ...VALID_ENV, DEV_QUICK_LOGIN_ENABLED: "yes" })
        .success,
    ).toBe(false);
  });

  it("rejects an unknown NODE_ENV and an unknown LOG_LEVEL", () => {
    expect(
      envSchema.safeParse({ ...VALID_ENV, NODE_ENV: "prod" }).success,
    ).toBe(false);
    expect(
      envSchema.safeParse({ ...VALID_ENV, LOG_LEVEL: "verbose" }).success,
    ).toBe(false);
  });

  it("requires DATABASE_URL and a JWT_SECRET of at least 32 characters", () => {
    expect(
      envSchema.safeParse({ JWT_SECRET: VALID_ENV.JWT_SECRET }).success,
    ).toBe(false);
    expect(
      envSchema.safeParse({ DATABASE_URL: VALID_ENV.DATABASE_URL }).success,
    ).toBe(false);
    expect(
      envSchema.safeParse({ ...VALID_ENV, JWT_SECRET: "too-short" }).success,
    ).toBe(false);
  });

  it("coerces numeric strings", () => {
    const result = envSchema.safeParse({
      ...VALID_ENV,
      API_PORT: "4000",
      REDIS_PORT: "6389",
      PASSWORD_RESET_TOKEN_TTL_MINUTES: "120",
    });
    expect(result.success).toBe(true);
    expect(result.data?.API_PORT).toBe(4000);
    expect(result.data?.REDIS_PORT).toBe(6389);
    expect(result.data?.PASSWORD_RESET_TOKEN_TTL_MINUTES).toBe(120);
  });

  it("leaves every optional integration unset (fail-open)", () => {
    const result = envSchema.safeParse(VALID_ENV);
    expect(result.data?.BUGSNAG_API_KEY).toBeUndefined();
    expect(result.data?.AWS_ACCESS_KEY_ID).toBeUndefined();
    expect(result.data?.AWS_S3_BUCKET).toBeUndefined();
    expect(result.data?.GOOGLE_CLIENT_ID).toBeUndefined();
    expect(result.data?.RESEND_API_KEY).toBeUndefined();
    expect(result.data?.COOKIE_DOMAIN).toBeUndefined();
  });

  it("rejects a non-URL FRONTEND_URL and non-URL metrics endpoints", () => {
    expect(
      envSchema.safeParse({ ...VALID_ENV, FRONTEND_URL: "not-a-url" }).success,
    ).toBe(false);
    expect(
      envSchema.safeParse({ ...VALID_ENV, METRICS_APP_URL: "10.8.0.1/metrics" })
        .success,
    ).toBe(false);
  });

  it("refuses a 0 rate-limit window/max (would silently disable the limiter)", () => {
    expect(
      envSchema.safeParse({ ...VALID_ENV, RATE_LIMIT_AUTH_MAX: "0" }).success,
    ).toBe(false);
    expect(
      envSchema.safeParse({ ...VALID_ENV, RATE_LIMIT_GLOBAL_WINDOW_MS: "0" })
        .success,
    ).toBe(false);
  });

  it("refuses a non-positive TTL (0 would expire every token instantly)", () => {
    expect(
      envSchema.safeParse({
        ...VALID_ENV,
        EMAIL_VERIFICATION_PIN_TTL_MINUTES: "0",
      }).success,
    ).toBe(false);
  });

  it("caps SHUTDOWN_TIMEOUT_MS at the container stop grace (60 s)", () => {
    expect(
      envSchema.safeParse({ ...VALID_ENV, SHUTDOWN_TIMEOUT_MS: "60001" })
        .success,
    ).toBe(false);
    expect(
      envSchema.safeParse({ ...VALID_ENV, SHUTDOWN_TIMEOUT_MS: "60000" })
        .success,
    ).toBe(true);
  });
});
