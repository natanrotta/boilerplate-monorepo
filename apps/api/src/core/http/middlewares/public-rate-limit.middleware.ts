import rateLimit from "express-rate-limit";
import { env } from "../../config";
import { i18n } from "@shared/i18n";
import { ErrorCodes } from "@shared/error";
import { createRateLimitStore } from "./rate-limit-store";

/**
 * IP-keyed limiter for fully anonymous endpoints — a public share link, a
 * one-time-code check, anything reachable without a session.
 *
 * The use-case layer owns the per-resource brute-force guard (e.g. N attempts
 * per hash via the cache provider). This middleware is the coarser HTTP-layer
 * shield: it blocks *enumeration* from a single IP before the use case ever
 * runs. The default 30 req / 15min comfortably covers a real visitor
 * reloading the page while still cutting off scrapers.
 */
export const publicRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_PUBLIC_WINDOW_MS,
  max: env.RATE_LIMIT_PUBLIC_MAX,
  store: createRateLimitStore("public"),
  passOnStoreError: true,
  handler: (req, res) => {
    const locale = req.locale || "pt-BR";
    const message = i18n.t(`errors:${ErrorCodes.PUBLIC_RATE_LIMIT}`, {
      lng: locale,
    });
    res.status(429).json({
      ok: false,
      error: { message, code: ErrorCodes.PUBLIC_RATE_LIMIT },
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Project is behind `app.set("trust proxy", 1)` — opt out of the
  // upstream startup warning the other rate-limit middlewares also skip.
  validate: { ip: false, keyGeneratorIpFallback: false },
});
