import {
  DEV_USERS_LIMIT,
  ListDevUsersUseCase,
} from "./list-dev-users.use-case";
import { mockUserRepository } from "@test/mocks";
import { makeUser } from "@test/factories";

describe("ListDevUsersUseCase", () => {
  let sut: ListDevUsersUseCase;
  let userRepository: ReturnType<typeof mockUserRepository>;

  beforeEach(() => {
    vi.clearAllMocks();
    userRepository = mockUserRepository();
    sut = new ListDevUsersUseCase(userRepository);
  });

  it("returns only the panel fields of the active users (never the password hash or token data)", async () => {
    userRepository.findActive.mockResolvedValue([
      makeUser({
        id: "u1",
        name: "Demo",
        email: "demo@example.com",
        avatarUrl: null,
      }),
    ]);

    const result = await sut.execute();

    expect(userRepository.findActive).toHaveBeenCalledWith(DEV_USERS_LIMIT);
    expect(result).toEqual([
      { id: "u1", name: "Demo", email: "demo@example.com", avatarUrl: null },
    ]);
  });

  it("returns an empty list when the database has no active user", async () => {
    userRepository.findActive.mockResolvedValue([]);

    expect(await sut.execute()).toEqual([]);
  });
});
