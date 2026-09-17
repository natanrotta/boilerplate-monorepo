# Backend Architecture — Canonical Lifecycle (Authority)

**This document is the single source of truth for how a backend request flows from HTTP to database and back.**

Every backend skill (`/backend`, `/fullstack`, `/ai-backend`, `/architect`, `/code-review`, `/test`) MUST defer to this document. If a skill contradicts this file, this file wins. If you discover a divergence between this file and the actual code, update this file (PR + reviewer approval) — never let the skills drift.

> **📁 Physical organization is MODULE-FIRST — see [`backend-modules.md`](./backend-modules.md).**
> `apps/api/src` is organized `modules/<domain>/ · shared/ · core/ · test/`, NOT
> layer-first. The **layer + type** names below (`domain/entity/`,
> `application/use-case/`, `infrastructure/controller/`, …) are unchanged — they
> now nest **inside each module** (e.g. `modules/user/application/use-case/…`),
> with singular type subfolders. This doc owns the request **lifecycle & patterns
> (HOW)**; `backend-modules.md` owns **where a file goes (WHERE)**. The section
> paths below are the real module-first locations (`modules/<domain>/…`, `core/…`, `shared/…`).

---

## Stack

- **Runtime:** Node 22 (tsx in dev, tsc + `tsconfig.build.json` + node in prod)
- **HTTP:** Express 4
- **DB:** PostgreSQL 15 + Prisma 7
- **DI:** tsyringe (decorators + reflect-metadata) — tokens from `@core/container/tokens`
- **Validation:** Zod
- **Queue:** BullMQ + Redis
- **Logger:** Pino (`ILoggerProvider`) — never `console.log`
- **Errors:** Bugsnag (`core/service/error-reporter/`) + custom `AppError` hierarchy; `ErrorCodes` live in `@boilerplate/shared-types`
- **Lifecycle:** `core/service/lifecycle/` — SIGTERM/SIGINT + `uncaughtException`/`unhandledRejection` → staged teardown (`SHUTDOWN_TIMEOUT_MS`)
- **i18n:** i18next (pt-BR primary, en, es)
- **Tests:** Vitest 3.2 (globals)

---

## Physical Structure (module-first)

> The **module (feature) is the top-level unit**; the layer (domain → application →
> infrastructure) is a subfolder inside it, and type subfolders are **singular**
> (`entity/`, `use-case/`, `controller/`…). See `backend-modules.md` for the
> canonical skeleton, the domain list, and the `shared/` + `core/` split.

```
apps/api/src/
  modules/<domain>/            # the business — one folder per DOMAIN (auth + user to start)
    domain/
      entity/                  # <x>.entity.ts (+ .spec.ts co-located)
      repository/              # <x>-repository.interface.ts (PORT — contract + Create/Update types)
      provider/                # <x>-provider.interface.ts (module-owned PORT, only if any)
    application/
      use-case/{feature}/      # <action>-<x>.use-case.ts (one operation per file) + .spec.ts
      dto/                     # <x>.dto.ts (Zod schemas + inferred types + response interfaces)
      service/                 # domain-scoped app services (only if any)
      interface/               # non-repository ports (AI strategies, etc.)
    infrastructure/
      controller/              # <x>.controller.ts — thin: resolve use case, return envelope
      route/                   # <x>.routes.ts (feature routes; the aggregator lives in core/http)
      repository/              # prisma-<x>-repository.ts (Prisma impl of the domain port)
      provider/                # concrete adapters (external service clients, only if any)
    util/  constant/           # domain-flavored helpers / constants (business names)
    test/                      # <x>.factory.ts (test data builders for THIS module)
    <domain>.module.ts         # DI wiring: register<Domain>Module(container) — repo bindings only

  shared/                      # pure kernel — ZERO domain knowledge, importable anywhere
    error/                     # AppError hierarchy + ErrorCodes enum
    i18n/                      # i18next config + locales/{pt-BR,en,es}/
    util/                      # html, parse-expires-in, safe-s3-delete, extract-s3-key (named by purpose)
    constant/                  # defaults, image-upload
    policy/                    # (none yet) reusable authz helpers for an explicit post-read check
    provider/                  # generic provider PORTS (ICacheProvider, IJwtProvider, IQueueProvider…)
    dto/                       # common.dto (UuidParamSchema — the /:id route param every module shares)

  core/                        # the chassis — boots the app, no business rule
    http/                      # app.ts, routes/index.ts (aggregator) + route-mount.spec.ts, middlewares/, helpers/, logger.ts, types/
    container/                 # tsyringe DI composition root (index.ts) + tokens.ts + boot guards
    config/                    # Zod-validated env: env.ts (dotenv + parse + exit) over schema/<concern>.schema.ts
    database/                  # prisma/prisma-client.ts, prisma-error-mapper.ts (mapPrismaError)
    provider/                  # concrete generic impls (RedisCache, BullMQQueue, S3Storage, Jwt, Bcrypt…)
    service/                   # cross-cutting (error-reporter/Bugsnag, scheduler, lifecycle = graceful shutdown)
    bootstrap/                 # BullMQ queue + processor registration (called from main.ts)

  test/                        # cross-module test kit: mocks/ + factories/ (aggregator barrel)
  scripts/                     # operational tools (seeds) — run by hand / CI
  generated/                   # Prisma client (build artifact, gitignored) — via @generated alias
  main.ts                      # bootstrap only: error reporter → container → shutdown plan → listen
```

**Path aliases:** `@modules/*` `@core/*` `@shared/*` `@test/*` `@generated/*`. The old
`@domain` / `@application` / `@infrastructure` / `@tests` are **gone**. DI tokens are imported from
`@core/container/tokens` (`DI_TOKENS.X` — typed string keys; never a bare string literal).

**Dependency rule (inward only, unchanged):** `domain` ← `application` ← `infrastructure` inside each
module. `modules/` may import `shared/` and `core/` (ports); `core/` may import `shared/`; `shared/`
imports nobody. A module NEVER imports another module's `infrastructure/` — only its `domain/` or
`application/`. The one external package any layer (domain included) may import is
`@boilerplate/shared-types` — the zero-dependency wire contract — and in `domain/` only as `import type` /
`export type` of a contract union or DTO (`ErrorCodes` is the one value export). Violations are blocking. Full skeleton + "where do I put X?" cheat-sheet in
[`backend-modules.md`](./backend-modules.md).

---

## Canonical Request Lifecycle

For `PUT /auth/profile` (the real flow — `modules/auth`):

1. `modules/auth/infrastructure/route/auth.routes.ts` → router matches verb/path (mounted at `/auth` by `core/http/routes/index.ts`)
2. `authMiddleware()` — verifies the JWT from the `boilerplate_at` cookie, loads the user, attaches `req.auth = { userId, language, scope? }`
3. `validateRequest({ body: UpdateProfileDTOSchema })` — Zod parse; on failure throws `ValidationError`
4. `asyncHandler(controller.updateProfile.bind(controller))` — wraps async to forward rejections to error middleware
5. `AuthController.updateProfile(req, res)` — `container.resolve(UpdateProfileUseCase).execute(req.auth.userId, req.body)`
6. Use case: validates preconditions → calls the repository → triggers side effects (queue jobs, cache eviction) → returns response DTO
7. `PrismaUserRepository.update()` → `toEntity()` → returns domain entity
8. Controller responds: `res.status(200).json({ ok: true, data: result })`
9. Any thrown error → `errorHandlerMiddleware` → translates via i18n → `{ ok: false, error: { message, code, details? } }` with the right HTTP status

---

## Patterns by Layer

### Entity (`modules/<domain>/domain/entity/{entity}.entity.ts`)

```typescript
export interface UserProps {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class User {
  private readonly props: UserProps;
  constructor(props: UserProps) { this.props = props; }

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get email(): string { return this.props.email; }
  // ... one getter per field

  public toJSON() {
    const { passwordHash, ...safe } = this.props;
    return safe;  // omit sensitive fields here (password, tokens)
  }
}
```

**Rules:** immutable props, private; only getters; `toJSON()` controls serialization and is typed with the response DTO from `@boilerplate/shared-types` (the web consumes the same type; status/type unions live in `domain/value-object/` and are re-exported from the package) — and a projection with a DIFFERENT exposure gets its own named method instead of a flag (`toMetadata()` hides the hash; never a `toJSON(includeSecret)`); no business behavior in entities (use cases own logic) — derived read-only getters over own state (`user.isActive`) are fine and preferred over `status === "ACTIVE"` literals in use cases; nested relations as `Xxx[]` of IDs or nested entities.

### Repository Interface (`modules/<domain>/domain/repository/{entity}-repository.interface.ts`)

```typescript
export interface CreateUserData { name: string; email: string; passwordHash: string; }
export interface UpdateUserData { name?: string; email?: string; }

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
}
```

**Rules:** when a resource is owned, every **request-driven** method takes the owner id **first** (`findById(userId, id)`, `delete(userId, id)` — R1) and returns `null` on a miss (the use case turns it into `NotFoundError`, R3); **system-triggered** methods (cron, a queue processor, the `/api/health` aggregate) are suffixed `*Internal` / named `listAll`, documented in the interface, and never reachable from a user request; `Create*` has required fields; `Update*` is all-optional with `| null` for clearable fields; a paginated list returns `{ data, total }`. (This is the same shape a multi-tenant app uses with `accountId` — see § Resource ownership.)

### Prisma Repository (`modules/<domain>/infrastructure/repository/prisma-{entity}-repository.ts`)

```typescript
@injectable()
export class PrismaUserRepository implements IUserRepository {
  private toEntity(row: UserRow): User {
    return new User({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    });
  }

  async findById(id: string): Promise<User | null> {
    try {
      const row = await prisma.user.findFirst({
        where: { id, deleted_at: null },
      });
      return row ? this.toEntity(row) : null;
    } catch (error) { throw mapPrismaError(error); }
  }
}
```

**Rules:** `@injectable()`; private `toEntity()` (snake_case → camelCase); a private `includeRelations` getter for a reusable join shape (with soft-delete on relations) when the entity has any; **every** Prisma catch → `mapPrismaError(error)`; soft-delete = `update({ deleted_at: new Date() })`, never physical, on user-facing records; `deleted_at: null` on every read, plus the owner column on every request-driven read of an owned row; `prisma.$transaction` for multi-table writes; `Promise.all([findMany, count])` for paginated reads.

### Use Case (`modules/<domain>/application/use-case/{feature}/{action}-{entity}.use-case.ts`)

```typescript
@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UserRepository") private readonly userRepo: IUserRepository,
    @inject("HashProvider") private readonly hashProvider: IHashProvider,
  ) {}

  async execute(data: CreateUserDTO): Promise<UserResponseDTO> {
    // 1. Validate preconditions (existence, uniqueness, state) — throw typed errors with ErrorCodes
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new ConflictError("Email already in use", undefined, ErrorCodes.AUTH_EMAIL_ALREADY_EXISTS);
    // 2. Mutate via repository
    const passwordHash = await this.hashProvider.hash(data.password);
    const user = await this.userRepo.create({ name: data.name, email: data.email, passwordHash });
    // 3. Side effects (queue, cache invalidation, file cleanup) — after the mutation succeeds
    // 4. Return response DTO (never raw entity)
    return user.toJSON();
  }
}
```

**Rules:** one operation per use case; `@injectable()` + `@inject(DI_TOKENS.X)` for **all** deps — including concrete classes (the dev runtime `tsx` does not emit `design:paramtypes`, see `backend-modules.md` § DI); receives validated DTOs, returns response DTOs; **never** touches `Request`/`Response`; throws `AppError` subclass with `ErrorCodes`; queues background jobs **after** successful mutations; evicts caches immediately after writes; write-before-send for anything that leaves the process (persist the row, **then** call the external service — the id you return must already be committed); use CAS for state transitions with concurrent access; use `safeS3Delete()` for file cleanup (idempotent).

### DTO — Zod (`modules/<domain>/application/dto/{entity}.dto.ts`)

```typescript
export const CreateUserDTOSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export const UpdateUserDTOSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().email().optional(),
});

export type CreateUserDTO = z.infer<typeof CreateUserDTOSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserDTOSchema>;

export interface UserResponseDTO { id: string; name: string; email: string; createdAt: Date; }
```

**Reuse first:** `UuidParamSchema` from `shared/dto/common.dto.ts` for every `/:id` route param (add `PaginationQuerySchema` / `BulkDeleteDTOSchema` there the day a module needs them — never redeclare per module). **No custom messages on Zod checks** (`.uuid("…")`, `.min(1, "…")`): a schema-level message overrides the per-request error map that localizes validation errors (`validate-request.middleware.ts`) — the plain check is what makes `validation:string.uuid` apply. Always `.trim()` strings; use `z.coerce.date()` for date strings, `z.coerce.number()` for query numerics; nullable+optional means `null` clears and omit means unchanged.

### Controller (`modules/<domain>/infrastructure/controller/{entity}.controller.ts`)

```typescript
export class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(CreateUserUseCase);
    const result = await useCase.execute(req.body);
    return res.status(201).json({ ok: true, data: result });
  }
}
```

**Rules:** thin (resolve + delegate + envelope); auth via `req.auth.{userId,language,scope?}`; **never** put business logic here; **never** catch errors (let them bubble to error middleware).

### Route (`modules/<domain>/infrastructure/route/{entity}.routes.ts`)

```typescript
const userRoutes = Router();
const ctrl = container.resolve(UserController);

userRoutes.use(authMiddleware());

userRoutes.get("/me",
  asyncHandler(ctrl.getMe.bind(ctrl)));

userRoutes.patch("/me",
  validateRequest({ body: UpdateUserDTOSchema }),
  asyncHandler(ctrl.updateMe.bind(ctrl)));

userRoutes.delete("/me",
  asyncHandler(ctrl.deleteMe.bind(ctrl)));

export { userRoutes };
```

Register in `core/http/routes/index.ts`: `router.use("/<domain>", <domain>Routes)`. Declare literal routes (`/bulk`, `/me`) **before** `/:id` to avoid conflicts (`B-M3`).

> **`B-C14` — always CALL the factory.** `authMiddleware` is a factory: `router.use(authMiddleware())`, never `router.use(authMiddleware)`. Passed uncalled, Express runs the factory as the handler — it returns a function, never calls `next()`, and **every request on that router hangs** while the guard is silently absent. Same for `emailVerificationAuthMiddleware()`, `rejectScopedTokens()`, `requireScope("x")`, `bearerFromQueryToken()`. `core/http/routes/route-mount.spec.ts` scans every route file statically and `.claude/hooks/post-edit-backend.sh` greps for it.

**Middleware order:** `authMiddleware()` (or a scoped variant such as `emailVerificationAuthMiddleware()`) → `validateRequest({ params?, query?, body? })` → upload (when handling files) → `asyncHandler(handler)`. Rate limiters are mounted at the aggregator level (`core/http/routes/index.ts`: `authRateLimit` on `/auth`, `userRateLimit` after it; `publicRateLimit` on public surfaces).

### Dependency Injection (`core/container/index.ts`)

```typescript
container.registerSingleton<IUserRepository>(DI_TOKENS.UserRepository, PrismaUserRepository);
container.registerSingleton<IJwtProvider>(DI_TOKENS.JwtProvider, JsonWebTokenJwtProvider);
container.registerSingleton<IHashProvider>(DI_TOKENS.HashProvider, BcryptHashProvider);
```

**Rules:** every token comes from `DI_TOKENS` (`core/container/tokens.ts` — typed keys, one place); all singletons; use cases are **not** registered (resolved per-request via `container.resolve(UseCase)` so request-scoped state is fresh); each module exposes `register<Domain>Module(container)` in `<domain>.module.ts` for its own bindings, and `core/container/index.ts` composes them. Group registrations by category (repositories, providers, services, config values). Middleware factories capture their singletons **once** at creation time — never `container.resolve()` per request inside the handler.

---

## Cross-Cutting Concerns

### Auth context

`authMiddleware()` populates `req.auth = { userId, language, scope? }` from the session JWT in the `boilerplate_at` cookie. Treat it as guaranteed inside any route after the middleware runs. Never trust a client-supplied owner id — always read the acting user from `req.auth.userId`.

### Resource ownership

The boilerplate is **single-user by construction**: a row belongs to a `user_id`. The moment you add a resource owned by a user, **every request-driven read and write filters by the owner column**. Put the scoping in the **repository signature** — `findById(userId, id)`, `update(userId, id, …)`, `delete(userId, id)` — so a use case cannot forget it: a row of another owner resolves to `null` and the use case throws `NotFoundError` (never `ForbiddenError` — don't reveal that the resource exists for someone else). Read the owner from `req.auth.userId`, never from the request body. Never write `if (!entity || entity.userId !== callerId)` after an unscoped read (`B-H11`); if a post-read check is genuinely needed, add a `shared/policy/ensure-same-owner.ts` helper rather than an inline `if`. There is no `ensureOwner()` helper in the codebase today — don't cite one.

**System-triggered paths** (cron, a queue processor, the `/api/health` aggregate) have no requesting user: their repository methods are suffixed `*Internal` / named `listAll`, keyed by the primary key, documented in the interface, and never reachable from a user request. An entity returned by such a path carries its real owner id, but that value was **not** validated against a caller — never forward it into an owner-scoped method as a stand-in for `req.auth.userId` (confused deputy).

**`account_id` multi-tenancy is the documented upgrade path.** The day you add an account/tenant table, the same rules apply verbatim with `accountId` read from `req.auth` (never from the body), and `@@index([account_id])` replaces `@@index([user_id])`.

### Soft delete

Default. `delete()` = `update({ deleted_at: new Date() })`. Every read includes `deleted_at: null` in the `where` clause. Joins to soft-deletable relations include `where: { related: { deleted_at: null } }` in the include shape.

### Error handling

```typescript
throw new NotFoundError("User not found", undefined, ErrorCodes.USER_NOT_FOUND);
throw new ConflictError("Email already in use", undefined, ErrorCodes.AUTH_EMAIL_ALREADY_EXISTS);
throw new ValidationError("Invalid status", { field: ["..."] }, ErrorCodes.INVALID_STATUS);
throw new InternalError("S3 upload failed", originalError, ErrorCodes.FILE_UPLOAD_FAILED);
```

| Error | HTTP | Use when |
|-------|------|----------|
| `BadRequestError` | 400 | Invalid request shape / wrong state transition |
| `UnauthorizedError` | 401 | Missing/expired/invalid token |
| `ForbiddenError` | 403 | Authenticated but lacks permission for this action |
| `NotFoundError` | 404 | Resource missing OR cross-tenant access |
| `ConflictError` | 409 | Duplicate / already-linked |
| `ValidationError` | 422 | Schema validation failure |
| `TooManyRequestsError` | 429 | Rate limited |
| `InternalError` | 500 | Unexpected error |
| `ServiceUnavailableError` | 503 | External service down |

When adding a new `ErrorCode`: (1) add to `shared/error/error-codes.ts`, (2) add translation to all 3 locale files (`shared/i18n/locales/{pt-BR,en,es}/errors.json`).

### Response envelope

```typescript
// Success
{ ok: true, data: T }

// Paginated
{ ok: true, data: { data: T[], meta: { page, limit, total, totalPages } } }

// Error
{ ok: false, error: { message: string, code: string, details?: unknown } }

// 202 Accepted (async / queued)
{ ok: true }

// 204 No Content (sync delete)
// (no body)
```

`message` is i18n-translated server-side based on `Accept-Language`.

### HTTP status mapping

| Operation | Status | Body |
|-----------|--------|------|
| GET success | 200 | envelope |
| POST create | 201 | envelope |
| PUT/PATCH update | 200 | envelope |
| DELETE sync | 204 | (none) |
| DELETE async (queued) | 202 | `{ ok: true }` |

### Pagination

No list endpoint paginates yet. The first one that needs it creates `PaginationQuerySchema` (`page`, `limit`, `search`, `sortBy`, `sortOrder`) in `shared/dto/common.dto.ts` and `buildPaginationMeta(total, limit, page)` in `shared/util/pagination.ts`. Default `limit=20`, max `limit=100`. Offset-based: `skip: (page-1)*limit, take: limit`. Use `Promise.all([findMany, count])` for parallel data + count.

### Queues / Jobs (BullMQ)

Bootstrap in `core/bootstrap/{feature}-queue.bootstrap.ts`:

```typescript
export function bootstrapUserQueues(): void {
  const queueProvider = container.resolve<IQueueProvider>(DI_TOKENS.QueueProvider);
  queueProvider.createQueue("user-operations");
  queueProvider.registerProcessor("user-operations",
    createSendWelcomeEmailProcessor(/* injected deps */),
    /* concurrency */ 3);
}
```

Call `bootstrap<Feature>Queues()` from `main.ts` (create `core/bootstrap/` on first use — today only the cron is wired, by `core/service/scheduler/`; a BullMQ processor follows the shape above, next to the `IQueueProvider` / `IFlowProducer` ports). Defaults: 3 attempts, exponential backoff (1s base), `removeOnComplete: 100`, `removeOnFail: 200`. Job IDs should be deterministic when duplicate prevention matters (`jobId: ${entityType}:${entityId}`). Bull Board admin UI at `/admin/queues` (dev only).

### When to queue vs sync (decision)

| Scenario | Queue? | Why |
|----------|--------|-----|
| Sending email/SMS/notification | **Yes** | External, can fail, retry |
| Bulk delete (>10) | **Yes** | Risk of timeout; needs retry per item |
| Heavy file ops (S3 cleanup, image processing) | **Yes** | Slow, user shouldn't wait |
| Call to a slow/expensive external API | **Yes** | Expensive, slow, must retry |
| LLM call / embedding generation | **Yes** | Expensive, slow, must retry (R23) |
| Simple CRUD (create/get/update/list) | **No** | Fast; user expects immediate feedback |

### When to use a transaction

| Scenario | Tx? | Why |
|----------|-----|-----|
| Create entity + relation rows | **Yes** | Partial state = orphan rows |
| Multi-table signup (User + related rows) | **Yes** | Atomic |
| Cascading delete with relations | **Yes** | All-or-nothing |
| Single-table CRUD | **No** | Prisma op already atomic |
| Update + S3 cleanup | **No** | Cleanup is idempotent (use `safeS3Delete`) |

### Logging

Use `ILoggerProvider` (Pino) — never `console.log`. Structured fields: `userId`, `entityId`, `latencyMs`, `outcome`. **Never** log PII or secrets: no full names or e-mail addresses in plaintext where avoidable, no passwords, reset/verification tokens or cookies, no request bodies containing personal data, no S3 signed URLs, no full LLM prompts. The pino `redact` list + `SENSITIVE_BODY_FIELDS` (`core/http/logger.ts`) are defense in depth, not a license.

### i18n

3 locales: pt-BR (default), en, es. `localeMiddleware` reads `Accept-Language` and sets `req.locale`. Error messages auto-translated by `errorHandlerMiddleware`. Add new ErrorCodes to **all 3** locale files.

---

## Reuse-First Tables

Before creating anything new, check this table.

### Existing Providers (`core/container/index.ts` → DI tokens)

| Token | Interface | Implementation | Purpose |
|-------|-----------|----------------|---------|
| `DI_TOKENS.JwtProvider` | `IJwtProvider` | `JsonWebTokenJwtProvider` | Sign/verify tokens, refresh pairs |
| `DI_TOKENS.HashProvider` | `IHashProvider` | `BcryptHashProvider` | Password hashing |
| `DI_TOKENS.CacheProvider` | `ICacheProvider` | `RedisCacheProvider` | Generic Redis caching |
| `DI_TOKENS.StorageProvider` | `IStorageProvider` | `S3StorageProvider` | S3 upload / delete / signed URL |
| `DI_TOKENS.QueueProvider` | `IQueueProvider` | `BullMQQueueProvider` | Queues with retry/backoff |
| `DI_TOKENS.FlowProducer` | `IFlowProducer` | BullMQ flow producer | Parent/child job graphs |
| `DI_TOKENS.EventBus` | `IEventBus` | Redis pub/sub | Cross-process events (SSE fan-out) |
| `DI_TOKENS.LoggerProvider` | `ILoggerProvider` | `PinoLoggerProvider` | Structured logging |
| `DI_TOKENS.MailProvider` | `IMailProvider` | Resend impl | Transactional e-mail |
| `DI_TOKENS.AppConfig` | `AppConfig` | the parsed env object | Typed config, injected — never `process.env` |
| `DI_TOKENS.DatabaseStatusProvider` / `NodeExporterMetricsProvider` / `CiProvider` | `I*Provider` | Postgres probe / node_exporter / GitHub Actions | The `/api/health` + status surfaces |

> Add a new **generic** provider port to `shared/provider/` (interface) and its
> concrete impl to `core/provider/<kind>/`; a **domain-flavored** port lives in
> `modules/<domain>/domain/provider/` with its adapter in
> `modules/<domain>/infrastructure/provider/` (see `backend-modules.md` § port vs
> impl split). Every token is a `DI_TOKENS` entry.

### Existing Services

| Token / caller | Class | Purpose |
|---|---|---|
| `DI_TOKENS.AuthProfileBuilder` | `modules/auth/application/service/auth-profile.builder.ts` (registered in `auth.module.ts`) | Builds the `/auth/me` profile |
| — (called from `main.ts`) | `core/service/error-reporter/` · `core/service/scheduler/` · `core/service/lifecycle/` | Bugsnag facade · node-cron · SIGTERM/SIGINT + uncaught error → staged teardown → exit |

### Shared Utilities

| Utility | Location | Purpose |
|---------|----------|---------|
| `safeS3Delete()` | `shared/util/safe-s3-delete.ts` | Delete an S3 object without throwing |
| `extractS3Key()` | `shared/util/extract-s3-key.ts` | Extract the object key from an S3 URL |
| `parseExpiresIn()` | `shared/util/parse-expires-in.ts` | `15m` / `30d` → milliseconds |
| `escapeHtml()` | `shared/util/html.ts` | Escape user text before it enters an e-mail template |
| `UuidParamSchema` | `shared/dto/common.dto.ts` | The `/:id` route param schema |
| `IMAGE_UPLOAD` constants | `shared/constant/image-upload.ts` | Allowed MIME types + max bytes, shared with `@boilerplate/shared-types` |
| `mapPrismaError()` | `core/database/prisma/prisma-error-mapper.ts` | Translate Prisma errors → AppError |
| `buildPaginationMeta()` | `shared/util/pagination.ts` *(not created yet — add on the first paginated endpoint)* | `{ page, limit, total, totalPages }` |

---

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Entity | `{entity}.entity.ts` | `user.entity.ts` |
| Repo interface | `{entity}-repository.interface.ts` | `user-repository.interface.ts` |
| Repo impl | `prisma-{entity}-repository.ts` | `prisma-user-repository.ts` |
| Use case | `{action}-{entity}.use-case.ts` | `create-user.use-case.ts` |
| DTO | `{entity}.dto.ts` | `user.dto.ts` |
| Controller | `{entity}.controller.ts` | `user.controller.ts` |
| Route | `{entity}.routes.ts` | `user.routes.ts` |
| Middleware | `{name}.middleware.ts` | `auth.middleware.ts` |
| Provider interface | `{type}-provider.interface.ts` | `jwt-provider.interface.ts` |
| Provider impl | `{impl}-{type}-provider.ts` | `bcrypt-hash-provider.ts` |
| Queue bootstrap | `{feature}-queue.bootstrap.ts` | `user-queue.bootstrap.ts` |
| Processor / job | `{action}-{entity}.processor.ts` · `{name}.job.ts` | `send-welcome-email.processor.ts` |
| Value object | `{concept}-{kind}.ts` | `user-status.ts` |
| Module registration | `{domain}.module.ts` | `auth.module.ts` |
| Test | `*.spec.ts` (next to source) | `create-user.spec.ts` |
| Factory | `{entity}.factory.ts` | `user.factory.ts` |
| Mock | in `test/mocks/repositories.mock.ts` (or an `in-memory-*.repository.ts` in the module's `test/`) | `mockUserRepository()` |

**Database (Prisma):** `snake_case` table + column names with `@@map`. UUID PKs. `created_at`/`updated_at` timestamps. `deleted_at DateTime?` for soft delete. `@@index([user_id])` on every owned table (`@@index([account_id])` once you add tenancy). Cascades: `Cascade` for owned deps, `SetNull` for optional refs.

---

## Tests

- **Location:** `*.spec.ts` next to source (`create-user.use-case.spec.ts` next to `create-user.use-case.ts`)
- **Factories:** `apps/api/src/modules/<domain>/test/{entity}.factory.ts` (sequential ids, fixed `new Date("2025-01-01")`)
- **Mocks:** `apps/api/src/test/mocks/repositories.mock.ts`, `providers.mock.ts` (`MockOf<T>` with `vi.fn()`)
- **SUT name:** `sut` (System Under Test)
- **Vitest globals:** do NOT import `describe`/`it`/`expect`
- **Required scenarios per use case:** happy path, NotFoundError + code, ConflictError, ForbiddenError, edge cases (empty, null, pagination limits), side effects (queue called, cache invalidated, etc.)
- **Required scenarios per DTO:** required fields valid + missing, optional present + absent, coercion (date/number), enums, UUID, limits

See `/test` skill for the full template.

---

## Adding a New Feature — Order of Operations

1. **DB schema** — add model in `prisma/schema.prisma`; run `yarn db:migrate <name>`; `yarn db:generate`
2. **Domain** — entity → repository interface
3. **Application** — DTOs (Zod) → use case(s)
4. **Infrastructure** — Prisma repository → controller → routes → register routes in `routes/index.ts`
5. **Wiring** — register the repository (and any new provider/service) in the module's `<domain>.module.ts` with an explicit `DI_TOKENS` entry, composed by `core/container/index.ts`; add the `ErrorCodes` entry in `packages/shared-types/src/error-codes.ts`; add translations in the 3 locales (`error-codes.spec.ts` pins the parity)
6. **Background jobs** (if needed) — processor + bootstrap; call from `main.ts`
7. **Tests** — factory + mock (if new entity/repo) → use case spec → DTO spec → entity spec → controller spec
8. **Quality gate** — `yarn type-check && yarn lint && yarn test`

**Cross-reference:** see `.claude/patterns/code-review-checklist.md` for what gets flagged in review.
