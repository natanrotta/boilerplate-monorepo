import { Router } from "express";
import { authRoutes } from "@modules/auth/infrastructure/route/auth.routes";
import { userRateLimit } from "../middlewares";
import { container, DI_TOKENS } from "@core/container";

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

// Per-user limiter for every authenticated surface mounted BELOW this line.
// Mount new domain routers here — see `.claude/patterns/backend-modules.md`.
router.use(userRateLimit);

export { router };
