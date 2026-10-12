import { Router, Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { DevController } from "../controller/dev.controller";
import { validateRequest, asyncHandler } from "@core/http/middlewares";
import { DevImpersonateDTOSchema } from "@modules/auth/application/dto/dev.dto";
import { env, isDevQuickLoginEnabled } from "@core/config";
import { NotFoundError } from "@shared/error";

/**
 * Dev-only routes for the quick-login panel on the sign-in page.
 *
 * SECURITY: these routes bypass password authentication and issue real
 * sessions. They MUST NEVER be reachable outside a local development machine.
 * Defense in depth:
 *   1. `core/http/routes/index.ts` only mounts `/dev` when
 *      NODE_ENV === "local" AND DEV_QUICK_LOGIN_ENABLED === true (explicit
 *      opt-in — NODE_ENV alone defaults to "local", which is fail-unsafe).
 *   2. This guard re-checks the SAME two conditions on every request and
 *      answers 404 otherwise, so the routes are indistinguishable from
 *      non-existent anywhere else.
 *   3. It also answers 404 unless the request comes FROM this machine and
 *      was addressed TO it. The API listens on every interface, so each half
 *      closes a different door: the socket's peer address must be loopback
 *      (a peer on the same network cannot fake that), and the `Host` header
 *      must be `localhost | 127.0.0.1 | [::1]` (a web page using DNS
 *      rebinding connects from this machine, but with the attacker's domain
 *      as `Host`).
 *
 *      A local proxy in front of the API (the Vite dev server forwards
 *      `/api`) makes every caller a loopback peer, so the address the proxy
 *      reports for ITS client (`req.ip`, the last `X-Forwarded-For` hop under
 *      `trust proxy: 1`) must be loopback too — `apps/web/vite.config.ts`
 *      sets `xfwd` for exactly this. Without a proxy `req.ip` is the peer.
 *
 * Consequence: quick login works with the API running on the host (`yarn dev`,
 * the e2e runner). An API inside a container sees the bridge gateway as its
 * peer, so the panel stays hidden there — sign in with the seeded password.
 */
const LOOPBACK_HOSTS: readonly string[] = ["localhost", "127.0.0.1", "[::1]"];

/** `host[:port]` → `host`, keeping a bracketed IPv6 literal whole. */
function hostnameOf(hostHeader: string | undefined): string {
  if (!hostHeader) return "";
  const host = hostHeader.trim().toLowerCase();
  if (host.startsWith("[")) return host.slice(0, host.indexOf("]") + 1);
  return host.split(":")[0] ?? "";
}

/** How Node spells the address of a connection from this machine. */
const LOOPBACK_PEERS: readonly string[] = [
  "127.0.0.1",
  "::1",
  "::ffff:127.0.0.1",
];

export function localOnlyGuard(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (
    !isDevQuickLoginEnabled(env) ||
    // The socket for the direct peer: `req.ip` alone follows a header…
    !LOOPBACK_PEERS.includes(req.socket?.remoteAddress ?? "") ||
    // …and `req.ip` for the caller BEHIND a local proxy (see above).
    !LOOPBACK_PEERS.includes(req.ip ?? "") ||
    !LOOPBACK_HOSTS.includes(hostnameOf(req.headers.host))
  ) {
    throw new NotFoundError("Not found");
  }
  next();
}

const devRoutes = Router();
const devController = container.resolve(DevController);

devRoutes.use(localOnlyGuard);

devRoutes.get(
  "/users",
  asyncHandler(devController.listUsers.bind(devController)),
);

devRoutes.post(
  "/impersonate",
  validateRequest({ body: DevImpersonateDTOSchema }),
  asyncHandler(devController.impersonate.bind(devController)),
);

export { devRoutes };
