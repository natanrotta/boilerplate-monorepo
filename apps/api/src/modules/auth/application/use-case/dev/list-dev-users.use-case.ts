import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "@core/container/tokens";
import { IUserRepository } from "@modules/user/domain/repository/user-repository.interface";
import { DevUserListItemDTO } from "../../dto/dev.dto";

/** The quick-login panel is a shortcut, not a user browser. */
export const DEV_USERS_LIMIT = 50;

/**
 * Lists the active users of the database for the dev-only quick-login panel
 * on the sign-in page (single-user app, so there is no
 * account / membership fan-out).
 *
 * The route that exposes this use case MUST be gated by NODE_ENV === "local"
 * AND DEV_QUICK_LOGIN_ENABLED — see `dev.routes.ts`.
 */
@injectable()
export class ListDevUsersUseCase {
  constructor(
    @inject(DI_TOKENS.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<DevUserListItemDTO[]> {
    const users = await this.userRepository.findActive(DEV_USERS_LIMIT);

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    }));
  }
}
