import { z } from "zod";
import { coreSchema } from "./core.schema";
import { databaseSchema } from "./database.schema";
import { redisSchema } from "./redis.schema";
import { authSchema } from "./auth.schema";
import { mailSchema } from "./mail.schema";
import { storageSchema } from "./storage.schema";
import { observabilitySchema } from "./observability.schema";
import { rateLimitSchema } from "./rate-limit.schema";

/**
 * The env contract, one schema per concern, merged FLAT on purpose: `env.X`
 * keeps the SCREAMING_CASE name of the variable, the `AppConfig` port is
 * satisfied structurally, and the env templates document every key (pinned by
 * `env-example.spec.ts`). Pure — no dotenv, no `process.env`, no exit — so
 * the real contract is what `env.spec.ts` tests.
 *
 * Adding a concern: create `<concern>.schema.ts`, spread its `.shape` here,
 * then document the new keys in `apps/api/.env.example` AND
 * `infra/.env.prod.example` (the gate fails otherwise).
 */
export const envObjectSchema = z.object({
  ...coreSchema.shape,
  ...databaseSchema.shape,
  ...redisSchema.shape,
  ...authSchema.shape,
  ...mailSchema.shape,
  ...storageSchema.shape,
  ...observabilitySchema.shape,
  ...rateLimitSchema.shape,
});

/**
 * What `env.ts` parses. Identical to `envObjectSchema` today; cross-field
 * rules (`.superRefine(...)`) belong here so `envObjectSchema.shape` stays
 * introspectable for the template gate.
 */
export const envSchema = envObjectSchema;

export type Env = z.infer<typeof envSchema>;
