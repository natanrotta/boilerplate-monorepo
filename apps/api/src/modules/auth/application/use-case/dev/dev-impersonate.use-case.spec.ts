import { DevImpersonateUseCase } from "./dev-impersonate.use-case";
import { mockUserRepository, mockJwtProvider } from "@test/mocks";
import { makeUser } from "@test/factories";
import { AuthProfileBuilder } from "@modules/auth/application/service/auth-profile.builder";
import { NotFoundError } from "@shared/error";
import { ErrorCodes } from "@shared/error/error-codes";

describe("DevImpersonateUseCase", () => {
  let sut: DevImpersonateUseCase;
  let userRepository: ReturnType<typeof mockUserRepository>;
  let jwtProvider: ReturnType<typeof mockJwtProvider>;

  beforeEach(() => {
    vi.clearAllMocks();
    userRepository = mockUserRepository();
    jwtProvider = mockJwtProvider();

    jwtProvider.generateTokenPair.mockReturnValue({
      token: "access-token",
      refreshToken: "refresh-token",
      tokenExpiresAt: new Date(),
      refreshTokenExpiresAt: new Date(),
    });
    userRepository.setTokenData.mockResolvedValue(undefined);

    sut = new DevImpersonateUseCase(
      userRepository,
      jwtProvider,
      new AuthProfileBuilder(),
    );
  });

  it("mints a full session for an active user and persists the refresh-token hash", async () => {
    const user = makeUser({ id: "u1", tokenVersion: 3 });
    userRepository.findById.mockResolvedValue(user);

    const result = await sut.execute("u1");

    expect(jwtProvider.generateTokenPair).toHaveBeenCalledWith({
      userId: "u1",
      tokenVersion: 3,
    });
    expect(userRepository.setTokenData).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({ refreshTokenHash: "hashed-refresh-token" }),
    );
    expect(result).toMatchObject({
      token: "access-token",
      refreshToken: "refresh-token",
      user: { id: "u1", email: user.email },
    });
  });

  it.each([
    ["missing", null],
    ["not active", makeUser({ status: "PENDING" })],
    ["soft-deleted", makeUser({ deletedAt: new Date() })],
  ])("throws USER_NOT_FOUND when the user is %s", async (_label, user) => {
    userRepository.findById.mockResolvedValue(user);

    await expect(sut.execute("u1")).rejects.toThrow(NotFoundError);
    await expect(sut.execute("u1")).rejects.toMatchObject({
      code: ErrorCodes.USER_NOT_FOUND,
    });
    expect(jwtProvider.generateTokenPair).not.toHaveBeenCalled();
    expect(userRepository.setTokenData).not.toHaveBeenCalled();
  });
});
