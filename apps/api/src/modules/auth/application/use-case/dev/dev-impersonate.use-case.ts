import { inject, injectable } from "tsyringe";
import { DI_TOKENS } from "@core/container/tokens";
import { IUserRepository } from "@modules/user/domain/repository/user-repository.interface";
import { IJwtProvider } from "@shared/provider";
import { SignInResponseDTO } from "../../dto/auth.dto";
import { NotFoundError } from "@shared/error";
import { ErrorCodes } from "@shared/error/error-codes";
import { AuthProfileBuilder } from "@modules/auth/application/service/auth-profile.builder";

/**
 * Dev-only impersonation: issues a valid session for any active user id
 * without a password. The exact token-issuance path of `SignInUseCase` minus
 * the credential checks.
 *
 * The route that exposes this use case MUST be gated by NODE_ENV === "local"
 * AND DEV_QUICK_LOGIN_ENABLED — see `dev.routes.ts`.
 */
@injectable()
export class DevImpersonateUseCase {
  constructor(
    @inject(DI_TOKENS.UserRepository)
    private readonly userRepository: IUserRepository,
    @inject(DI_TOKENS.JwtProvider)
    private readonly jwtProvider: IJwtProvider,
    @inject(DI_TOKENS.AuthProfileBuilder)
    private readonly profileBuilder: AuthProfileBuilder,
  ) {}

  async execute(userId: string): Promise<SignInResponseDTO> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.isActive || user.deletedAt) {
      throw new NotFoundError(
        "User not found",
        undefined,
        ErrorCodes.USER_NOT_FOUND,
      );
    }

    const { token, refreshToken, tokenExpiresAt, refreshTokenExpiresAt } =
      this.jwtProvider.generateTokenPair({
        userId: user.id,
        tokenVersion: user.tokenVersion,
      });

    await this.userRepository.setTokenData(user.id, {
      tokenExpiresAt,
      refreshTokenHash: this.jwtProvider.hashRefreshToken(refreshToken),
      refreshTokenExpiresAt,
    });

    return {
      user: this.profileBuilder.buildProfile(user),
      token,
      refreshToken,
    };
  }
}
