# @boilerplate/web

The web application — a React + Vite single-page app with a sidebar dashboard shell and single-user authentication. It is the reference frontend of the boilerplate: one real module (`auth`), one presentation-only module (`dashboard`), one settings module, and a DEV-only design-system gallery.

**Design system:** `@boilerplate/theme` (`packages/theme`) — palettes, semantic tokens, text styles, radii, shadows and recipes. This app only composes it (`src/app/theme/index.ts` adds `globalCss` and nothing else).

**Type:** Geist (plus Geist Mono), bundled via `@fontsource-variable/geist` and `@fontsource/geist-mono` — no Google Fonts request on first paint.

**Stack:** React 19 · Vite 7 · TypeScript 5.8 (strict) · Chakra UI v3 (+ `next-themes`) · `motion` · TanStack Query 5 · axios · react-hook-form + Zod · react-i18next (pt-BR / en / es) · lucide-react · Bugsnag · Vitest 3 (unit) · Playwright (e2e).

---

## Structure

```
apps/web
├── aliases.ts                  # the one path-alias map (vite + vitest)
├── public/                     # static files served as-is
├── e2e/                        # Playwright: global.setup, fixtures, specs + visual baselines (tests/)
└── src
    ├── main.tsx                # error reporter + stale-chunk listener + fonts + i18n → <App/>
    ├── app/
    │   ├── App.tsx             # GlobalErrorBoundary → AppProviders → SidebarProvider → AppRouter
    │   ├── providers/          # Chakra (next-themes) · Toaster · QueryClient · Google OAuth · Auth
    │   ├── router/             # AppRouter, RoutePaths, guards, lazyWithRetry, NotFoundPage
    │   └── theme/              # createSystem(defaultConfig, boilerplateThemeConfig, globalCss) + token contract spec
    ├── components/ui/          # Chakra v3 snippets — the only place compound components are assembled
    ├── core/
    │   ├── di/                 # repository singletons (page → hook → repository → httpClient)
    │   ├── errors/             # AppError (codes come from @boilerplate/shared-types)
    │   ├── http/               # axios client: cookies, CSRF, envelope unwrap, silent refresh
    │   └── query/              # queryClient, queryKeys, stale-time tiers
    ├── modules/                # domain/ · infrastructure/ · presentation/ per module
    │   ├── auth/               # sign-in, register, verify e-mail, forgot/reset password, AuthContext
    │   ├── dashboard/          # authenticated landing (presentation-only)
    │   ├── settings/           # profile (name, avatar, language, color mode)
    │   └── development/        # DEV-only styleguide gallery — never in a production build
    ├── shared/
    │   ├── components/         # layout (shell, sidebar, bottom nav) · ui · forms · skeletons · icons · animations
    │   ├── hooks/ contexts/    # useDetailPageController, useFormState, useNotify, useConfirm, … · Sidebar
    │   ├── i18n/               # react-i18next + locales/{pt-BR,en,es}/{common,auth,settings,dashboard}.json
    │   └── constants/ lib/ utils/
    └── test/                   # Vitest setup + renderWithProviders
```

Path aliases: `@/*` → `src/*` and `@boilerplate/shared-types` → the package's TypeScript source. Both live in `aliases.ts`, shared by `vite.config.ts` and `vitest.config.ts`; `tsconfig.json` `paths` mirrors them by hand.

## Components

| Layer | Rule |
|---|---|
| `src/components/ui/*` | The Chakra v3 snippets (`avatar`, `close-button`, `color-mode`, `dialog`, `drawer`, `field`, `menu`, `native-select`, `number-input`, `pin-input`, `provider`, `toaster`, `tooltip`). **No file outside this folder assembles a Chakra compound component** — a page imports `Dialog` from `@/components/ui/dialog`, never `Dialog.*` from `@chakra-ui/react`. |
| `src/shared/components/*` | The app's own wrappers (`AppModal`, `ConfirmDialog`, `FormField`, `EntityCard`, …), built on top of those snippets. Reuse one before writing a new component. |
| `packages/theme` | Every color, shadow, radius and type style. A component never writes a hex value; it names a semantic token. |

`colorPalette`, never `colorScheme` (the v2 prop is silently ignored by v3 and still type-checks).

## Routing

| Path | Page | Guard |
|---|---|---|
| `/sign-in`, `/register`, `/forgot-password` | auth pages | `PublicOnlyRoute` (inside `PublicLayout`) |
| `/verify-email` | e-mail PIN (scoped token, no session yet) | none |
| `/reset-password?token=` | new password — **the API's reset e-mail links here** | none |
| `/dashboard` | authenticated landing | `ProtectedRoute` + `AppShell` |
| `/settings` | profile (`/profile` redirects here) | `ProtectedRoute` + `AppShell` |
| `/404`, `*` | not found | `ProtectedRoute` + `AppShell` |
| `/dev/styleguide` | design-system gallery — **dev server only**, never in a production build | `ProtectedRoute` + `AppShell` |

Paths live only in `src/app/router/RoutePaths.ts`.

## Data flow & auth

- `httpClient` (axios, `withCredentials`) calls `/api/*`; the Vite dev server proxies it to the API on `:3333`. Pages never call it: **page → module hook (TanStack Query) → `core/di` repository → `httpClient`**.
- The session JWT rides the httpOnly `boilerplate_at` cookie and is never read by JS. The client echoes the `boilerplate_csrf` cookie as `X-CSRF-Token`, unwraps `{ ok, data }`, and refreshes silently on the token-expiry error codes only.
- `ErrorCodes` comes from `@boilerplate/shared-types` — the API and the web branch on the same catalog, so a renamed code breaks the build instead of a runtime `if`.

## Design system & styleguide

`/dev/styleguide` renders every shared primitive in every state (typography, colors, shadows, buttons, badges, fields, cards, states, controls, overlays). It is mounted only under `import.meta.env.DEV`, and the `boilerplate:dev-only-modules-excluded` Vite plugin fails `yarn build` if any `modules/development` code reaches a chunk.

Changing a token is expected to change the gallery. The workflow is:

```bash
yarn dev                            # check /dev/styleguide in light and dark
yarn test:e2e --update-snapshots    # accept the intended visual change
```

Baselines live in `e2e/tests/__screenshots__/` with a `-darwin` suffix and are compared on macOS only (`ignoreSnapshots` elsewhere, because fonts antialias differently on Linux).

## Environment

All variables are optional locally (copy `.env.example` to `.env`). They are public — they ship in the bundle.

| Var | Purpose |
|---|---|
| `VITE_API_URL` | API base, **including** `/api` (e.g. `https://api.example.com/api`). Empty → the Vite `/api` proxy. |
| `VITE_GOOGLE_CLIENT_ID` | Enables "Sign in with Google" (must match the API's `GOOGLE_CLIENT_ID`). |
| `VITE_BUGSNAG_API_KEY` | Error + performance reporting. Empty → disabled. |
| `VITE_APP_VERSION` | Build-time version stamp (falls back to the deploy commit SHA, then `git`, then `dev`). |

## Commands

From the repo root:

```bash
yarn web:up        # dev server on http://localhost:3000 (HMR)
yarn build:web     # production build + dist/version.json
```

Inside `apps/web`:

```bash
yarn dev                   # vite dev (:3000)
yarn build                 # tsc + vite build
yarn type-check            # tsc --noEmit for src AND for e2e/ + scripts/ (tsconfig.e2e.json)
yarn lint
yarn test                  # Vitest unit tests
yarn test:e2e              # Playwright — boots its own stack (Postgres :5433, Redis :6380, API :3334, web :3002)
yarn test:e2e:keep         # same, without the final teardown
yarn test:e2e:ui           # Playwright UI mode (implies --keep)
yarn test:e2e:down         # tear the e2e stack down
yarn test:e2e:report       # open the last HTML report
yarn typegen               # regenerate Chakra's theme typings after a token change
```

> Authenticated flows need the API (`yarn backend:up-d`). Seeded login: `demo@example.com` / `Demo1234!`.

Test ids are `data-cy` (`playwright.config.ts` sets `testIdAttribute`), so `page.getByTestId("app-modal")` resolves `data-cy="app-modal"`.

## Deploy

A static build on a CDN / static host, deployed on push. Build command: `yarn build:web`; output: `apps/web/dist`. The generated `dist/version.json` (commit, branch, build time) is what `yarn monitor-status` reads to show the live commit. See [`DEPLOY.md`](../../DEPLOY.md).

## Testing

- **Unit:** Vitest, co-located `*.spec.{ts,tsx}`.
- **E2E:** Playwright in `apps/web/e2e` (fixtures + api client + specs), orchestrated by `scripts/e2e-run.ts` — it owns the whole cycle (compose up → migrate → seed → API on `:3334` → Vite on `:3002` → teardown) and never touches the dev stack on `:3000`/`:3333` nor `apps/site` on `:3001`. It reads `apps/api/.env.e2e` when present and falls back to the committed `apps/api/.env.e2e.example`. Conventions: [`.claude/patterns/e2e.md`](../../.claude/patterns/e2e.md). The HTML report lands in `.playwright/` (git-ignored).
