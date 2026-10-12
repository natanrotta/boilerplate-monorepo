# Task Spec — boilerplate-login-styleguide

| | |
|---|---|
| **Status** | implemented |
| **Branch** | `claude/boilerplate-login-styleguide-892faf` |
| **Date** | 2026-10-12 |
| **Size / Risk** | L / Medium (High only on the impersonation endpoint) |
| **Specialist** | `/fullstack` — quick-login spans API + web; styleguide and site are FE work packages in the same spec |

## 1. Goal
A developer who just cloned the boilerplate gets from `yarn dev` to an authenticated dashboard in one click, sees every shared UI primitive in one DEV-only styleguide, and finds a public site that explains the boilerplate honestly — all in an elegant, minimal visual language taken from escaladoc (layout/palette) and pulsar (component details).

## 2. Scope
**In:**
- WP1 Quick-login (cuidda/pulsar style): `GET /dev/users` + `POST /dev/impersonate`, double-gated; `DevQuickLoginPanel` on the sign-in page; seed extended to 2–3 known users; verify the normal login works end to end.
- WP2 Global re-skin via `packages/theme` to the escaladoc palette (pulsar for component details) + styleguide rebuilt on pulsar's registry pattern, covering every shared component.
- WP3 Site re-laid-out like escaladoc (Hero → How it works → Modules → Closing CTA), CSS dashboard mock instead of video, Pricing replaced by a "clone the repo" CTA, generic copy in en/pt/es sourced from the README.

**Out (deferred):** visual-regression baselines in CI as a new gate; product video; multi-role impersonation/RBAC; cuidda's e2e fixture endpoints; new site pages (blog/docs); real pricing/payments; Prisma migrations.

## 3. Acceptance criteria
- **AC-1** — With `NODE_ENV=local` and `DEV_QUICK_LOGIN_ENABLED=true`, after seed, the sign-in page lists the seeded users; clicking one lands on the authenticated dashboard and the session survives a reload.
- **AC-2** — With the flag off or `NODE_ENV≠local`, `/dev/users` and `/dev/impersonate` return 404 and the sign-in page renders no panel and no error.
- **AC-3** — The API refuses to boot when `DEV_QUICK_LOGIN_ENABLED=true` and `NODE_ENV` is staging or production.
- **AC-4** — `/dev/users` returns only active, non-deleted users, capped, with id/name/email only (no hashes); impersonating a missing/inactive/deleted user returns `USER_NOT_FOUND`.
- **AC-5** — With an empty DB the panel shows an empty state telling the developer to run the seed.
- **AC-6** — The production web bundle contains neither the quick-login panel nor the styleguide.
- **AC-7** — Email + password login with the seeded demo user works on a fresh local setup (existing `auth.spec.ts` green).
- **AC-8** — `/dev/styleguide` (DEV only) renders one registry entry per shared component in `shared/components/{ui,forms,skeletons,layout,animations,icons}`; a spec fails when a shared component has no entry.
- **AC-9** — Web and site use the new palette exclusively through `packages/theme` tokens, in light and dark; `tokenContract.spec.ts` passes.
- **AC-10** — The site landing follows the escaladoc section order with a CSS hero mock and a closing clone CTA; no Pricing section; all copy exists in en/pt/es and makes no claim the repo cannot back (no escaladoc domain leftovers).
- **AC-11** — New web strings exist in en, pt-BR and es.

## 4. Contracts & interfaces
- Env: `DEV_QUICK_LOGIN_ENABLED` (default `false`) in the API env schema + `.env.example` (R20/R21).
- Routes (dev-only, undocumented): `GET /dev/users` → `{ id, name, email }[]`; `POST /dev/impersonate { userId }` → sets the same session cookies as sign-in.
- CSRF: exact-path exemption for `POST /dev/impersonate` only while the gate is on. No migration, no new ErrorCode (reuse `USER_NOT_FOUND`).

## 5. Reuse map (DRY first)
| Need | Reuse | Action |
|---|---|---|
| Gate helper, dev routes/controller/dto/use-cases | `pulsar/apps/api/src/core/config/dev-quick-login.ts`, `pulsar/apps/api/src/modules/auth/**/dev*` | Mirror; reuse the boilerplate's own sign-in token/cookie issuance |
| Mount + CSRF exemption | `pulsar/apps/api/src/core/http/{routes/index.ts,middlewares/csrf.middleware.ts}` | Extend the boilerplate equivalents |
| FE panel/hook/repo/entity | `pulsar/apps/web/src/modules/auth/**/{DevQuickLoginPanel,useDevQuickLogin,HttpDevAuthRepository,DevUser}` | Mirror; lazy import under `import.meta.env.DEV` (pattern at `AppRouter.tsx:45-51`) |
| Seed | `apps/api/prisma/seed.ts` | Extend with 1–2 more known users |
| Styleguide | `pulsar/apps/web/src/modules/development/presentation/styleguide/*` | Port registry pattern; existing route + DEV gate stay |
| Site layout/theme | `escaladoc/apps/site/src/{sections,components,theme}`, `escaladoc/packages/theme` | Port structure; rewrite copy; tokens via `@boilerplate/theme` |

## 6. Files plan
**Create:** API `core/config/dev-quick-login.ts`, `modules/auth/{infrastructure/route/dev.routes,infrastructure/controller/dev.controller,application/dto/dev.dto,application/use-case/dev/{list-dev-users,dev-impersonate}.use-case}.ts` + specs; web `modules/auth/{domain/entities/DevUser,infrastructure/repositories/HttpDevAuthRepository,presentation/hooks/useDevQuickLogin,presentation/components/DevQuickLoginPanel}` + specs; `modules/development/presentation/styleguide/{registry,Section,samples,registry.spec}`; site sections `HowItWorks`, `ClosingCta`, hero mock.
**Modify:** API env schema, config index, routes index + mount spec, CSRF middleware, `.env.example`, seed, auth module DI; web DI, `SignInPage.tsx`, `StyleguidePage.tsx`, i18n locales, styleguide visual spec/snapshots; `packages/theme/src/foundations/*`, `tokenContract.spec.ts`; site `index.html`, theme, `LandingPage`, Header/Footer/Hero/Modules, locales, content. **Delete:** site `Pricing`, and `Problem`/`Trust` if superseded.

## 7. Test plan
- API specs (mandatory): gate truth table (AC-2/3), env schema refusal (AC-3), `list-dev-users` (AC-4), `dev-impersonate` (AC-1/4), controller + routes mounted/unmounted (AC-2), dto, CSRF exemption.
- Web unit: `DevQuickLoginPanel` (list, empty state, hidden on 404 — AC-1/2/5), `registry.spec` (AC-8), `tokenContract.spec` (AC-9).
- e2e: `dev-quick-login.spec` (AC-1), existing `auth.spec` (AC-7), styleguide visual snapshots refreshed (AC-8/9).
- Build check: grep `dist` for `impersonate`/styleguide chunk (AC-6). Site: type-check + lint + build; manual light/dark + 375px pass (AC-10).

## 8. Diff budget
~30–40 files created, ~25–35 modified, in 3 commits (quick-login · theme+styleguide · site), one PR to `develop`. No new dependencies unless escaladoc's site layout strictly needs one already used there. No drive-by refactors outside the three work packages.

## Baseline rules in scope
- R2 soft-delete filter on `/dev/users`; R20/R21 env/config/contract sync; R24 mandatory backend specs; R26–R28 spec + diff budget.
- B-C4, B-C9, B-C10, B-C14, B-H8, B-H12 · F-C2, F-C3, F-C7, F-C9, F-C21, F-H6 · SEC-* on the dev endpoint.

## Risks & edge cases
- **Architectural:** session-minting endpoint — double gate + boot refusal + bundle check are non-negotiable; seed must never run against production.
- **UX:** panel must render nothing when gated off; styleguide must import real components, never mocks.
- **Edge cases that bite:** stale auth cookie on sign-in breaking CSRF; empty DB; long pt-BR strings at 375px in dark mode.

## Decisions log
- 2026-10-12 Palette → global re-skin through `packages/theme` (escaladoc palette, pulsar component details).
- 2026-10-12 Quick-login → backend impersonation, double-gated (not form prefill).
- 2026-10-12 Site → CSS hero mock + clone CTA; Pricing removed.
- 2026-10-12 Delivery → one PR, 3 commits, triage spec as contract; `/architect` escalation for size L waived by the user.
- 2026-10-12 Worktree → reused the session's app-created worktree (already at `origin/develop` @ cfa91a5) instead of creating a second one.
- 2026-10-12 `/dev/users` also returns `avatarUrl` (the panel's avatar) — AC-4's "id/name/email only" means "no credential or token data"; kept as pulsar ships it.
- 2026-10-12 Quick-login UI is a floating DEV trigger + drawer around the panel (pulsar's shape), so the sign-in card stays exactly as production shows it.
- 2026-10-12 New dependencies: `@fontsource-variable/geist` + `@fontsource/geist-mono` (web and site) replace Nunito Sans — Geist is the typeface of both reference designs; site drops `gsap`, `@gsap/react`, `react-icons`.
- 2026-10-12 Primary button is the ink inverted (`bg.primary`), as in escaladoc; the accent (`brand`, hue 265) is kept for focus, selection and links. Token NAMES are unchanged, only values (plus `bg.primary*`, `bg.card`, `bg.input`, `text.faint`, `text.onPrimary`, `border.grid`, `shadow.focus`).
- 2026-10-12 Site reads `@boilerplate/theme` through a source alias (it stays outside the workspaces), dark by default like escaladoc; `Problem`/`Trust`/`Pricing` deleted (unbacked claims), replaced by `HowItWorks` + `Included` + `ClosingCta`.
- 2026-10-12 Commits are owned by `/finish-task` (repo rule), so the "3 commits" of §8 are its call.
- 2026-10-12 Unit test-id attribute aligned to `data-cy` (`src/test/setup.ts`), matching Playwright — needed by the ported quick-login specs.
- 2026-10-12 Security audit (High): `/dev/*` now also requires a loopback `Host` (LAN peer / DNS rebinding); the seed refuses `NODE_ENV=staging|production`.
- 2026-10-12 **Scope added by the user mid-task (WP4):** (AC-12) the sign-in screen follows escaladoc — centered card on the grid + glow backdrop, brand and cross-link in a header — and the other signed-out screens share that frame; (AC-13) a new, own brand mark replaces the `</>` PNG everywhere (app, site, favicon.svg/ico, apple-touch-icon); (AC-14) animated icons as in pulsar/escaladoc (single-shot on hover/focus, still under reduced motion) on the navigation and empty states; (AC-15) the selected mark of the sidebar, the mobile nav, the language selector and the new tabs/segmented control SLIDES to the new selection (pulsar's `SlidingIndicator`). All four are documented in the styleguide.
- 2026-10-12 Review (High): the quick-login guard also requires a loopback SOCKET peer — `Host` alone is client-controlled. Trade-off accepted: the panel is hidden when the API runs inside a container. Added the AC-2/AC-5 specs the test plan promised (`useDevQuickLogin.spec`, empty state).
- 2026-10-12 Review (Medium, fixed): CSS keyframes honor reduced motion; `text.muted` darkened to pass AA; tabs get `id`/`aria-labelledby` + Home/End. Deferred: the site's `PLATFORM_URL` production placeholder (documented in `apps/site/DEPLOY.md`, set `VITE_PLATFORM_URL`).
- 2026-10-12 Kept on purpose: animated glyphs `search`/`plus`/`clock`/`success`/`error` and `SegmentedControl` ship as the starter kit of AC-14/AC-15 (documented in the styleguide) although only `dashboard`/`settings`/`UnderlineTabs` have a product consumer today.
- 2026-10-12 Duck-debug (gap, fixed): behind the Vite dev proxy every caller was a loopback peer — the proxy now forwards its client address (`xfwd`) and the guard also requires a loopback `req.ip`. Verdict after the fix: CLEAN. Known limitation: the Vite dev-only build gate has no test that makes it fire (verified by a production build).
