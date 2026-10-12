import { defineSemanticTokens } from "@chakra-ui/react";

// Semantic aliases (Chakra v3). `base` = light value, `_dark` overrides in dark
// mode. Palette references use the `{colors.<palette>.<step>}` syntax; raw
// hex/rgba values are literal.
//
// Every component in the app paints with these names and never with a palette
// step or a hex value, so re-skinning the product is a change to this file plus
// `colors.ts`. `apps/web/src/app/theme/tokenContract.spec.ts` fails the build
// when a token here loses its `_dark` value, when any value drifts into the
// yellow/orange/amber range, or when the app names a token that is not defined.
//
// The look is monochrome — near-neutral surfaces, ink and hairlines — plus one
// accent (`brand`, a blue-violet). The primary action is the ink inverted
// (`bg.primary`), never the accent.
export const semanticTokens = defineSemanticTokens({
  colors: {
    bg: {
      // Page and header.
      canvas: { value: { base: "{colors.neutral.50}", _dark: "#0a0a0b" } },
      // Cards, menus, dialogs, secondary buttons.
      surface: { value: { base: "#ffffff", _dark: "#111113" } },
      elevated: { value: { base: "#ffffff", _dark: "#16161a" } },
      // A card standing on a surface (the site's feature cards).
      card: { value: { base: "#ffffff", _dark: "#121215" } },
      sunken: { value: { base: "#f6f6f6", _dark: "#0a0a0b" } },
      input: { value: { base: "#ffffff", _dark: "#0c0c0e" } },
      // `_light` too: Chakra's own `bg.muted` is written with `_light`, which
      // beats a `base` — without it the light mode shows Chakra's gray.
      muted: {
        value: {
          base: "rgba(0, 0, 0, 0.04)",
          _light: "rgba(0, 0, 0, 0.04)",
          _dark: "rgba(255, 255, 255, 0.05)",
        },
      },
      hover: { value: { base: "rgba(0, 0, 0, 0.04)", _dark: "rgba(255, 255, 255, 0.06)" } },
      active: { value: { base: "rgba(0, 0, 0, 0.08)", _dark: "rgba(255, 255, 255, 0.10)" } },
      glass: { value: { base: "rgba(250, 250, 250, 0.80)", _dark: "rgba(17, 17, 19, 0.80)" } },
      topbar: { value: { base: "rgba(250, 250, 250, 0.88)", _dark: "rgba(10, 10, 11, 0.86)" } },
      // The primary action is the ink inverted — black on light, near-white on
      // dark — NOT the accent.
      primary: { value: { base: "{colors.neutral.900}", _dark: "#ededef" } },
      primaryHover: { value: { base: "#2e2e2e", _dark: "#ffffff" } },
      primaryActive: { value: { base: "#000000", _dark: "#d9d9dc" } },
      brand: {
        subtle: { value: { base: "rgba(62, 111, 239, 0.10)", _dark: "rgba(97, 145, 255, 0.15)" } },
        emphasis: { value: { base: "{colors.brand.500}", _dark: "{colors.brand.400}" } },
        solid: { value: { base: "{colors.brand.500}", _dark: "{colors.brand.400}" } },
        "solid-hover": { value: { base: "{colors.brand.600}", _dark: "{colors.brand.300}" } },
        "solid-active": { value: { base: "{colors.brand.700}", _dark: "{colors.brand.500}" } },
      },
      accent: {
        subtle: { value: { base: "{colors.accent.50}", _dark: "rgba(62, 207, 142, 0.14)" } },
      },
      // Pill switch (`ColorModeToggle`): the track gradient ends and the thumb.
      // Named tokens instead of a `useColorMode()` branch in the component, so
      // the control follows the CSS class next-themes toggles like everything
      // else (F-H16).
      switch: {
        track: { value: { base: "{colors.neutral.100}", _dark: "#151518" } },
        trackEnd: { value: { base: "{colors.neutral.200}", _dark: "#0c0c0e" } },
        thumb: { value: { base: "#ffffff", _dark: "{colors.neutral.800}" } },
      },
      // Decorative ambient glows (radial gradients). Consumed inside a raw
      // gradient string via `{colors.bg.glow.*}`.
      glow: {
        primary: { value: { base: "rgba(62, 111, 239, 0.24)", _dark: "rgba(97, 145, 255, 0.22)" } },
        secondary: {
          value: { base: "rgba(203, 134, 219, 0.20)", _dark: "rgba(203, 134, 219, 0.16)" },
        },
        tertiary: { value: { base: "rgba(62, 111, 239, 0.10)", _dark: "rgba(97, 145, 255, 0.10)" } },
      },
      // Dialog backdrop (the dialog also blurs what is behind it).
      overlay: { value: { base: "rgba(250, 250, 250, 0.60)", _dark: "rgba(0, 0, 0, 0.60)" } },
    },
    text: {
      primary: { value: { base: "{colors.neutral.900}", _dark: "#ededef" } },
      // Labels, subtitles, secondary icons.
      secondary: { value: { base: "{colors.neutral.600}", _dark: "{colors.neutral.500}" } },
      // Hints, placeholders, timestamps — one step quieter, still readable.
      muted: { value: { base: "#6e6e74", _dark: "#85858d" } },
      // DECORATIVE ONLY — separators, "or", an inactive step. It does not pass
      // AA; never use it for something the user has to read.
      faint: { value: { base: "{colors.neutral.400}", _dark: "{colors.neutral.700}" } },
      disabled: { value: { base: "{colors.neutral.400}", _dark: "{colors.neutral.700}" } },
      inverse: { value: { base: "#ffffff", _dark: "#0a0a0b" } },
      link: { value: { base: "{colors.brand.600}", _dark: "{colors.brand.300}" } },
      brand: { value: { base: "{colors.brand.600}", _dark: "{colors.brand.300}" } },
      accent: { value: { base: "{colors.accent.700}", _dark: "{colors.accent.300}" } },
      // Text/icon ON the accent fill (badges, the active marker) — white in
      // both modes, because the accent stays saturated on the dark canvas.
      onBrand: { value: { base: "#ffffff", _dark: "#ffffff" } },
      // Ink ON the primary action — it inverts with `bg.primary`.
      onPrimary: { value: { base: "#ffffff", _dark: "#0a0a0b" } },
      // Icon on the `ColorModeToggle` thumb (`bg.switch.thumb`).
      switchThumb: { value: { base: "{colors.text.primary}", _dark: "#ffffff" } },
    },
    border: {
      // Dividers and card borders. `_light` too, for the reason given at
      // `bg.muted`: with `base` alone the light mode draws every hairline in
      // Chakra's near-white gray.
      subtle: {
        value: {
          base: "rgba(0, 0, 0, 0.08)",
          _light: "rgba(0, 0, 0, 0.08)",
          _dark: "rgba(255, 255, 255, 0.07)",
        },
      },
      // Inputs, buttons, menus, an unchecked box.
      default: { value: { base: "rgba(0, 0, 0, 0.12)", _dark: "rgba(255, 255, 255, 0.13)" } },
      strong: { value: { base: "rgba(0, 0, 0, 0.20)", _dark: "rgba(255, 255, 255, 0.22)" } },
      // The faint background grid behind a hero.
      grid: { value: { base: "rgba(0, 0, 0, 0.05)", _dark: "rgba(255, 255, 255, 0.045)" } },
      brand: { value: { base: "rgba(62, 111, 239, 0.32)", _dark: "rgba(97, 145, 255, 0.36)" } },
      accent: { value: { base: "{colors.accent.200}", _dark: "rgba(62, 207, 142, 0.30)" } },
      focus: { value: { base: "{colors.brand.500}", _dark: "{colors.brand.400}" } },
    },
    status: {
      success: {
        fg: { value: { base: "{colors.accent.700}", _dark: "{colors.accent.300}" } },
        solid: { value: { base: "{colors.accent.500}", _dark: "{colors.accent.400}" } },
        bg: { value: { base: "{colors.accent.50}", _dark: "rgba(62, 207, 142, 0.12)" } },
        border: { value: { base: "{colors.accent.200}", _dark: "rgba(62, 207, 142, 0.30)" } },
      },
      // Warning is PURPLE, never yellow/orange/amber (project rule R11) — the
      // token contract spec fails the build on a warm hue anywhere in here.
      warning: {
        fg: { value: { base: "{colors.purple.600}", _dark: "{colors.purple.300}" } },
        solid: { value: { base: "{colors.purple.500}", _dark: "{colors.purple.400}" } },
        bg: { value: { base: "{colors.purple.50}", _dark: "rgba(168, 85, 247, 0.12)" } },
        border: { value: { base: "{colors.purple.200}", _dark: "rgba(168, 85, 247, 0.30)" } },
      },
      error: {
        fg: { value: { base: "{colors.red.600}", _dark: "{colors.red.300}" } },
        solid: { value: { base: "{colors.red.500}", _dark: "{colors.red.400}" } },
        bg: { value: { base: "{colors.red.50}", _dark: "rgba(239, 68, 68, 0.12)" } },
        border: { value: { base: "{colors.red.200}", _dark: "rgba(239, 68, 68, 0.30)" } },
      },
      info: {
        fg: { value: { base: "{colors.brand.600}", _dark: "{colors.brand.300}" } },
        solid: { value: { base: "{colors.brand.500}", _dark: "{colors.brand.400}" } },
        bg: { value: { base: "{colors.brand.50}", _dark: "rgba(97, 145, 255, 0.12)" } },
        border: { value: { base: "{colors.brand.200}", _dark: "rgba(97, 145, 255, 0.30)" } },
      },
      neutral: {
        fg: { value: { base: "{colors.neutral.600}", _dark: "{colors.neutral.500}" } },
        solid: { value: { base: "{colors.neutral.500}", _dark: "{colors.neutral.400}" } },
        bg: { value: { base: "rgba(0, 0, 0, 0.04)", _dark: "rgba(255, 255, 255, 0.06)" } },
        border: { value: { base: "rgba(0, 0, 0, 0.12)", _dark: "rgba(255, 255, 255, 0.13)" } },
      },
    },
  },
  shadows: {
    // Flat by default: a hairline does the separating, a shadow only appears
    // when something lifts (hover, menus, dialogs).
    shadow: {
      card: {
        value: {
          base: "0 1px 2px rgba(0, 0, 0, 0.04)",
          _dark: "0 0 0 1px rgba(255, 255, 255, 0.04)",
        },
      },
      cardHover: {
        value: {
          base: "0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px -8px rgba(0, 0, 0, 0.12)",
          _dark: "0 0 0 1px rgba(255, 255, 255, 0.06), 0 12px 32px -12px rgba(0, 0, 0, 0.60)",
        },
      },
      // Menus, dialogs, the toast, floating buttons.
      panel: {
        value: {
          base: "0 1px 2px rgba(0, 0, 0, 0.04), 0 12px 40px -8px rgba(0, 0, 0, 0.14)",
          _dark: "0 0 0 1px rgba(255, 255, 255, 0.04), 0 24px 60px -12px rgba(0, 0, 0, 0.70)",
        },
      },
      lg: {
        value: {
          base: "0 1px 2px rgba(0, 0, 0, 0.04), 0 12px 40px -8px rgba(0, 0, 0, 0.18)",
          _dark: "0 0 0 1px rgba(255, 255, 255, 0.05), 0 24px 60px -12px rgba(0, 0, 0, 0.75)",
        },
      },
      inner: {
        value: {
          base: "inset 0 1px 2px rgba(0, 0, 0, 0.05)",
          _dark: "inset 0 1px 2px rgba(0, 0, 0, 0.40)",
        },
      },
      // The 3px accent ring a focused control gets.
      focus: {
        value: {
          base: "0 0 0 3px rgba(62, 111, 239, 0.22)",
          _dark: "0 0 0 3px rgba(97, 145, 255, 0.30)",
        },
      },
      // Brand mark (logo tile), in the three sizes the app uses: the auth
      // screens' hero, the auth card's small badge, and the sidebar logo.
      brandMark: {
        value: {
          base: "0 20px 50px -16px rgba(62, 111, 239, 0.45)",
          _dark: "0 20px 50px -16px rgba(97, 145, 255, 0.40)",
        },
      },
      brandMarkSm: {
        value: {
          base: "0 10px 24px -10px rgba(62, 111, 239, 0.45)",
          _dark: "0 10px 24px -10px rgba(97, 145, 255, 0.40)",
        },
      },
      brandMarkXs: {
        value: {
          base: "0 2px 8px rgba(62, 111, 239, 0.28)",
          _dark: "0 2px 8px rgba(97, 145, 255, 0.24)",
        },
      },
      // The floating card on the auth screens.
      authCard: {
        value: {
          base: "0 1px 2px rgba(0, 0, 0, 0.04), 0 20px 50px -12px rgba(0, 0, 0, 0.12)",
          _dark: "0 0 0 1px rgba(255, 255, 255, 0.03), 0 30px 80px -20px rgba(0, 0, 0, 0.80)",
        },
      },
      // Pill switch (`ColorModeToggle`).
      switchTrack: {
        value: {
          base: "inset 0 1px 2px rgba(0, 0, 0, 0.05)",
          _dark: "inset 0 1px 2px rgba(0, 0, 0, 0.40)",
        },
      },
      switchThumb: {
        value: {
          base: "0 1px 3px rgba(0, 0, 0, 0.18)",
          _dark: "0 2px 6px rgba(0, 0, 0, 0.50)",
        },
      },
    },
    // Focus-related shadows use bare keys (no `shadow.` prefix) so consumers
    // like `boxShadow="input-focus"` — including the input recipe — keep working.
    outline: {
      value: {
        base: "0 0 0 3px rgba(62, 111, 239, 0.28)",
        _dark: "0 0 0 3px rgba(97, 145, 255, 0.40)",
      },
    },
    "input-focus": {
      value: {
        base: "0 0 0 3px rgba(62, 111, 239, 0.22)",
        _dark: "0 0 0 3px rgba(97, 145, 255, 0.30)",
      },
    },
    "input-error": {
      value: {
        base: "0 0 0 3px rgba(239, 68, 68, 0.14)",
        _dark: "0 0 0 3px rgba(252, 165, 165, 0.22)",
      },
    },
    "input-error-focus": {
      value: {
        base: "0 0 0 3px rgba(239, 68, 68, 0.22)",
        _dark: "0 0 0 3px rgba(252, 165, 165, 0.32)",
      },
    },
    "brand-glow": {
      value: {
        base: "0 0 0 3px rgba(62, 111, 239, 0.20), 0 4px 12px rgba(62, 111, 239, 0.15)",
        _dark: "0 0 0 3px rgba(97, 145, 255, 0.20), 0 4px 12px rgba(97, 145, 255, 0.18)",
      },
    },
    "accent-glow": {
      value: {
        base: "0 0 0 3px rgba(47, 179, 122, 0.20), 0 4px 12px rgba(47, 179, 122, 0.15)",
        _dark: "0 0 0 3px rgba(93, 214, 154, 0.16), 0 4px 12px rgba(62, 207, 142, 0.18)",
      },
    },
  },
});
