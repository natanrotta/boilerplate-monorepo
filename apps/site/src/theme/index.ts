import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
} from "@chakra-ui/react";

// Persisted color-mode key (consumed by next-themes' ThemeProvider in
// AppProviders). Kept stable across the v2→v3 migration so existing visitors
// keep their saved preference.
export const COLOR_MODE_STORAGE_KEY = "chakra-ui-color-mode";

const buttonRecipe = defineRecipe({
  base: {
    borderRadius: "full",
    fontWeight: "600",
    letterSpacing: "0.01em",
    textDecoration: "none",
    transitionProperty: "all",
    transitionDuration: "240ms",
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
    _hover: { textDecoration: "none" },
  },
  variants: {
    size: {
      md: { h: 11, px: 6, fontSize: "sm" },
      lg: { h: 12, px: 7, fontSize: "md" },
    },
    variant: {
      solid: {
        bg: "bg.brand.solid",
        color: "text.onBrand",
        boxShadow:
          "0 1px 2px rgba(47, 128, 237, 0.25), 0 8px 24px -8px rgba(47, 128, 237, 0.45)",
        _hover: {
          bg: "bg.brand.solid-hover",
          transform: "translateY(-2px)",
          boxShadow:
            "0 4px 12px rgba(47, 128, 237, 0.32), 0 16px 36px -10px rgba(47, 128, 237, 0.55)",
          _disabled: { transform: "none" },
        },
        _active: {
          transform: "translateY(0)",
        },
      },
      outline: {
        border: "1px solid",
        borderColor: "border.default",
        color: "text.primary",
        bg: "transparent",
        backdropFilter: "blur(6px)",
        _hover: {
          bg: "bg.brand.subtle",
          borderColor: "border.brand",
          color: "text.brand",
          transform: "translateY(-2px)",
        },
        _active: { transform: "translateY(0)" },
      },
      ghost: {
        color: "text.primary",
        bg: "transparent",
        _hover: { bg: "bg.hover", color: "text.brand" },
      },
      accent: {
        bg: "accent.500",
        color: "text.onBrand",
        boxShadow:
          "0 1px 2px rgba(30, 178, 138, 0.25), 0 8px 24px -8px rgba(30, 178, 138, 0.45)",
        _hover: {
          bg: "accent.600",
          transform: "translateY(-2px)",
          boxShadow:
            "0 4px 12px rgba(30, 178, 138, 0.32), 0 16px 36px -10px rgba(30, 178, 138, 0.55)",
        },
        _active: { transform: "translateY(0)" },
      },
    },
  },
  defaultVariants: { variant: "solid", size: "md" },
});

const config = defineConfig({
  globalCss: {
    "html, body": {
      bg: "bg.canvas",
      color: "text.primary",
      scrollBehavior: "smooth",
    },
    body: {
      fontSize: "md",
      minH: "100vh",
      backgroundImage:
        "radial-gradient(ellipse 70% 55% at 10% -5%, rgba(47, 128, 237, 0.10) 0%, transparent 60%), radial-gradient(ellipse 60% 45% at 95% 8%, rgba(30, 178, 138, 0.09) 0%, transparent 55%)",
      backgroundAttachment: "fixed",
      _dark: {
        backgroundImage:
          "radial-gradient(ellipse 80% 60% at 12% -8%, rgba(95, 161, 255, 0.08) 0%, transparent 65%), radial-gradient(ellipse 65% 45% at 90% 5%, rgba(50, 200, 159, 0.06) 0%, transparent 60%)",
      },
    },
    "::selection": {
      bg: "bg.brand.subtle",
      color: "text.brand",
    },
    "*::-webkit-scrollbar": {
      width: "10px",
      height: "10px",
    },
    "*::-webkit-scrollbar-track": {
      bg: "transparent",
    },
    "*::-webkit-scrollbar-thumb": {
      bg: "border.default",
      borderRadius: "full",
    },
    "*::-webkit-scrollbar-thumb:hover": {
      bg: "border.strong",
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#eef6ff" },
          100: { value: "#d9eaff" },
          200: { value: "#b8d8ff" },
          300: { value: "#8fc0ff" },
          400: { value: "#5fa1ff" },
          500: { value: "#2f80ed" },
          600: { value: "#2569c9" },
          700: { value: "#1e529e" },
          800: { value: "#1c447f" },
          900: { value: "#1d3b6b" },
        },
        accent: {
          50: { value: "#f0fdf9" },
          100: { value: "#ccf7e8" },
          200: { value: "#95ecd0" },
          300: { value: "#5ddcb6" },
          400: { value: "#32c89f" },
          500: { value: "#1eb28a" },
          600: { value: "#178f6f" },
          700: { value: "#13745c" },
          800: { value: "#145c4a" },
          900: { value: "#124b3d" },
        },
        neutral: {
          50: { value: "#f8fafc" },
          100: { value: "#f1f5f9" },
          200: { value: "#e2e8f0" },
          300: { value: "#cbd5e1" },
          400: { value: "#94a3b8" },
          500: { value: "#64748b" },
          600: { value: "#475569" },
          700: { value: "#334155" },
          800: { value: "#1e293b" },
          900: { value: "#0f172a" },
        },
      },
      fonts: {
        heading: { value: "'Nunito Sans', system-ui, -apple-system, sans-serif" },
        body: { value: "'Nunito Sans', system-ui, -apple-system, sans-serif" },
      },
      fontSizes: {
        "display-xl": { value: "clamp(3rem, 7vw, 5.5rem)" },
        "display-lg": { value: "clamp(2.25rem, 5vw, 4rem)" },
        "display-md": { value: "clamp(1.75rem, 3.6vw, 2.75rem)" },
        "display-sm": { value: "clamp(1.4rem, 2.6vw, 2rem)" },
      },
      letterSpacings: {
        tightest: { value: "-0.04em" },
        tighter: { value: "-0.025em" },
        tight: { value: "-0.015em" },
      },
      radii: {
        none: { value: "0" },
        xs: { value: "4px" },
        sm: { value: "6px" },
        md: { value: "10px" },
        lg: { value: "14px" },
        xl: { value: "18px" },
        "2xl": { value: "24px" },
        "3xl": { value: "32px" },
        full: { value: "9999px" },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          canvas: { value: { base: "#f3f7fc", _dark: "#0d0d10" } },
          surface: { value: { base: "#ffffff", _dark: "#16161b" } },
          elevated: { value: { base: "#ffffff", _dark: "#1d1d23" } },
          sunken: { value: { base: "#f0f4f8", _dark: "#0a0a0d" } },
          muted: {
            value: { base: "{colors.neutral.50}", _dark: "rgba(255, 255, 255, 0.04)" },
          },
          hover: {
            value: { base: "{colors.neutral.100}", _dark: "rgba(255, 255, 255, 0.07)" },
          },
          glass: {
            value: {
              base: "rgba(255, 255, 255, 0.78)",
              _dark: "rgba(22, 22, 27, 0.72)",
            },
          },
          // Floating header pill: kept on the glass language (backdrop-blur +
          // saturate) but near-opaque so busy hero content behind it never bleeds
          // through and hurts legibility. Distinct from `bg.glass` (Hero/Modules
          // cards), which stays lighter on purpose.
          topbar: {
            value: {
              base: "rgba(255, 255, 255, 0.94)",
              _dark: "rgba(22, 22, 27, 0.92)",
            },
          },
          brand: {
            subtle: {
              value: { base: "{colors.brand.50}", _dark: "rgba(95, 161, 255, 0.14)" },
            },
            solid: { value: { base: "{colors.brand.500}", _dark: "{colors.brand.400}" } },
            "solid-hover": {
              value: { base: "{colors.brand.600}", _dark: "{colors.brand.300}" },
            },
          },
          accent: {
            subtle: {
              value: { base: "{colors.accent.50}", _dark: "rgba(50, 200, 159, 0.14)" },
            },
          },
        },
        text: {
          primary: { value: { base: "#1f2937", _dark: "#f1f0f3" } },
          secondary: { value: { base: "#4b5563", _dark: "#a8a6b1" } },
          muted: { value: { base: "{colors.neutral.400}", _dark: "#83828d" } },
          inverse: { value: { base: "#ffffff", _dark: "#0d0d10" } },
          brand: { value: { base: "{colors.brand.600}", _dark: "{colors.brand.300}" } },
          accent: { value: { base: "{colors.accent.600}", _dark: "{colors.accent.300}" } },
          onBrand: { value: { base: "#ffffff", _dark: "#ffffff" } },
        },
        border: {
          subtle: {
            value: { base: "rgba(15, 23, 42, 0.07)", _dark: "rgba(255, 255, 255, 0.06)" },
          },
          default: {
            value: { base: "rgba(15, 23, 42, 0.12)", _dark: "rgba(255, 255, 255, 0.11)" },
          },
          strong: {
            value: { base: "rgba(15, 23, 42, 0.20)", _dark: "rgba(255, 255, 255, 0.20)" },
          },
          brand: { value: { base: "{colors.brand.200}", _dark: "{colors.brand.500}" } },
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
        },
        "brand-glow": {
          value: {
            base: "0px 0px 0px 3px rgba(47, 128, 237, 0.20), 0px 6px 24px rgba(47, 128, 237, 0.22)",
            _dark: "0px 0px 0px 3px rgba(143, 192, 255, 0.18), 0px 8px 28px rgba(95, 161, 255, 0.22)",
          },
        },
        "accent-glow": {
          value: {
            base: "0px 0px 0px 3px rgba(30, 178, 138, 0.20), 0px 6px 24px rgba(30, 178, 138, 0.22)",
            _dark: "0px 0px 0px 3px rgba(93, 220, 182, 0.16), 0px 8px 28px rgba(50, 200, 159, 0.22)",
          },
        },
      },
    },
    recipes: {
      button: buttonRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
