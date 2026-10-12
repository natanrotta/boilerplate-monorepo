# @boilerplate/site

The public **marketing / landing site** — a minimal page about the boilerplate itself, ready to rebrand.

**Stack:** React 19 · Vite 7 · TypeScript · Chakra UI 3 · `@boilerplate/theme` (the app's design system) · Geist · trilingual copy (en / pt / es).

> This is a **standalone yarn project** (its own `yarn.lock`) — it is *not* part of the root Turborepo workspaces. Install and run it via the root `yarn site:*` scripts or directly inside `apps/site`.

---

## Structure

```
apps/site/src
├── main.tsx · App.tsx
├── sections/       # Hero (+ ProductMock), HowItWorks, Included, ClosingCta
├── content/        # site.ts — URLs, routes, the stack chips, the page width
├── locales/        # en.ts, pt.ts, es.ts (key-for-key in sync; pt is the type source)
├── pages/          # LandingPage + legal (PrivacyPolicy, TermsOfUse)
├── components/     # Header, Footer, BrandMark, PageBackdrop, Reveal, SpotlightCard, ...
├── hooks/          # useLocale, useInView, useScrolled
└── theme/          # composes @boilerplate/theme + the site-only text styles
```

Path aliases: `@` → `./src`, and `@boilerplate/theme` → `../../packages/theme/src` (compiled from source — the site paints with the same tokens as the app). All visible copy lives in `locales/{en,pt,es}.ts` — edit those to change the text (keep the three files in sync). The brand is the neutral placeholder **"Boilerplate"**.

## Commands

From the repo root:

```bash
yarn site:install    # install (standalone project)
yarn site:up         # dev server on http://localhost:3001 (HMR, opens the browser)
yarn site:build      # production build → apps/site/dist
```

Inside the workspace (`apps/site`):

```bash
yarn dev             # vite dev (:3001)
yarn build           # tsc + vite build
yarn preview         # preview the production build
```

## Icons

Favicons live in `public/`. `apps/web/public/favicon.svg` is the source of truth — a monoline "B" with a spark on a blue→violet tile, the same drawing as the `BrandMark` components. To rebrand, edit that SVG (and `BRAND_MARK` in `packages/theme`), then run `yarn workspace @boilerplate/web gen:icons`: it regenerates `favicon.ico` and `apple-touch-icon.png` for the web app and for this site, and copies the SVG here.

## Deploy

Static output (`dist/`) — deploy to any static host. See [`DEPLOY.md`](./DEPLOY.md).
