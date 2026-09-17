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
export const semanticTokens = defineSemanticTokens({
  colors: {
    bg: {
      canvas: { value: { base: "#f3f7fc", _dark: "#0d0d10" } },
      surface: { value: { base: "#ffffff", _dark: "#16161b" } },
      elevated: { value: { base: "#ffffff", _dark: "#1d1d23" } },
      sunken: { value: { base: "#f0f4f8", _dark: "#0a0a0d" } },
      muted: { value: { base: "{colors.neutral.50}", _dark: "rgba(255, 255, 255, 0.04)" } },
      hover: { value: { base: "{colors.neutral.100}", _dark: "rgba(255, 255, 255, 0.07)" } },
      active: { value: { base: "{colors.neutral.200}", _dark: "rgba(255, 255, 255, 0.11)" } },
      glass: { value: { base: "rgba(255, 255, 255, 0.80)", _dark: "rgba(22, 22, 27, 0.78)" } },
      topbar: { value: { base: "rgba(255, 255, 255, 0.92)", _dark: "rgba(22, 22, 27, 0.88)" } },
      brand: {
        subtle: { value: { base: "{colors.brand.50}", _dark: "rgba(95, 161, 255, 0.14)" } },
        emphasis: { value: { base: "{colors.brand.500}", _dark: "{colors.brand.400}" } },
        solid: { value: { base: "{colors.brand.500}", _dark: "{colors.brand.400}" } },
        "solid-hover": { value: { base: "{colors.brand.600}", _dark: "{colors.brand.300}" } },
        "solid-active": { value: { base: "{colors.brand.700}", _dark: "{colors.brand.500}" } },
      },
      accent: {
        subtle: { value: { base: "{colors.accent.50}", _dark: "rgba(50, 200, 159, 0.14)" } },
      },
      // Pill switch (`ColorModeToggle`): the track gradient ends and the thumb.
      // Named tokens instead of a `useColorMode()` branch in the component, so
      // the control follows the CSS class next-themes toggles like everything
      // else (F-H16).
      switch: {
        track: { value: { base: "{colors.neutral.50}", _dark: "{colors.gray.800}" } },
        trackEnd: { value: { base: "#f0f4f8", _dark: "{colors.gray.900}" } },
        thumb: { value: { base: "#ffffff", _dark: "{colors.gray.900}" } },
      },
      // Decorative ambient glows behind the auth screens (radial gradients).
      // Consumed inside a raw gradient string via `{colors.bg.glow.*}`.
      glow: {
        primary: { value: { base: "rgba(47, 128, 237, 0.22)", _dark: "rgba(95, 161, 255, 0.16)" } },
        secondary: {
          value: { base: "rgba(30, 178, 138, 0.20)", _dark: "rgba(50, 200, 159, 0.14)" },
        },
        tertiary: { value: { base: "rgba(95, 161, 255, 0.12)", _dark: "rgba(143, 192, 255, 0.10)" } },
      },
      overlay: { value: { base: "{colors.blackAlpha.400}", _dark: "rgba(0, 0, 0, 0.72)" } },
    },
    text: {
      primary: { value: { base: "#1f2937", _dark: "#f1f0f3" } },
      secondary: { value: { base: "#4b5563", _dark: "#a8a6b1" } },
      muted: { value: { base: "{colors.neutral.400}", _dark: "#83828d" } },
      disabled: { value: { base: "{colors.neutral.300}", _dark: "#48474f" } },
      inverse: { value: { base: "#ffffff", _dark: "#0d0d10" } },
      link: { value: { base: "{colors.brand.600}", _dark: "{colors.brand.300}" } },
      brand: { value: { base: "{colors.brand.600}", _dark: "{colors.brand.300}" } },
      accent: { value: { base: "{colors.accent.600}", _dark: "{colors.accent.300}" } },
      // Text/icon ON the primary action — white in both modes, because the
      // brand fill stays saturated blue on the dark canvas.
      onBrand: { value: { base: "#ffffff", _dark: "#ffffff" } },
      // Icon on the `ColorModeToggle` thumb (`bg.switch.thumb`).
      switchThumb: { value: { base: "{colors.text.primary}", _dark: "#ffffff" } },
    },
    border: {
      subtle: { value: { base: "rgba(15, 23, 42, 0.07)", _dark: "rgba(255, 255, 255, 0.06)" } },
      default: { value: { base: "rgba(15, 23, 42, 0.12)", _dark: "rgba(255, 255, 255, 0.11)" } },
      strong: { value: { base: "rgba(15, 23, 42, 0.20)", _dark: "rgba(255, 255, 255, 0.20)" } },
      brand: { value: { base: "{colors.brand.200}", _dark: "{colors.brand.500}" } },
      accent: { value: { base: "{colors.accent.200}", _dark: "rgba(50, 200, 159, 0.30)" } },
      focus: { value: { base: "{colors.brand.400}", _dark: "{colors.brand.300}" } },
    },
    status: {
      success: {
        fg: { value: { base: "{colors.green.600}", _dark: "{colors.green.300}" } },
        solid: { value: { base: "{colors.green.500}", _dark: "{colors.green.400}" } },
        bg: { value: { base: "{colors.green.50}", _dark: "rgba(34, 197, 94, 0.12)" } },
        border: { value: { base: "{colors.green.200}", _dark: "rgba(34, 197, 94, 0.30)" } },
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
        bg: { value: { base: "{colors.brand.50}", _dark: "rgba(95, 161, 255, 0.12)" } },
        border: { value: { base: "{colors.brand.200}", _dark: "rgba(95, 161, 255, 0.30)" } },
      },
      neutral: {
        fg: { value: { base: "{colors.neutral.600}", _dark: "#a8a6b1" } },
        solid: { value: { base: "{colors.neutral.500}", _dark: "{colors.neutral.400}" } },
        bg: { value: { base: "{colors.neutral.100}", _dark: "rgba(255, 255, 255, 0.06)" } },
        border: { value: { base: "{colors.neutral.200}", _dark: "rgba(255, 255, 255, 0.12)" } },
      },
    },
  },
  shadows: {
    shadow: {
      card: {
        value: {
          base: "0px 1px 2px rgba(15, 23, 42, 0.06), 0px 4px 12px -2px rgba(15, 23, 42, 0.08)",
          _dark: "0px 1px 0 rgba(0, 0, 0, 0.20)",
        },
      },
      cardHover: {
        value: {
          base: "0px 4px 8px rgba(15, 23, 42, 0.06), 0px 12px 28px -4px rgba(15, 23, 42, 0.12)",
          _dark: "0px 0 0 1px rgba(255, 255, 255, 0.04), 0px 8px 24px -8px rgba(0, 0, 0, 0.55)",
        },
      },
      panel: {
        value: {
          base: "0px 8px 24px -4px rgba(15, 23, 42, 0.14), 0px 2px 6px rgba(15, 23, 42, 0.06)",
          _dark: "0px 12px 32px -8px rgba(0, 0, 0, 0.55), 0px 2px 6px rgba(0, 0, 0, 0.35)",
        },
      },
      lg: {
        value: {
          base: "0px 16px 40px -8px rgba(15, 23, 42, 0.16), 0px 4px 12px rgba(15, 23, 42, 0.06)",
          _dark: "0px 20px 48px -12px rgba(0, 0, 0, 0.60), 0px 4px 12px rgba(0, 0, 0, 0.35)",
        },
      },
      inner: {
        value: {
          base: "inset 0 2px 4px 0 rgba(15, 23, 42, 0.06)",
          _dark: "inset 0 1px 2px 0 rgba(0, 0, 0, 0.30)",
        },
      },
      // Brand mark (logo tile), in the three sizes the app uses: the auth
      // screens' hero, the auth card's small badge, and the sidebar logo.
      brandMark: {
        value: {
          base: "0 24px 48px -16px rgba(47, 128, 237, 0.45), 0 8px 24px -8px rgba(30, 178, 138, 0.25)",
          _dark:
            "0 24px 48px -16px rgba(95, 161, 255, 0.35), 0 8px 24px -8px rgba(50, 200, 159, 0.20)",
        },
      },
      brandMarkSm: {
        value: {
          base: "0 12px 28px -10px rgba(47, 128, 237, 0.45)",
          _dark: "0 12px 28px -10px rgba(95, 161, 255, 0.35)",
        },
      },
      brandMarkXs: {
        value: {
          base: "0 2px 8px rgba(47, 128, 237, 0.30)",
          _dark: "0 2px 8px rgba(95, 161, 255, 0.24)",
        },
      },
      // The floating card on the auth screens.
      authCard: {
        value: {
          base: "0 24px 64px -24px rgba(15, 23, 42, 0.18), 0 8px 24px -16px rgba(15, 23, 42, 0.12)",
          _dark: "0 24px 64px -24px rgba(0, 0, 0, 0.60), 0 8px 24px -16px rgba(0, 0, 0, 0.40)",
        },
      },
      // Pill switch (`ColorModeToggle`).
      switchTrack: {
        value: {
          base: "inset 0 1px 2px rgba(15, 23, 42, 0.06)",
          _dark: "inset 0 1px 2px rgba(0, 0, 0, 0.40)",
        },
      },
      switchThumb: {
        value: {
          base: "0 1px 3px rgba(15, 23, 42, 0.20), 0 0 6px rgba(15, 23, 42, 0.05)",
          _dark: "0 2px 6px rgba(0, 0, 0, 0.50), 0 0 12px rgba(95, 161, 255, 0.35)",
        },
      },
    },
    // Focus-related shadows use bare keys (no `shadow.` prefix) so consumers
    // like `boxShadow="input-focus"` — including the input recipe — keep working.
    outline: {
      value: {
        base: "0 0 0 3px rgba(47, 128, 237, 0.30)",
        _dark: "0 0 0 3px rgba(143, 192, 255, 0.45)",
      },
    },
    "input-focus": {
      value: {
        base: "0 0 0 3px rgba(47, 128, 237, 0.15)",
        _dark: "0 0 0 3px rgba(143, 192, 255, 0.28)",
      },
    },
    "input-error": {
      value: {
        base: "0 0 0 3px rgba(245, 101, 101, 0.12)",
        _dark: "0 0 0 3px rgba(252, 165, 165, 0.22)",
      },
    },
    "input-error-focus": {
      value: {
        base: "0 0 0 3px rgba(245, 101, 101, 0.20)",
        _dark: "0 0 0 3px rgba(252, 165, 165, 0.32)",
      },
    },
    "brand-glow": {
      value: {
        base: "0px 0px 0px 3px rgba(47, 128, 237, 0.20), 0px 4px 12px rgba(47, 128, 237, 0.15)",
        _dark: "0px 0px 0px 3px rgba(143, 192, 255, 0.18), 0px 4px 12px rgba(95, 161, 255, 0.18)",
      },
    },
    "accent-glow": {
      value: {
        base: "0px 0px 0px 3px rgba(30, 178, 138, 0.20), 0px 4px 12px rgba(30, 178, 138, 0.15)",
        _dark: "0px 0px 0px 3px rgba(93, 220, 182, 0.16), 0px 4px 12px rgba(50, 200, 159, 0.18)",
      },
    },
  },
});
