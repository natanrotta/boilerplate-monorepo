# Boilerplate Monorepo

> A production-ready TypeScript monorepo starter — a secure **auth API**, a **web app** with a sidebar dashboard, and a **marketing site**, wired end-to-end with Turborepo, Prisma, Docker, and a complete Claude Code agent/skill setup.

Clone it, rename it, start shipping. The boring-but-critical parts — auth, security, data layer, theming, i18n, tests, CI-ready builds, and deploy tooling — are already done and validated.

<sub>React 19 · Chakra UI 3 · Node 22 · Express 4 · Prisma 7 · TanStack Query 5 · Vite 7 · Vitest 3 · Playwright · Turborepo · Docker</sub>

---

## Table of contents

- [Highlights](#highlights)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [Architecture](#architecture)
- [Security model](#security-model)
- [Testing](#testing)
- [Theming & i18n](#theming--i18n)
- [Docker](#docker)
- [Claude Code](#claude-code)
- [License](#license)

## Highlights

- 🔐 **Auth, done right** — sign-in/up, password reset, e-mail PIN verification, and Google OAuth. The JWT lives in an **httpOnly cookie** (JS never touches it), with CSRF double-submit, layered rate limiting, `helmet`/CSP, a CORS allowlist, and `bcrypt` hashing.
- 🧱 **Clean Architecture backend** — module-first `domain → application → infrastructure` layers with a `tsyringe` DI container, `Zod`-validated boundaries, and a typed error envelope. Redis, BullMQ, S3, and transactional e-mail are wired and ready.
- ⚛️ **Modern React frontend** — React 19 + Chakra UI 3 (semantic tokens, automatic dark mode via `next-themes`), a TanStack Query + DI-repository data layer, `react-hook-form` + `Zod` forms, and `motion` animations.
- 🌍 **i18n out of the box** — `react-i18next` in **pt-BR / en / es**, lazy-loaded per locale.
- 🧪 **Tests that ship** — Vitest unit/component tests (mandatory for backend logic) + Playwright E2E, both green in the box.
- 🚀 **Build & deploy ready** — Turborepo pipelines, multi-stage Docker images, and a guided release flow (`make-tag → deploy → rollback → monitor`).
- 🤖 **Claude Code native** — a full `.claude/` setup (agents, skills, patterns, hooks) + a `CLAUDE.md` task-lifecycle contract, so AI-assisted changes follow the repo's own conventions.

## Tech stack

| App | Path | Stack | Dev port |
|---|---|---|---|
| **API** | `apps/api` | Node.js 22 · Express 4 · Prisma 7 (Postgres) · tsyringe DI · Zod · BullMQ + Redis · Vitest | `3333` |
| **Web** | `apps/web` | React 19 · Vite 7 · Chakra UI 3 · TanStack Query 5 · react-hook-form + Zod · react-i18next · motion · Vitest + Playwright | `3000` |
| **Site** | `apps/site` | React 19 · Vite 7 · Chakra UI 3 · GSAP · i18n (pt/en/es) | `3001` |
| **Shared types** | `packages/shared-types` | `@boilerplate/shared-types` — DTOs shared by API + web | — |

`apps/api` and `apps/web` are Turborepo/Yarn workspaces; **`apps/site` is a standalone Yarn project** (its own `yarn.lock`), run via `yarn site:*`.

## Requirements

- **Node `>= 22`** — the repo pins the version in [`.nvmrc`](./.nvmrc); run `nvm use` (or `nvm install`) before installing.
- **Yarn `1.x`** (Classic) — the configured package manager.
- **Docker** — for Postgres + Redis (and the e2e/smoke compose stacks).

## Quick start

```bash
nvm use                           # switch to the Node version in .nvmrc
yarn install                      # install API + web + shared-types
yarn site:install                 # install the standalone site (also auto-run by `yarn dev`)

cp apps/api/.env.example apps/api/.env
# (optional) cp apps/web/.env.example apps/web/.env

yarn services:up                  # Postgres + Redis in Docker
yarn backend:prisma:migrate       # create the database schema
yarn db:seed                      # seed the demo user

yarn dev                          # backend (detached) + web (:3000) + site (:3001)
```

Then open **http://localhost:3000** and sign in with the seeded demo user:

```
email:    demo@example.com
password: Demo1234!
```

## Project structure

```
.
├── apps/
│   ├── api/          # Express + Prisma REST API — Clean Architecture + tsyringe DI
│   ├── web/          # React app — auth, dashboard, settings (AppShell sidebar)
│   └── site/         # Marketing landing — GSAP-driven, standalone Yarn project
├── packages/
│   └── shared-types/ # DTOs shared between API and web
├── infra/            # Deploy configuration (see DEPLOY.md)
├── .claude/          # Claude Code: agents, skills, patterns, hooks
├── docker-compose.*.yml
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
| `yarn backend:down` | Stop the API and `docker compose down` |
| `yarn web:up` | Web dev server on `:3000` |
| `yarn site:up` | Site dev server on `:3001` (auto-installs its deps) |
| `yarn services:up` | Postgres + Redis only (Docker) |

### Database (Prisma)

| Command | What it does |
|---|---|
| `yarn backend:prisma:migrate` | `prisma migrate dev` — apply/create migrations |
| `yarn backend:prisma:reset` | Drop, re-migrate and re-seed the database |
| `yarn db:seed` | Seed the demo user |
| `yarn db:studio` | Open Prisma Studio |
| `yarn db:generate` | Regenerate the Prisma client |

### Build / quality

| Command | What it does |
|---|---|
| `yarn build` | Build API + web + shared-types (Turborepo) |
| `yarn site:build` | Build the site |
| `yarn test` | Unit + component tests (API + web, Vitest) |
| `yarn type-check` | `tsc --noEmit` across all packages |
| `yarn lint` | Lint API + web |
| `yarn format` | Prettier write |

### Deploy / ops

`yarn make-tag` · `yarn deploy` · `yarn rollback` · `yarn monitor-status` — the guided release flow. See [`DEPLOY.md`](./DEPLOY.md) and [`infra/`](./infra).

## Architecture

- **API — module-first Clean Architecture.** `apps/api/src/modules/<domain>/{domain,application,infrastructure}` with a `tsyringe` DI container in `core/`. Two modules ship: **`auth`** (sign-in/up, tokens, password reset, e-mail verification) and **`user`** (the identity core + user CRUD). Single-user by design — no multi-tenant accounts. The Prisma schema has 3 models (`user`, `password_reset_token`, `email_verification_pin`). Redis/BullMQ, S3, and e-mail are available for building on. See [`apps/api/readme.md`](./apps/api/readme.md).
- **Web — feature modules over a sidebar shell.** `apps/web/src/modules/{auth,dashboard,settings}` on a shared `AppShell`; data flows action → `httpClient` → DI repository → TanStack Query → render. Reusable UI (`shared/components/{ui,forms,layout}`) is theme-token-driven. See [`apps/web/README.md`](./apps/web/README.md) and [`.claude/patterns/frontend.md`](./.claude/patterns/frontend.md).
- **Site — a tech landing.** A sections-driven marketing page with GSAP animations and 3-locale copy. See [`apps/site/README.md`](./apps/site/README.md).

The canonical patterns for both layers live in [`.claude/patterns/`](./.claude/patterns) (`backend.md`, `frontend.md`, `code-review-checklist.md`) — the single source of truth for how a request flows and how new modules are structured.

## Security model

The auth surface is the point of a boilerplate like this, so it ships hardened by default:

- **Session** — JWT (HS256 + `tokenVersion`) stored in an **httpOnly cookie**; JavaScript never reads or holds the token, closing the XSS → session-theft path. Refresh is transparent via an interceptor.
- **CSRF** — double-submit token on state-changing requests.
- **Rate limiting** — layered limiters (global / per-user / auth / public) backed by Redis, with sane floors.
- **Transport & headers** — `helmet` + CSP, a strict CORS allowlist.
- **Credentials** — `bcrypt` password hashing; e-mail verification via one-time PIN.
- **Validation & logging** — every boundary validated with `Zod`; logs redact PII; secrets come from a single validated config (no stray `process.env`).

## Testing

- **Unit / component** — Vitest + Testing Library, co-located `*.spec.ts(x)`. Backend logic (use-cases, entities, DTOs, controllers) **must** have specs — enforced by a coverage gate. Run `yarn test`.
- **E2E** — Playwright specs in `apps/web/e2e/` with Page Objects and auth fixtures, against an ephemeral Docker stack (`docker-compose.e2e.yml`). Run `yarn workspace @boilerplate/web test:e2e`.

## Theming & i18n

- **Theming** — Chakra UI 3 via `createSystem` with **semantic tokens** (`bg.*`, `text.*`, `border.*`, `status.*`); light/dark is automatic through `next-themes` (no color-mode conditionals in components). Never hardcode hex — use tokens.
- **i18n** — `react-i18next` in **pt-BR (default), en, es**. Only pt-BR is bundled in the entry chunk; en/es load on demand. Every user-visible string is translated across all three locales.

## Docker

| File | Purpose |
|---|---|
| `docker-compose.local.yml` | Local `db` + `redis` (+ an optional `api` service) |
| `docker-compose.e2e.yml` | Ephemeral Postgres/Redis for Playwright e2e |
| `docker-compose.smoke.yml` | Boot smoke-test of the production API image |

The production API image is built from a multi-stage [`apps/api/Dockerfile.prod`](./apps/api/Dockerfile.prod) (`node:22-alpine`).

## Claude Code

The repo ships a complete [Claude Code](https://claude.com/claude-code) setup under [`.claude/`](./.claude) — specialist agents, skills/commands, authoritative pattern docs, and quality-gate hooks — plus a root [`CLAUDE.md`](./CLAUDE.md) task-lifecycle contract. AI-assisted changes follow the repo's own conventions (spec → implement → review → test → PR) instead of drifting. It's generic and grows with use.

## License

MIT.
