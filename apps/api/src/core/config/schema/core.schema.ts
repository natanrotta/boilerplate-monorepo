import { z } from "zod";

export const coreSchema = z.object({
  NODE_ENV: z
    .enum(["local", "development", "staging", "production", "test"])
    .default("local"),
  // Explicit opt-in for the dev-only quick-login routes (`/api/dev/*`), which
  // issue sessions WITHOUT a password. They also require NODE_ENV === "local",
  // but that alone is fail-unsafe (it is the default above) — so the routes
  // stay off unless this is set on purpose. See `dev.routes.ts`.
  DEV_QUICK_LOGIN_ENABLED: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  API_PORT: z.coerce.number().default(3333),
  // Allowed CORS origin(s). NEVER "*" in production.
  ALLOWED_ORIGIN: z.string().min(1, "ALLOWED_ORIGIN must be set").default("*"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  // Ceiling for the graceful shutdown (core/service/lifecycle). Keep it BELOW
  // the orchestrator's kill grace (Docker's default `stop_grace_period` is
  // 10 s; the deploy compose raises it to 60 s) so a hung teardown still ends
  // in our own exit code, not a SIGKILL. The `.max()` machine-enforces that:
  // after a crash this is also the longest the process may linger.
  SHUTDOWN_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .max(60_000)
    .default(30_000),
});
