# Backend — Module-First Architecture

> Canonical reference for how `apps/api/src` is organized. Every backend
> specialist (`/backend`, `/fullstack`, `/ai-backend`) defers to this doc for
> **where a file goes**. The layering rules (Clean Architecture, dependency
> direction) are unchanged — this doc only changes the *physical organization*
> from **layer-first** to **module-first**.

## The one idea

The **module (feature) is the top-level unit**, and the **layer** (domain →
application → infrastructure) is a subfolder inside it. Within each layer,
files are grouped into **singular type subfolders** (`use-case/`, `dto/`,
`entity/`, `controller/`…). The file path *is* the documentation:

```
modules/user/application/use-case/update-user.use-case.ts
   └ module  └ layer      └ type      └ file
```

You read the path and you know: which feature, which layer, which kind of
artifact — without opening the file.

## Top level

```
apps/api/
  scripts/              # operational entrypoints (seeds, one-off tasks) — OUTSIDE src
  prisma/               # schema.prisma + migrations
  src/
    modules/            # everything the product does (one folder per DOMAIN)
    shared/             # pure kernel: zero domain knowledge, reusable anywhere
    core/               # the chassis: wires the app, no business rule
    test/               # cross-cutting test kit (aggregator mocks, vitest setup)
    main.ts             # bootstrap only: error reporter → container → shutdown plan → listen
```

Responsibility in one line each:

- **`modules/`** — the business. Each module owns its full vertical slice + its co-located tests + its factories.
- **`shared/`** — a pure library the modules consume (errors, i18n, generic helpers). No domain.
- **`core/`** — the skeleton that boots the app (HTTP chassis, DI, config, DB client, generic provider impls).
- **`test/`** — test plumbing that belongs to nobody in particular.
- **`scripts/`** — operational tools, run by hand / CI. Not part of the running server.

## The canonical module skeleton (always identical)

Every folder in `modules/` has **exactly** this tree. Predictability is the point.

```
modules/<domain>/
  domain/
    entity/            <x>.entity.ts            (+ <x>.entity.spec.ts)
    value-object/      <x>-status.ts            (vocabulary + pure rules, only if any)
    repository/        <x>.repository.ts        (interface = port)
    provider/          <x>-provider.ts          (module-owned port, only if any)
  application/
    use-case/          create-<x>.use-case.ts   (+ .spec.ts)
    dto/               <x>.dto.ts               (Zod)
    service/           <x>.service.ts           (app service, only if any — registered in <domain>.module.ts)
    listener/          register-<x>-listeners.ts (domain-event subscribers, only if any)
  infrastructure/
    controller/        <x>.controller.ts        (+ .spec.ts)
    route/             <x>.routes.ts
    repository/        prisma-<x>.repository.ts  (implementation)
    provider/          <adapter>.ts             (port implementation, only if any)
    middleware/        <x>.middleware.ts        (module-owned HTTP guard, only if any)
    job/               <x>.job.ts               (BullMQ processor, only if any)
    health/            <x>-health.ts            (contribution to GET /api/health, only if any)
  util/                <x>-helper.ts            (domain-flavored helpers — see below)
  constant/            <x>.constant.ts          (domain constants)
  test/                <x>.factory.ts           (test data builders)
  <domain>.module.ts   DI registrations owned by this module
  <domain>.module.ts   # DI wiring: binds this module's interfaces → impls
```

Subfolders that have no files for a given module simply don't exist yet — but
when they do, they use exactly these names.

### Naming convention

- Type subfolders are **singular**: `use-case/`, `dto/`, `entity/`, `repository/`, `controller/`, `route/`, `provider/`, `util/`, `constant/`.
- File suffixes are unchanged from today: `*.use-case.ts`, `*.entity.ts`, `*.repository.ts` (interface), `prisma-*.repository.ts` (impl), `*.controller.ts`, `*.route.ts`, `*.dto.ts`, `*.spec.ts`.

## Tests

Unit specs are **co-located** — the `.spec.ts` lives in the *same subfolder* as
the file it tests (this is already the project rule: 100% of specs are
co-located). The spec travels with its file during migration.

```
application/use-case/
  sign-in.use-case.ts
  sign-in.use-case.spec.ts       # glued, same folder
```

- **Factories** (build a module's entity → carry domain knowledge) live in `modules/<owner>/test/`.
- **Aggregator mocks + global vitest setup** (cross-module) live in top-level `src/test/`.

## The dependency law (the only import rule)

```
modules/  →  may import  →  shared/ , core/ (ports)
core/     →  may import  →  shared/
shared/   →  imports nobody
modules/  →  NEVER import another module's infrastructure/
             (only its domain/ or application/ — the interface / use-case)
any layer →  may import  →  @boilerplate/shared-types (the wire contract;
             type-only in domain/ — `ErrorCodes` is the one value export)
```

The direction always points **inward** (`infrastructure → application → domain`),
same Clean Architecture rule as before. The day `shared/util/x.ts` needs to
import from a `module/`, that's proof it was never shared — it belongs to that
module. This is the leak detector.

## `shared/` — the pure kernel

A file is `shared` **only if it has zero domain knowledge** — it would make
sense pasted into a completely different app (an e-commerce, a blog). If the
name mentions a business concept (`user`, `profile`, `jwt-scope`), it is
**not** shared — it belongs to that module.

```
shared/
  error/       app-error.ts, error-codes.ts (re-export of @boilerplate/shared-types)
  i18n/        index.ts, zod-error-map.ts, locales/
  dto/         common.dto.ts       (UuidParamSchema & friends — plain checks, no
                                    custom messages: a schema-level message
                                    overrides the localized error map)
  util/        html.ts, parse-expires-in.ts, safe-s3-delete.ts, extract-s3-key.ts
  constant/    defaults.ts, image-upload.ts
  policy/      (none yet — add `ensure-same-owner.ts` the day a use case needs an
               explicit post-read ownership check; today the scoping lives in the
               repository signature, see backend.md § Resource ownership)
  provider/    app-config, cache-provider, ci-provider, database-status-provider,
               event-bus, flow-producer, hash-provider, health, jwt-provider,
               logger-provider, mail-provider, node-exporter-metrics-provider,
               queue-provider, storage-provider
               (generic PORTS only — `*.interface.ts`)
```

## `core/` — the chassis

Infrastructure that **boots** the app. No business rule, but also not a
reusable library — it's the skeleton.

```
core/
  http/          app.ts, middleware/ (auth, csrf, rate-limit, error-handler, locale…)
  container/     index.ts, tokens.ts, boot-guard/           (tsyringe DI)
  config/        env.ts (dotenv + fail-loud parse) over
                 schema/<concern>.schema.ts (Zod, one file per concern)
  database/      prisma-client.ts, seed/
  provider/      redis-cache.ts, bullmq-queue.ts, event-bus.ts, s3-storage.ts,
                 jwt.ts, bcrypt-hash.ts   (IMPLEMENTATIONS of the generic ports)
  service/       error-reporter/, scheduler/, lifecycle/ (graceful shutdown +
                 shutdown plan: http-server → queue/event-bus → cache/rate-limit store)
```

**Narrow exception — cross-module write primitives.** When two repositories in
**different modules** must share the exact same transactional semantics (same
lock, same counting rule) and neither may import the other's `infrastructure/`,
the primitive may live in `core/database/prisma/` (or `core/service/` for a
process-level primitive). It carries just enough domain vocabulary to name what
it locks or counts. Duplicating lock semantics across modules is worse than the
exception — but this is a last resort, not a default: prefer a port in
`shared/provider/` (or a DI-injected function) when the primitive has no
table-level knowledge.

**DI: always register services with an explicit token.** The dev runtime
(`tsx`/esbuild) does **not** emit `design:paramtypes` decorator metadata, so a
constructor parameter typed only by its class — with no `@inject(DI_TOKENS.X)`
— resolves to `undefined` at runtime and throws on first use (the production
`tsc` build happens to emit it, which makes the bug dev-only and easy to miss).
Unit specs construct dependencies by hand and never catch this. Every
`@injectable()` service consumed by another class gets a token in
`core/container/tokens.ts` + a `registerSingleton` + `@inject` at the call site.

**Port vs impl split:** `shared/provider/` holds the **interface**
(`ICacheProvider` — a pure port any module imports); `core/provider/` holds the
**implementation** (`redis-cache.ts` — the real Redis). Modules depend on the
port, never on Redis.

> `src/generated/` (Prisma client) is a **build artifact** (gitignored). Its
> location is dictated by the `generator.output` in `schema.prisma`, not by
> architecture taste — it stays addressed via the `@generated` alias and is out
> of scope to relocate.

## The domains (module list)

The boilerplate ships with **2 domains** — the minimum a real product needs.
Add new modules by cloning the canonical skeleton above.

| Domain | Owns |
|---|---|
| `auth` | authentication and the signed-in user's own account: sign-in / sign-up / sign-out, token issuance + refresh, password reset, e-mail verification, profile + avatar, `jwt-scopes` |
| `user` | the `User` entity itself: its repository port + Prisma implementation, the `UserStatus` value object, the test factory |

Cross-module imports go through another module's `domain/`/`application/`, never
its `infrastructure/`. When you grow the product, keep each new feature as its
own vertical slice with the same skeleton — the boundaries matter more than the
exact count.

## Where do I put X? (cheat-sheet)

| Creating… | Goes in |
|---|---|
| entity, pure rule | `modules/<m>/domain/entity/` |
| status union / domain vocabulary | `modules/<m>/domain/value-object/` |
| repository interface (port) | `modules/<m>/domain/repository/` |
| use case | `modules/<m>/application/use-case/` |
| Zod input/output schema | `modules/<m>/application/dto/` |
| domain-event subscriber | `modules/<m>/application/listener/` |
| controller / route | `modules/<m>/infrastructure/controller\|route/` |
| concrete Prisma repo | `modules/<m>/infrastructure/repository/` |
| BullMQ processor | `modules/<m>/infrastructure/job/` |
| `/api/health` contribution | `modules/<m>/infrastructure/health/` |
| this module's DI registrations | `modules/<m>/<m>.module.ts` |
| helper with a business name | `modules/<owner>/util/` |
| generic helper (no domain) | `shared/util/` |
| reusable Zod param/query schema | `shared/dto/common.dto.ts` |
| middleware, app.ts, DI, config, lifecycle | `core/` |
| error, i18n, ownership policy | `shared/` |
| test factory | `modules/<owner>/test/` |
| cross-module mock / vitest setup | `src/test/` |
| operational script | `apps/api/scripts/` (outside src) |
