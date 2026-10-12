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
 * What `env.ts` parses: `envObjectSchema` plus the cross-field rules
 * (`.superRefine(...)`), which live here so `envObjectSchema.shape` stays
 * introspectable for the template gate.
 */
/** Environments that serve real users — the dev quick login may not even be configured there. */
const DEPLOYED_ENVS: readonly string[] = ["staging", "production"];

export const envSchema = envObjectSchema.superRefine((value, ctx) => {
  // The passwordless dev quick login only ever works with NODE_ENV=local —
  // but a DEPLOY that carries the flag is a misconfiguration worth failing
  // loudly on, instead of one silent condition away from an open door.
  // (`test` / `development` are not rejected: the unit suite runs with
  // NODE_ENV=test on top of a developer's own `.env`.)
  if (value.DEV_QUICK_LOGIN_ENABLED && DEPLOYED_ENVS.includes(value.NODE_ENV)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["DEV_QUICK_LOGIN_ENABLED"],
      message:
        "DEV_QUICK_LOGIN_ENABLED=true is not allowed in staging/production",
    });
  }
});

export type Env = z.infer<typeof envSchema>;
