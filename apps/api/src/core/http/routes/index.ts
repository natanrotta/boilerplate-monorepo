import { Router } from "express";
import { authRoutes } from "@modules/auth/infrastructure/route/auth.routes";
import { devRoutes } from "@modules/auth/infrastructure/route/dev.routes";
import { userRateLimit } from "../middlewares";
import { container, DI_TOKENS } from "@core/container";
import { env, isDevQuickLoginEnabled } from "@core/config";
import { logger } from "../logger";

const router = Router();

// Resolved once from the container. The CI stamps APP_VERSION (the git sha)
// into the image; the deploy workflow reads this back to confirm the expected
// version actually went live ("unknown" when built outside the CI).
const apiVersion = container.resolve<string>(DI_TOKENS.ApiVersion);

// Unauthenticated health probe.
router.get("/health", (_req, res) => {
  return res.status(200).json({
    ok: true,
    version: apiVersion,
    uptimeSeconds: Math.round(process.uptime()),
  });
});

router.use("/auth", authRoutes);

// Dev-only quick-login routes — require BOTH NODE_ENV === "local" AND the
// explicit opt-in DEV_QUICK_LOGIN_ENABLED=true. The flag is what keeps this
// safe: NODE_ENV defaults to "local", so relying on it alone would be
// fail-unsafe if a deployment forgot to set it. `dev.routes.ts` re-checks both
// on every request (defense in depth), and only answers a request that
// comes from this machine and is addressed to it. No auth limiter on purpose: there is no credential to
// guess, and the global limiter in `app.ts` still applies.
if (isDevQuickLoginEnabled(env)) {
  router.use("/dev", devRoutes);
  logger.warn(
    "[DEV] Quick-login routes enabled: GET /dev/users, POST /dev/impersonate",
  );
}

// Per-user limiter for every authenticated surface mounted BELOW this line.
// Mount new domain routers here — see `.claude/patterns/backend-modules.md`.
router.use(userRateLimit);

export { router };
