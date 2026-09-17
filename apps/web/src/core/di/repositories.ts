import type { SettingsRepository } from "@/modules/settings/domain/repositories/SettingsRepository";
import type { AuthRepository } from "@/modules/auth/domain/repositories/AuthRepository";

import { HttpSettingsRepository } from "@/modules/settings/infrastructure/repositories/HttpSettingsRepository";
import { HttpAuthRepository } from "@/modules/auth/infrastructure/repositories/HttpAuthRepository";

/**
 * The composition root for the web client: one instance per repository,
 * resolved by the module hooks that consume them. A new module registers its
 * HTTP implementation here and never lets presentation import `infrastructure/`
 * directly.
 */
export const repositories = {
  settings: new HttpSettingsRepository() as SettingsRepository,
  auth: new HttpAuthRepository() as AuthRepository,
} as const;
