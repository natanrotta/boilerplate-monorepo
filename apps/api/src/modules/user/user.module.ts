import type { DependencyContainer } from "tsyringe";
import { DI_TOKENS } from "@core/container/tokens";
import { IUserRepository } from "@modules/user/domain/repository/user-repository.interface";
import { PrismaUserRepository } from "@modules/user/infrastructure/repository/prisma-user-repository";

/**
 * DI wiring for the user domain — the identity core. It owns the `User`
 * entity, its value objects and the repository; there is no `/api/users`
 * surface (the unscoped CRUD was deleted, not fixed). Everything a signed-in
 * user does to their own record lives in the `auth` module's use cases.
 */
export function registerUserModule(container: DependencyContainer): void {
  container.registerSingleton<IUserRepository>(
    DI_TOKENS.UserRepository,
    PrismaUserRepository,
  );
}
