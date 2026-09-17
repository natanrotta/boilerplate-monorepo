import { fileURLToPath } from "node:url";

/**
 * The one path-alias map, shared by `vite.config.ts` and `vitest.config.ts`.
 * `tsconfig.json` `paths` mirrors it — TypeScript can't import a module, so
 * that copy stays hand-written.
 *
 * `@` resolves every `@/app`, `@/core`, `@/shared`, `@/modules` import because
 * Vite matches a string alias as a path prefix (`@/x` → `src/x`); the
 * per-folder aliases that used to live here were redundant.
 *
 * `@boilerplate/shared-types` points at the package's TypeScript SOURCE, not its
 * CommonJS `dist` (which exists for the API). A linked workspace package that
 * goes through Vite's dep pre-bundle is never re-optimized when it changes, so
 * a new runtime export (e.g. `ErrorCodes`) would be missing from the stale
 * bundle and the app would render blank until `vite --force`. Compiling the
 * source also removes the need for the CJS interop hacks (`optimizeDeps.include`
 * + `build.commonjsOptions`) this file used to carry.
 *
 * `@boilerplate/theme` needs no entry: it is source-only (`main` points at
 * `src/index.ts`), so the workspace symlink already resolves to TypeScript.
 */
export const aliases = {
  "@": fileURLToPath(new URL("./src", import.meta.url)),
  "@boilerplate/shared-types": fileURLToPath(
    new URL("../../packages/shared-types/src/index.ts", import.meta.url),
  ),
};
