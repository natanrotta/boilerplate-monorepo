# @boilerplate/theme

The Boilerplate design system as a Chakra UI v3 config fragment: palettes, semantic tokens, text styles, radii, shadows and component recipes. It says what the product looks like and nothing about a specific app (no `globalCss`, no color-mode wiring).

Source-only: `main` points at `src/index.ts`, so consumers compile it like their own code and there is no build step.

## Use

```ts
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { boilerplateThemeConfig } from "@boilerplate/theme";

const appConfig = defineConfig({ globalCss: { /* app-only */ } });

export const system = createSystem(defaultConfig, boilerplateThemeConfig, appConfig);
```

`createSystem` merges left to right, so the app layers its own config over the foundations without forking them. `apps/web/src/app/theme/index.ts` is the reference consumer.

## Structure

| File | Owns |
|---|---|
| `src/foundations/colors.ts` | Palettes (`brand`, `accent`, `neutral`); status colors reuse Chakra's default hues |
| `src/foundations/semantic-tokens.ts` | Semantic colors (`bg.*`, `text.*`, `border.*`, `status.*`) and shadows (`shadow.*`, plus the bare focus rings), each with a light `base` and a `_dark` value |
| `src/foundations/typography.ts` · `text-styles.ts` | Font families and the type scale |
| `src/foundations/radii.ts` · `shadows.ts` | Radii and static shadow tokens |
| `src/foundations/recipes.ts` | `button`, `badge`, `input`, `textarea` recipes and the shared `fieldBase` |
| `src/index.ts` | `boilerplateThemeConfig` plus the individual foundations |

## Rules

- Components use semantic tokens only; a new visual need is a new semantic token here, never a hex value in an app.
- Every semantic color has a `_dark` value, and no palette carries yellow, orange or amber (warnings are purple). `apps/web/src/app/theme/tokenContract.spec.ts` fails the build otherwise, and also when the app references a token this package no longer defines.
- A change here changes every screen: update the DEV gallery (`/dev/styleguide`) and the visual baselines (`yarn test:e2e --update-snapshots` in `apps/web`) in the same change.

## Checks

```bash
yarn workspace @boilerplate/theme type-check
yarn workspace @boilerplate/web test src/app/theme/tokenContract.spec.ts
```
