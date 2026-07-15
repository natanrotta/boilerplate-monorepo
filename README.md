# Boilerplate Monorepo

> A production-ready TypeScript monorepo starter — a Node/Express + Prisma API with single-user auth, a React + Vite + Chakra web app with a sidebar layout, a marketing site, Turborepo, and Docker.

This repository is a **clean starting point** for a full-stack product. It ships the plumbing every app needs — authentication, a signed-in dashboard shell, settings, a landing site, testing, and a deploy skeleton — without any product-specific domain. Clone it, rename `@boilerplate/*`, and start building your feature modules on top.

---

## Contents

- [What's in the box](#whats-in-the-box)
- [Architecture](#architecture)
- [Stack](#stack)
- [Requirements](#requirements)
- [Setup](#setup)
- [Running in development](#running-in-development)
- [How the apps fit together](#how-the-apps-fit-together)
- [Useful scripts](#useful-scripts)
- [Repository layout](#repository-layout)
- [Deploy](#deploy)
- [Contributing workflow](#contributing-workflow)

---

## What's in the box

- **Authentication** — sign-up / sign-in / sign-out, JWT (httpOnly cookie session + refresh), CSRF double-submit, password hashing (bcrypt), scoped tokens (e.g. email verification).
- **A signed-in app shell** — sidebar layout, protected routes, a dashboard page, and a settings/profile page.
- **A marketing site** — a standalone landing app you can deploy separately.
- **Backend building blocks** — Clean Architecture (domain → application → infrastructure), dependency injection (`tsyringe`), Prisma repositories, Zod DTOs, a BullMQ queue/worker setup, a Pino logger, and an i18n error layer (pt-BR / en / es).
- **Frontend building blocks** — TanStack Query data layer, a repository/DI pattern for HTTP, semantic-token theming with dark mode, reusable form fields, and shared list/detail page controllers.
- **Testing** — Vitest unit tests co-located with the code and a Playwright e2e harness.
- **Tooling** — Turborepo task orchestration, a Docker Compose stack for Postgres + Redis, and a versioned deploy/rollback CLI.

There is **no product domain baked in** — the backend ships `auth` + `user` modules and the web app ships `auth` + `dashboard` + `settings`. Everything else is yours to add.

---

## Architecture

### Monorepo overview

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│   apps/web   │        │  apps/site   │        │  external    │
│ (React/Vite) │        │ (React/Vite) │        │  services    │
└──────┬───────┘        └──────────────┘        │  S3 · SMTP…  │
       │                  standalone             └──────┬───────┘
       │ HTTP / REST                                    │ integrations
       ▼                                                ▼
┌───────────────────────────────────────────────────────────────┐
│                       apps/api  (Express)                       │
│   Clean Architecture:  domain → application → infrastructure    │
│   Single process: HTTP server + BullMQ workers + cron jobs      │
└───────────────┬───────────────────────────┬───────────────────┘
                │                            │
         ┌──────▼──────┐              ┌───────▼───────┐
         │ PostgreSQL  │              │     Redis     │
         │  (Prisma)   │              │   (BullMQ)    │
         └─────────────┘              └───────────────┘
```

- **Workspace management:** Yarn Workspaces + Turborepo cover `apps/api`, `apps/web`, and `packages/*` (currently just `@boilerplate/shared-types`, the shared BE↔FE contract types).
- **`apps/site` is standalone:** it lives outside the workspace, has its own `yarn.lock`, and deploys independently. See [`apps/site/DEPLOY.md`](apps/site/DEPLOY.md).

### Backend (`apps/api`) — module-first Clean Architecture

`apps/api/src` is organized **module-first**: the feature is the top-level unit, and the layer is a subfolder inside it.

```
apps/api/src/
  modules/<domain>/         # one folder per domain (ships: auth, user)
    domain/                 # entities, repository interfaces (ports)
    application/            # use cases, Zod DTOs, services
    infrastructure/         # controllers, routes, Prisma repos, adapters
  shared/                   # pure kernel (errors, i18n, utils) — zero domain
  core/                     # the chassis (HTTP, DI container, config, DB client)
  test/                     # cross-module test kit
  main.ts                   # bootstrap (HTTP + cron + queue wiring)
```

Dependencies always point **inward** (`infrastructure → application → domain`). Use cases receive DTOs and return DTOs; they never touch Express `Request`/`Response`. Full contract in [`.claude/patterns/backend.md`](.claude/patterns/backend.md) and [`.claude/patterns/backend-modules.md`](.claude/patterns/backend-modules.md).

**Single process, three roles.** In `src/main.ts` the same Node process boots the HTTP server, registers cron jobs, and bootstraps the BullMQ workers. In dev, Bull Board is served at `/admin/queues` to inspect the queues.

### Frontend (`apps/web`)

React + Vite + TypeScript + Chakra UI + TanStack Query + React Router, organized by **domain modules** (`auth`, `dashboard`, `settings`).

Each app is laid out as `app/` (root, providers, router, theme), `core/` (HTTP client, DI, query config), `modules/` (features), and `shared/` (UI kit, hooks, utils). Components never call `httpClient` directly — they go through a hook → repository → HTTP client. Contract types come from `@boilerplate/shared-types`. Full contract in [`.claude/patterns/frontend.md`](.claude/patterns/frontend.md).

---

## Stack

- **Monorepo:** Yarn Workspaces + Turborepo
- **Backend (`apps/api`):** Node 20+, TypeScript, Express, Clean Architecture, `tsyringe` (DI), Prisma 7 (PostgreSQL), Redis + BullMQ, Zod, Pino, i18next, Vitest
- **Web (`apps/web`):** React 18, Vite, TypeScript, Chakra UI, TanStack Query, React Router, react-hook-form + Zod, Playwright (e2e)
- **Site (`apps/site`):** **standalone** (outside the workspace, its own `yarn.lock`) — React + Vite + Chakra, deployed independently
- **Local infra:** Docker Compose (PostgreSQL + Redis)

---

## Requirements

- Node.js `>= 20.19`
- Yarn 1.22 (Classic — pinned in `packageManager`)
- Docker + Docker Compose

---

## Setup

```bash
# 1. Install dependencies (all workspaces)
yarn install

# 2. Copy the env files and fill in real values
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 3. Start Postgres + Redis
yarn docker:up

# 4. Apply migrations and generate the Prisma Client
yarn db:generate
yarn db:deploy

# 5. (Optional) seed the database with sample data
yarn db:seed
```

### Required environment variables

`apps/api/.env` — minimum to run locally:

- `DATABASE_URL` — already points at the Docker Compose Postgres
- `REDIS_HOST` / `REDIS_PORT`
- `JWT_SECRET` — **minimum 32 characters**
- `ALLOWED_ORIGIN=http://localhost:3000`

Any other keys (S3, SMTP/email, error reporting, etc.) are only needed to enable the corresponding integration. The config is validated by Zod at boot (`src/core/config/env.ts`) — the API refuses to start with invalid envs. See `apps/api/.env.example` for the full list.

---

## Running in development

```bash
yarn dev                # docker (db + redis) + API + Web
yarn dev:api            # API only
yarn dev:web            # web app only
yarn site               # marketing site only (standalone)
```

| Service | URL |
|---|---|
| Web app | http://localhost:3000 |
| Marketing site | http://localhost:3002 |
| API | http://localhost:3333 |
| Bull Board (queues) | http://localhost:3333/admin/queues |

`yarn dev` starts Postgres + Redis in Docker, then runs the API and web app in parallel via Turborepo.

---

## How the apps fit together

- **`apps/web`** is the product — a signed-in single-page app. It authenticates against the API, stores nothing sensitive in JS (the session rides an httpOnly cookie), and renders the dashboard/settings behind a protected sidebar shell.
- **`apps/api`** is the single backend for everything: REST endpoints under `/api`, background workers, and cron — all in one Node process. It owns the database (Prisma) and the queue (BullMQ + Redis).
- **`apps/site`** is a separate marketing/landing app with its own build and deploy. It does not depend on the API.
- **`packages/shared-types`** carries the request/response contract types so the web app and the API can't drift.

To add a feature, create a new backend module (clone the `user` module skeleton) and a new web module (clone the `settings` module), wire the route + repository + query keys, and add i18n strings in all three locales. The step-by-step order of operations lives in the patterns docs.

---

## Useful scripts

Run from the repo root (see `package.json` for the full list):

| Script | What it does |
|---|---|
| `yarn dev` | Docker (db + redis) + API + web in watch mode |
| `yarn build` | Build every workspace (Turborepo) |
| `yarn test` | Run all unit tests |
| `yarn lint` | Lint every workspace |
| `yarn type-check` | Type-check every workspace |
| `yarn format` / `yarn format:check` | Prettier write / check |
| `yarn docker:up` / `yarn docker:down` | Start / stop Postgres + Redis |
| `yarn db:deploy` / `yarn db:migrate` / `yarn db:generate` | Prisma deploy / migrate / generate |
| `yarn db:studio` | Open Prisma Studio |
| `yarn db:seed` / `yarn db:reset-seed` | Seed / reset + seed the database |
| `yarn make-tag` | Build + tag a versioned API image |
| `yarn deploy` / `yarn rollback` | Deploy / roll back a version (see [`DEPLOY.md`](DEPLOY.md)) |
| `yarn monitor-status` | Health of the deployed services |

---

## Repository layout

```
apps/
  api/          Express + Prisma backend (auth + user modules)
  web/          React + Vite web app (auth + dashboard + settings)
  site/         Standalone marketing site
packages/
  shared-types/ Shared BE↔FE contract types (@boilerplate/shared-types)
infra/          Deploy skeleton (Compose, proxy/TLS, backup, runbook)
scripts/        Deploy / version / tooling scripts
.claude/        AI agent workflow (skills, agents, patterns, hooks)
docker-compose*.yml   Local, e2e, and smoke stacks
```

---

## Deploy

The deploy flow is versioned and one-click: `yarn make-tag` builds and stamps a versioned image, `yarn deploy` ships it to the host and verifies `/api/health`, and `yarn rollback` reverts. The full workflow (tags, `deploy.mjs`, `rollback.mjs`, monitoring) is documented in [`DEPLOY.md`](DEPLOY.md); the infrastructure skeleton and runbook live in [`infra/`](infra/).

---

## Contributing workflow

This repo carries an AI-assisted workflow contract in [`CLAUDE.md`](CLAUDE.md) and [`.claude/`](.claude/): specialist skills (`/backend`, `/frontend`, `/fullstack`), a spec-driven task lifecycle, live anti-pattern hooks, and code-review/audit agents. When editing code, the specialists defer to the pattern docs in [`.claude/patterns/`](.claude/patterns/) — start there to learn the conventions.
