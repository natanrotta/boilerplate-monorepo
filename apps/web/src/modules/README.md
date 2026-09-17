# Frontend Modules

Each product capability lives under `apps/web/src/modules/<name>/` and follows this shape:

```
modules/<name>/
  domain/
    entities/        # Types, labels, selectors, status mappings
    repositories/    # Abstract repository interfaces (DI contracts)
  infrastructure/
    repositories/    # HTTP implementations registered in core/di
  presentation/
    pages/           # Routable React components (1 file = 1 route)
    components/      # Non-routable UI used by pages
    context/         # React context + its hook (e.g. AuthContext + useAuth)
    hooks/           # TanStack Query hooks + UI state
    utils/           # Module-scoped helpers (avoid promoting prematurely)
  index.ts           # Public barrel — exported hooks, types, components
```

`auth` is the canonical full-stack module: `domain/entities/AuthUser.ts` + `domain/repositories/AuthRepository.ts` (the contract), `infrastructure/repositories/HttpAuthRepository.ts` (the implementation, registered in `@/core/di/repositories`), and `presentation/` (pages, the `AuthContext` provider and its `useAuth` hook). Copy its shape when you add a module.

## Layered rules

- `presentation/` may import from `domain/`, but never from `infrastructure/` — not its own module's and not another's. It resolves a repository through `@/core/di/repositories` and consumes it from a hook.
- Every `useQuery` / `useMutation` lives in a module hook (`presentation/hooks/`). A page calls the hook; it never calls TanStack Query or `httpClient` directly.
- `infrastructure/` implements interfaces declared in `domain/` and is wired in `@/core/di/repositories`.
- `domain/` is framework-agnostic — no React, no Chakra, no axios.
- Cross-module usage goes through the target module's `index.ts` barrel, never deep into `presentation/` or `infrastructure/`.

The ESLint config enforces the first and third rules (warn level) via `no-restricted-imports`; the barrel rule is convention.

## Adding a module

1. `domain/repositories/<Name>Repository.ts` — the interface the presentation layer is allowed to know about.
2. `infrastructure/repositories/Http<Name>Repository.ts` — the axios implementation, returning domain types.
3. Register the instance in `@/core/di/repositories.ts`.
4. Add the module's namespace to `@/core/query/queryKeys.ts` and a hook in `presentation/hooks/` that wraps `useQuery`/`useMutation` with those keys.
5. Add the page(s), a barrel `index.ts`, the route in `@/app/router/RoutePaths.ts` + `AppRouter.tsx` (lazy-imported through the barrel), and the locale files for all three languages.
6. Build the UI from `@/shared/components` and `@/components/ui` — check what already exists before writing a new component.

## Presentation-only modules

`dashboard` and `development` have only `presentation/`. That is allowed when the module:

- Owns no persistent domain state of its own (it composes other modules' hooks).
- Has no dedicated repository / HTTP surface.
- Is explicitly UI-only (dev tools, content pages, composition dashboards).

If any of those turns false, add `domain/` (with at least a types file) before adding presentation logic that depends on it. A repository whose endpoint the API does not serve is worse than no repository: it type-checks, lints, and fails only in the browser.

`development` is additionally DEV-only: `AppRouter` mounts it behind `import.meta.env.DEV`, and a Vite plugin fails the production build if any of its code lands in a chunk.

## Barrel `index.ts`

Every module exports its public surface via `index.ts`:

```ts
export type { AuthUser } from "./domain/entities/AuthUser";
export { useAuth } from "./presentation/context/useAuth";
// Pages the router lazy-loads, and components other modules consume.
```

Avoid `export *` from a whole layer — pick the names you intend to be public so moves inside the module don't leak types.

## Shared vs module-local

- **Shared** (`@/shared/...`) — reusable across 2+ modules, framework-aware is fine (Chakra components, generic hooks).
- **Snippets** (`@/components/ui/...`) — the Chakra v3 compound components. The only place `Dialog.*`, `Menu.*`, `Field.*`, `Drawer.*`, `Avatar.*`, `NativeSelect.*`, `NumberInput.*` and `PinInput.*` are assembled.
- **Core** (`@/core/...`) — cross-cutting infra (DI registry, HTTP client, query keys, error types). Grows slowly.
- **Module-local** — anything that would need 2 edits to rename. Keep it inside the module until a second call site appears.

## Testing

- Unit tests colocated as `*.spec.{ts,tsx}` alongside the source.
- End-to-end tests live in `apps/web/e2e/`.
- Do not create a `__tests__/` folder inside a module — colocation is the convention.
