# @boilerplate/api

REST API of the boilerplate — Clean Architecture on a module-first codebase, with `auth` + `user` as the reference vertical slice.

**Stack:** Node.js 22 · Express 4 · TypeScript 5.8 · Prisma 7 (PostgreSQL 15) · Redis (BullMQ queues, caches, rate limits) · tsyringe (DI) · Zod · pino · Vitest 3.

---

## Architecture

Module-first: each domain owns its full vertical slice; the composition root wires everything with dependency injection. Where a file goes is defined by [`.claude/patterns/backend-modules.md`](../../.claude/patterns/backend-modules.md); how it is written, by [`.claude/patterns/backend.md`](../../.claude/patterns/backend.md).

```
apps/api/
├── prisma/                     # schema.prisma · migrations · seed.ts
├── Dockerfile                  # the ONE image (stages: base·deps·build·prod-deps·runtime·dev)
├── docker-entrypoint.sh        # migrate-on-boot, then `exec node dist/main.js`
└── src/
    ├── main.ts                 # boot only: error reporter → graceful shutdown → listen
    ├── modules/<domain>/       # domain/ (entity, value-object, repository port)
    │                           # application/ (dto, use-case, service) · infrastructure/
    │                           # (controller, route, repository) · <domain>.module.ts · test/
    ├── core/
    │   ├── config/             # env.ts + schema/ — Zod-validated environment (exits 1 on boot if invalid)
    │   ├── container/          # tsyringe DI container + DI_TOKENS
    │   ├── database/           # Prisma client, error mapper, DB status
    │   ├── http/               # Express app, routes, middlewares, logger
    │   ├── provider/           # cache, ci, event-bus, hash, jwt, logger, mail, metrics, queue, storage
    │   └── service/            # error-reporter, lifecycle (graceful shutdown), scheduler
    ├── shared/                 # pure kernel: constant, dto, error, i18n, provider ports, util
    ├── test/                   # cross-cutting test kit (setup-env, mocks, factories)
    └── generated/              # Prisma client (git-ignored, `prisma generate`)
```

Path aliases: `@modules/*`, `@core/*`, `@shared/*`, `@test/*`, `@generated/*`.

**Request lifecycle:** `Route → validateRequest (Zod) → Controller → Use case (@injectable) → Repository (Prisma, scoped by user_id) → Entity`. Controllers are thin and return the `{ ok, data }` envelope.

## Modules

| Module | Responsibility |
|---|---|
| **auth** | Sign-up/in (password + Google), refresh, sign-out, password reset, e-mail-verification PIN, own profile/avatar, account deletion. The only HTTP surface. |
| **user** | User identity core (entity + `UserStatus` value object + repository), consumed by `auth`. No HTTP surface — the unscoped `/api/users` CRUD was deleted, not fixed (it let any authenticated user read and delete any other). |

Adding a module: create the skeleton under `src/modules/<domain>/`, register its repositories and application services in `<domain>.module.ts`, call that from `core/container/index.ts`, and mount its router in `core/http/routes/index.ts` **below** `userRateLimit`. `route-mount.spec.ts` refuses a middleware factory mounted without calling it (`router.use(authMiddleware)` instead of `authMiddleware()`).

## Endpoints

```
GET  /healthz                    liveness — plain "ok", no DB
GET  /api/health                 { ok, version, uptimeSeconds } — version stamped at build time

/api/auth  POST /sign-up · /sign-in · /google · /refresh · /sign-out
           POST /password/request-reset · /password/reset
           POST /email-verification/send · /email-verification/verify
           GET  /me
           PUT  /profile · /profile/avatar
           DELETE /account
```

Session routes use httpOnly cookies + CSRF double-submit; the rate limiters are layered (global → auth → per-user).

## Database

Prisma against PostgreSQL 15. Models: `user`, `password_reset_token`, `email_verification_pin`. Enum: `user_status` (`ACTIVE` · `PENDING`, mirrored by `modules/user/domain/value-object/user-status.ts`).

The client is generated to `src/generated/prisma` (git-ignored) by `prisma generate` (runs on `postinstall`). In the container, `prisma migrate deploy` runs on boot (`docker-entrypoint.sh`, skip with `RUN_MIGRATIONS=false` when scaling past one replica).

## Environment

```bash
cp .env.example .env
```

Only `DATABASE_URL` and `JWT_SECRET` are required; everything else has a default or is optional (Redis, Resend, S3, Google OAuth, Bugsnag, metrics, rate limits). The schema lives in `src/core/config/schema/` — one file per concern, merged flat — and `src/core/config/env-example.spec.ts` fails when `.env.example` or `infra/.env.prod.example` drift from it in either direction.

`SHUTDOWN_TIMEOUT_MS` (default 30 s, max 60 s) caps the staged teardown in `core/service/lifecycle`: HTTP drain first, then queue/event-bus/flow-producer, then cache/rate-limit store. `main.ts` wires no signal handlers of its own.

`.env.e2e.example` holds the isolated e2e stack's values (API `3334`, web origin `http://localhost:3002`, Postgres `5433`, Redis `6380`); `apps/web/scripts/e2e-run.ts` falls back to it when `.env.e2e` is absent.

## Commands

From the repo root:

```bash
yarn backend:up            # Postgres + Redis + this API (foreground)
yarn backend:up-d          # ...detached
yarn db:migrate            # prisma migrate dev
yarn db:reset-seed         # drop + migrate + seed
yarn db:seed               # seed the demo user (demo@example.com / Demo1234!)
```

Inside the workspace (`apps/api`): `yarn dev`, `yarn build`, `yarn test`, `yarn type-check`, `yarn lint`, `yarn prisma:studio`.

Image (from the repo root):

```bash
docker build -f apps/api/Dockerfile --target runtime -t boilerplate-api .
docker build -f apps/api/Dockerfile --target dev     -t boilerplate-api:dev .
```

`runtime` runs as `node` (uid 1000), carries no devDependencies and no `.env`. Release and deploy: [`DEPLOY.md`](../../DEPLOY.md).

## Testing

Vitest, with `*.spec.ts` co-located next to the code it tests (use cases, entities, DTOs and controllers are mandatory — `.claude/hooks/check-test-coverage.sh` gates it):

```bash
yarn workspace @boilerplate/api test
```

`src/test/setup-env.ts` loads `.env` and then `.env.example`, so a fresh clone runs the whole suite without any local configuration.
