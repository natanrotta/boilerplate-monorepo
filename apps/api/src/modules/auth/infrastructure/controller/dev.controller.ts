import { Request, Response } from "express";
import { container } from "tsyringe";
import { randomUUID } from "crypto";
import {
  ListDevUsersUseCase,
  DevImpersonateUseCase,
} from "@modules/auth/application/use-case/dev";
import {
  setAuthCookies,
  setAccessTokenCookie,
} from "@core/http/helpers/auth-cookies";
import { logger } from "@core/http/logger";

/**
 * Controller for the dev-only quick-login endpoints. These routes exist only
 * when NODE_ENV === "local" AND DEV_QUICK_LOGIN_ENABLED — see `dev.routes.ts`
 * and `core/http/routes/index.ts`.
 */
export class DevController {
  async listUsers(_req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(ListDevUsersUseCase);
    const users = await useCase.execute();

    return res.status(200).json({ ok: true, data: users });
  }

  async impersonate(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(DevImpersonateUseCase);
    const result = await useCase.execute(req.body.userId);

    // Same cookie set as a real sign-in, so the rest of the app cannot tell
    // the difference.
    const csrfToken = randomUUID();
    setAuthCookies(res, result.refreshToken, csrfToken);
    setAccessTokenCookie(res, result.token);

    logger.warn({ userId: result.user.id, ip: req.ip }, "[DEV] Impersonate");

    return res.status(200).json({
      ok: true,
      data: { user: result.user, token: result.token, csrfToken },
    });
  }
}
