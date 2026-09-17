# DevOps / Infra — Accumulated Knowledge (single source)

> Living notes for the `/devops` skill: the real deploy topology, runbook, and backlog **as you build it**.
> The boilerplate ships a representative `infra/` skeleton; replace the specifics below with your actual
> provider, hosts, and domains as production takes shape. Command cheat-sheet: `DEPLOY.md`. Ops: `Makefile`.

## Live environment
- (not live yet — record provider, hosts, domains and the runner here the day production goes up)

## Architecture (reference — adapt to your provider)
- Static frontends behind a CDN + an API and its data stores on isolated hosts joined by a private network / tunnel.
- A proxy/CDN at the edge hides the origin IP (origin cert) and terminates TLS.
- The database host never exposes `5432`/`6379` to the internet — app↔DB only over the private network.
- Backup is 3-2-1: encrypted daily dump, offsite, with a dead-man switch — and only "real" after a tested restore drill.
- Ports: container `API_PORT` default `3333`; local dev API `3333` / web `3000` / site `3001`; e2e API `3334` / web `3002` / Postgres `5433` / Redis `6380`; local Postgres `5432` / Redis `6379`.

## Golden rules
1. Database first when provisioning (with backup on day one), then app host, then frontends, then validation.
2. Secrets live in `.env` (`chmod 600`) / Docker secrets on the server — never in the image (except the stamped `APP_VERSION`), never in logs/commits/front.
3. Health: `/healthz` (text `ok`) + `/api/health` (JSON with `version`).

## CI/CD (reference)
- `.github/workflows/ci.yml` — type-check + lint + tests on PR.
- `yarn make-tag` dispatches `.github/workflows/build-api.yml`: tests → build → boot smoke → publish `ghcr.io/<owner>/boilerplate-api:vX.Y` (+ `:latest`) → create the git tag. **Nothing builds on push.**
- `yarn deploy` dispatches `.github/workflows/deploy-api.yml` on the self-hosted runner (label `boilerplate-app`, host path `/opt/boilerplate/app`): pre-flight → `docker compose pull` → `up --wait` → verify the version at `/api/health`.
- `yarn rollback` re-deploys an earlier tag — it does **not** revert migrations.
- `yarn monitor-status` shows service health and skips targets that are not configured.
- One multi-stage `apps/api/Dockerfile` (`runtime` for prod, `dev` for the local compose). `docker-entrypoint.sh` runs `prisma migrate deploy` unless `RUN_MIGRATIONS=false` — a second replica must set it to false.
- Postgres 15. Operator targets live in `infra/deploy.env` (gitignored; template `infra/deploy.env.example`), read by both the `Makefile` and `scripts/lib/deploy-cli.mjs`; shell env wins.
- Every new env var goes into `apps/api/src/core/config/schema/` **and** both templates (`apps/api/.env.example`, `infra/.env.prod.example`) — `env-example.spec.ts` fails the build on drift in either direction.

## Runbook — when to run what
- (fill in as your deploy matures)

## Gaps / backlog
- (none yet)
