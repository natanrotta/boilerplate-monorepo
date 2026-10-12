# Boilerplate Monorepo

> A production-ready TypeScript monorepo starter — a secure **auth API**, a **web app** with a sidebar dashboard and its own design-system package, and a **marketing site**, wired end-to-end with Turborepo, Prisma, Docker, GitHub Actions, and a complete Claude Code agent/skill setup.

Clone it, rename it, start shipping. The boring-but-critical parts — auth, security, data layer, theming, i18n, tests, CI, and deploy tooling — are already done and validated.

<sub>React 19 · Chakra UI 3 · Node 22 · Express 4 · Prisma 7 · TanStack Query 5 · Vite 7 · Vitest 3 · Playwright · Turborepo · Docker · GitHub Actions</sub>

---

## Table of contents

- [Highlights](#highlights)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [Architecture](#architecture)
- [Design system](#design-system)
- [Security model](#security-model)
- [Testing](#testing)
- [i18n](#i18n)
- [Docker](#docker)
- [CI / deploy](#ci--deploy)
- [Claude Code](#claude-code)
- [License](#license)

## Highlights

- 🔐 **Auth, done right** — sign-in/up, password reset, e-mail PIN verification, and Google OAuth. The JWT lives in an **httpOnly cookie** (JS never touches it), with CSRF double-submit, layered rate limiting, `helmet`/CSP, a CORS allowlist, and `bcrypt` hashing.
- 🧱 **Clean Architecture backend** — module-first `domain → application → infrastructure` layers with a `tsyringe` DI container, per-concern `Zod` config schemas, a staged graceful shutdown, and a typed error envelope shared with the frontend. Redis, BullMQ, S3, and transactional e-mail are wired and ready.
- ⚛️ **Modern React frontend** — React 19 + Chakra UI 3, a TanStack Query + DI-repository data layer, `react-hook-form` + `Zod` forms, and `motion` animations.
- 🎨 **A real design system** — tokens, recipes and text styles live in their own `@boilerplate/theme` package, guarded by a token-contract spec and a DEV-only styleguide with Playwright visual regression.
- 🌍 **i18n out of the box** — `react-i18next` in **pt-BR / en / es**, lazy-loaded per locale.
- 🧪 **Tests that ship** — Vitest unit/component tests (mandatory for backend logic) + Playwright E2E, both green in the box.
- 🚀 **Build & deploy ready** — Turborepo pipelines, one multi-stage Docker image, GitHub Actions (CI + build + deploy), and a guided release flow (`make-tag → deploy → rollback → monitor`).
- 🤖 **Claude Code native** — a full `.claude/` setup (agents, skills, patterns, hooks) + a `CLAUDE.md` task-lifecycle contract, so AI-assisted changes follow the repo's own conventions.

## Tech stack

| App / package | Path | Stack | Dev port |
|---|---|---|---|
| **API** | `apps/api` | Node.js 22 · Express 4 · Prisma 7 (Postgres) · tsyringe DI · Zod · BullMQ + Redis · Vitest | `3333` |
| **Web** | `apps/web` | React 19 · Vite 7 · Chakra UI 3 · TanStack Query 5 · react-hook-form + Zod · react-i18next · motion · Vitest + Playwright | `3000` |
| **Site** | `apps/site` | React 19 · Vite 7 · Chakra UI 3 · `@boilerplate/theme` · i18n (pt/en/es) | `3001` |
| **Theme** | `packages/theme` | `@boilerplate/theme` — Chakra v3 tokens, semantic tokens, text styles and recipes | — |
| **Shared types** | `packages/shared-types` | `@boilerplate/shared-types` — DTOs, the response envelope and the error-code catalog shared by API + web | — |

`apps/api`, `apps/web` and `packages/*` are Turborepo/Yarn workspaces; **`apps/site` is a standalone Yarn project** (its own `yarn.lock`), run via `yarn site:*`.

## Requirements

- **Node `>= 22`** — the repo pins the version in [`.nvmrc`](./.nvmrc); run `nvm use` (or `nvm install`) before installing.
- **Yarn `1.x`** (Classic) — the configured package manager.
- **Docker** — for Postgres + Redis (and the e2e/smoke compose stacks).

## Quick start

```bash
nvm use                           # switch to the Node version in .nvmrc
yarn install                      # install API + web + shared packages

cp apps/api/.env.example apps/api/.env
# (optional) cp apps/web/.env.example apps/web/.env

yarn services:up                  # Postgres + Redis in Docker
yarn prisma:migrate               # create the database schema
yarn seed                         # seed the demo users

yarn dev                          # backend (detached) + web (:3000) + site (:3001)
```

Then open **http://localhost:3000** and sign in with a seeded demo user (`qa@example.com` has the same password):

```
email:    demo@example.com
password: Demo1234!
```

**Quick login (local only).** `apps/api/.env.example` ships `DEV_QUICK_LOGIN_ENABLED=true`, so the sign-in page shows a **DEV · Quick login** button that lists the users of your database and signs in as one with a click, no password. It exists only when the API runs with `NODE_ENV=local` **and** that flag: the API refuses to boot with the flag in staging/production, the routes answer 404 everywhere else — and to any request that does not come from your own machine (loopback peer, also behind the Vite proxy, + loopback `Host`), so it needs the API running on the host, not in a container — and a Vite plugin fails the production build if the panel reaches a chunk.

## Project structure

```
.
├── apps/
│   ├── api/          # Express + Prisma REST API — Clean Architecture + tsyringe DI
│   ├── web/          # React app — auth, dashboard, settings (AppShell sidebar)
│   └── site/         # Marketing landing — standalone Yarn project, same design system
├── packages/
│   ├── theme/        # @boilerplate/theme — the design system (Chakra v3 config fragment)
│   └── shared-types/ # DTOs, response envelope and error codes shared by API and web
├── infra/            # Deploy configuration and host runbooks (see DEPLOY.md)
├── scripts/          # Guided release CLI (make-tag · deploy · rollback · monitor-status)
├── .github/          # CI, image build and production cutover workflows
├── .claude/          # Claude Code: agents, skills, patterns, hooks, specs
├── docker-compose.*.yml
├── Makefile          # Advanced infra layer (SSH, backup, plan B deploy)
├── turbo.json        # Turborepo pipeline
└── CLAUDE.md         # Task-lifecycle contract for AI-assisted work
```

## Scripts

### Run

| Command | What it does |
|---|---|
| `yarn dev` | Postgres+Redis + API (detached) + web (`:3000`) + site (`:3001`), all with hot reload |
| `yarn backend:up` | Postgres+Redis + API in the **foreground** (you see the API logs) |
| `yarn backend:up-d` | Postgres+Redis + API **detached** (logs → `/tmp/boilerplate-api.log`) |
| `yarn backend:down` | Stop the API and the Docker services |
| `yarn web:up` | Web dev server on `:3000` |
| `yarn site:up` | Site dev server on `:3001` (auto-installs its deps) |
| `yarn services:up` / `yarn services:down` | Postgres + Redis only (Docker) |

### Database (Prisma)

| Command | What it does |
|---|---|
| `yarn prisma:migrate` | `prisma migrate dev` — apply/create migrations |
| `yarn prisma:deploy` | `prisma migrate deploy` — apply pending migrations |
| `yarn prisma:reset` | Drop and re-migrate the database |
| `yarn reset-seed` | Reset **and** re-seed |
| `yarn seed` | Seed the demo users |
| `yarn prisma:studio` | Open Prisma Studio |
| `yarn prisma:generate` | Regenerate the Prisma client |

`yarn db:*` aliases exist for every command above (`db:migrate`, `db:seed`, `db:studio`, …).

### Build / quality

| Command | What it does |
|---|---|
| `yarn build` | Build API + web + shared packages (Turborepo) |
| `yarn build:web` | Build the web bundle and stamp its version file |
| `yarn build:api` | Build the API |
| `yarn site:build` | Build the site |
| `yarn test` | Unit + component tests (API + web, Vitest) |
| `yarn type-check` | `tsc --noEmit` across all packages |
| `yarn lint` | Lint API + web |
| `yarn format` | Prettier write |

### Deploy / ops

`yarn make-tag` · `yarn deploy` · `yarn rollback` · `yarn monitor-status` — the guided release flow. See [`DEPLOY.md`](./DEPLOY.md) and [`infra/`](./infra).

## Architecture

- **API — module-first Clean Architecture.** `apps/api/src/modules/<domain>/{domain,application,infrastructure}` with a `tsyringe` DI container in `core/`. Two modules ship: **`auth`** (sign-in/up, tokens, password reset, e-mail verification) and **`user`** (the identity core: entity, value objects, repository). Single-user by design — a row belongs to its owner column; multi-tenant `account_id` is the documented upgrade path. The Prisma schema has 3 models (`user`, `password_reset_token`, `email_verification_pin`). Config is composed from per-concern Zod schemas (`core/config/schema/`), the process lifecycle is a staged graceful shutdown (`core/service/lifecycle/`), and Redis/BullMQ, S3 and e-mail are available for building on. See [`apps/api/readme.md`](./apps/api/readme.md).
- **Web — feature modules over a sidebar shell.** `apps/web/src/modules/{auth,dashboard,settings,development}` on a shared `AppShell`; data flows action → module hook → DI repository → `httpClient` → TanStack Query → render. Chakra v3 compound components are consumed through the snippet layer in `src/components/ui/`. See [`apps/web/README.md`](./apps/web/README.md) and [`.claude/patterns/frontend.md`](./.claude/patterns/frontend.md).
- **Site — the landing page.** A sections-driven page (hero, how it works, what is included, closing call to action) painted with the same `@boilerplate/theme`, with 3-locale copy. See [`apps/site/README.md`](./apps/site/README.md).
- **Shared contract.** `@boilerplate/shared-types` owns the wire contract: DTOs, the `{ ok, data }` / `{ ok, error }` envelope, the `ErrorCodes` catalog (locale parity enforced by a spec) and the upload allowlist. The API and the web branch on the same values — no hand-written mirror to drift.

The canonical patterns for both layers live in [`.claude/patterns/`](./.claude/patterns) (`backend.md`, `backend-modules.md`, `frontend.md`, `code-review-checklist.md`) — the single source of truth for how a request flows and how new modules are structured.

## Design system

The visual foundation is a package, not a file inside the app: **`packages/theme`** (`@boilerplate/theme`) exports a Chakra v3 config fragment with palettes, semantic tokens, the type scale, radii, shadows, keyframes and component recipes. The web app and the site both compose it (`createSystem(defaultConfig, boilerplateThemeConfig, appConfig)`) and add nothing but their own `globalCss`.

The look is monochrome with one accent: near-neutral surfaces, ink and hairlines, a blue-violet reserved for focus, selection and links, and a primary action that is the ink inverted (black on light, near-white on dark). Type is Geist, with Geist Mono for identifiers and eyebrows.

Motion is part of the system, and it is quiet: navigation icons are `AnimatedIcon`s that play once when their row is pointed at or focused, and the selected mark of the sidebar, the mobile nav, the language selector, `UnderlineTabs` and `SegmentedControl` is a `SlidingIndicator` that glides to the new selection instead of blinking. Everything stays still under `prefers-reduced-motion`.

Three guards keep it honest:

- **`tokenContract.spec.ts`** fails the build when a semantic token loses its dark value, when a warm hue (yellow/orange/amber) enters the palette, or when a component references a token that does not exist.
- **`/dev/styleguide`** — a DEV-only reference of every shared component, grouped by category, with what each one is for, how to import and call it, and every variation and state. A registry spec fails when a component under `shared/components` has no entry. It never ships: a Vite plugin fails the production build if the module leaks into a chunk.
- **Visual regression** — Playwright screenshots of every styleguide section in light and dark. A design change is expected to fail it; review the diff, then accept with `yarn workspace @boilerplate/web test:e2e --update-snapshots`.

Components use semantic tokens only (`bg.*`, `text.*`, `border.*`, `status.*`) and `colorPalette` (never Chakra v2's `colorScheme`). A new visual need is a new token in the package, never a hex value in a component.

## Security model

The auth surface is the point of a boilerplate like this, so it ships hardened by default:

- **Session** — JWT (HS256 + `tokenVersion`) stored in an **httpOnly cookie**; JavaScript never reads or holds the token, closing the XSS → session-theft path. Refresh is transparent via an interceptor.
- **CSRF** — double-submit token on state-changing requests.
- **Rate limiting** — layered limiters (global / per-user / auth / public) backed by Redis, with sane floors.
- **Transport & headers** — `helmet` + CSP, a strict CORS allowlist.
- **Credentials** — `bcrypt` password hashing; e-mail verification via one-time PIN.
- **Uploads** — a MIME allowlist shared with the frontend; the stored object key and `Content-Type` derive from the **validated** type, never from the client-supplied filename.
- **Validation & logging** — every boundary validated with `Zod`; logs redact PII (including e-mail addresses); secrets come from a single validated config (no stray `process.env`).

See [`.claude/patterns/security.md`](./.claude/patterns/security.md) for the full threat model and the `SEC-*` catalog.

## Testing

- **Unit / component** — Vitest + Testing Library, co-located `*.spec.ts(x)`. Backend logic (use-cases, entities, DTOs, controllers) **must** have specs — enforced by a coverage gate. Run `yarn test`.
- **Contract guards** — specs that fail on drift instead of on behavior: the env schema ↔ `.env.example` gate, the error-code ↔ locale parity gate, the route-mount guard (a middleware factory mounted without being invoked), and the theme token contract.
- **E2E** — Playwright specs in `apps/web/e2e/` with Page Objects and auth fixtures, against an ephemeral Docker stack (`docker-compose.e2e.yml`, web on `:3002`, API on `:3334`). Run `yarn workspace @boilerplate/web test:e2e`.

## i18n

`react-i18next` in **pt-BR (default), en, es**. Only pt-BR is bundled in the entry chunk; en/es load on demand. Every user-visible string is translated across all three locales — including the API's error messages, which are keyed by the shared `ErrorCodes` catalog.

## Docker

| File | Purpose |
|---|---|
| `docker-compose.local.yml` | Local `db` + `redis` (+ an optional `api` service on the image's `dev` stage) |
| `docker-compose.e2e.yml` | Ephemeral Postgres/Redis for Playwright e2e |
| `docker-compose.smoke.yml` | Boot smoke-test of the production API image |
| `infra/app/docker-compose.prod.yml` | The production API container (+ node_exporter) |

The API ships as **one multi-stage image** — [`apps/api/Dockerfile`](./apps/api/Dockerfile) (`node:22-alpine`), stages `base → deps → build → prod-deps → runtime` plus a `dev` stage for local containers. The runtime stage runs as a non-root user, carries no devDependencies, and its entrypoint applies pending migrations (`RUN_MIGRATIONS`) before `exec`ing Node as PID 1 so SIGTERM reaches the graceful shutdown.

## CI / deploy

Three GitHub Actions workflows, all in [`.github/workflows/`](./.github/workflows):

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | every PR + pushes to `develop`/`main` | type-check · lint · unit tests · web build · Playwright e2e · actionlint |
| `build-api.yml` | dispatched by `yarn make-tag` | tests → image build → **boot smoke-test** → push to GHCR + git tag |
| `deploy-api.yml` | dispatched by `yarn deploy` / `yarn rollback` | pre-flight → pull → cutover on the self-hosted runner → verify `/api/health` from outside |

Deploy targets (hosts, URLs, image name) live in `infra/deploy.env` (gitignored; template: `infra/deploy.env.example`) — the **same** file the guided `yarn` commands and the `Makefile` read. The repo ships no real host: a command whose target is unset fails fast instead of touching someone else's infrastructure. Full guide in [`DEPLOY.md`](./DEPLOY.md); host runbooks in [`infra/RUNBOOK.md`](./infra/RUNBOOK.md).

## Claude Code

The repo ships a complete [Claude Code](https://claude.com/claude-code) setup under [`.claude/`](./.claude) — specialist agents, skills/commands, authoritative pattern docs, quality-gate hooks and the task specs — plus a root [`CLAUDE.md`](./CLAUDE.md) task-lifecycle contract. AI-assisted changes follow the repo's own conventions (spec → implement → review → test → PR) instead of drifting. It's generic and grows with use.

## License

MIT.
