import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
} from "@chakra-ui/react";

// Persisted color-mode key (consumed by next-themes' ThemeProvider in
// AppProviders). Kept stable across the v2→v3 migration so existing users keep
// their saved preference.
export const COLOR_MODE_STORAGE_KEY = "boilerplate-color-mode";

const inputBaseField = {
  borderRadius: "sm",
  bg: "bg.surface",
  borderColor: "border.default",
  borderWidth: "1.5px",
  color: "text.primary",
  fontSize: { base: "16px", md: "sm" },
  transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
  _hover: { borderColor: "border.strong" },
  _focusVisible: {
    borderColor: "border.focus",
    boxShadow: "input-focus",
    bg: "bg.surface",
    outline: "none",
  },
  _invalid: { borderColor: "status.error.fg", boxShadow: "input-error" },
  _placeholder: { color: "text.muted", fontSize: "sm" },
  _disabled: {
    borderColor: "border.subtle",
    bg: "bg.muted",
    opacity: 0.7,
    cursor: "not-allowed",
  },
  _readOnly: {
    borderColor: "border.default",
    bg: "bg.muted",
    cursor: "default",
    _focusVisible: { boxShadow: "none", borderColor: "border.default" },
  },
};

const buttonRecipe = defineRecipe({
  base: {
    borderRadius: "sm",
    fontWeight: "500",
    transitionProperty: "all",
    transitionDuration: "200ms",
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  variants: {
    variant: {
      solid: {
        bg: "bg.brand.solid",
        color: "text.onBrand",
        boxShadow: "0 1px 2px rgba(47, 128, 237, 0.20)",
        _hover: {
          bg: "bg.brand.solid-hover",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(47, 128, 237, 0.30)",
        },
        _active: {
          bg: "bg.brand.solid-active",
          transform: "translateY(0)",
          boxShadow: "0 1px 2px rgba(47, 128, 237, 0.20)",
        },
      },
      subtle: {
        bg: "bg.brand.subtle",
        color: "text.brand",
        _hover: {
          bg: "bg.brand.subtle",
          filter: "brightness(0.97)",
          transform: "translateY(-1px)",
        },
        _active: { filter: "brightness(0.94)", transform: "translateY(0)" },
      },
      ghost: {
        color: "text.primary",
        bg: "transparent",
        _hover: { bg: "bg.hover" },
        _active: { bg: "bg.active" },
      },
      outline: {
        border: "1px solid",
        borderColor: "border.default",
        color: "text.brand",
        bg: "bg.surface",
        _hover: {
          bg: "bg.brand.subtle",
          borderColor: "border.brand",
          transform: "translateY(-1px)",
        },
        _active: { filter: "brightness(0.95)", transform: "translateY(0)" },
      },
      danger: {
        bg: "red.500",
        color: "text.onBrand",
        boxShadow: "0 1px 2px rgba(239, 68, 68, 0.20)",
        _hover: {
          bg: "red.600",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(239, 68, 68, 0.30)",
        },
        _active: { bg: "red.700", transform: "translateY(0)" },
      },
    },
  },
  defaultVariants: { variant: "solid" },
});

const badgeRecipe = defineRecipe({
  base: { borderRadius: "full", fontWeight: "600", px: 2.5, py: 1 },
});

const inputRecipe = defineRecipe({
  base: { ...inputBaseField, h: { base: "44px", md: "40px" } },
});

const textareaRecipe = defineRecipe({
  base: inputBaseField,
});

const config = defineConfig({
  globalCss: {
    body: {
      bg: "bg.canvas",
      color: "text.primary",
      fontSize: "sm",
      minH: "100vh",
      backgroundImage:
        "radial-gradient(ellipse 60% 40% at 10% -10%, rgba(47, 128, 237, 0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 35% at 90% 5%, rgba(30, 178, 138, 0.05) 0%, transparent 55%)",
      _dark: {
        backgroundImage:
          "radial-gradient(ellipse 70% 50% at 12% -10%, rgba(95, 161, 255, 0.05) 0%, transparent 65%)",
      },
    },
    "*::placeholder": { color: "text.muted" },
    ".rich-text-editor .ProseMirror": {
      outline: "none",
      minH: "120px",
      px: 4,
      py: 3,
      fontSize: "sm",
      lineHeight: 1.6,
      color: "text.primary",
    },
    ".rich-text-editor .ProseMirror p.is-editor-empty:first-of-type::before": {
      content: "attr(data-placeholder)",
      float: "left",
      color: "text.muted",
      pointerEvents: "none",
      height: 0,
    },
    ".rich-text-editor .ProseMirror h2": {
      fontSize: "1.15em",
      fontWeight: 700,
      margin: "0.8em 0 0.4em",
    },
    ".rich-text-editor .ProseMirror h3": {
      fontSize: "1.05em",
      fontWeight: 600,
      margin: "0.6em 0 0.3em",
    },
    ".rich-text-editor .ProseMirror ul, .rich-text-editor .ProseMirror ol": {
      paddingLeft: "1.4em",
      margin: "0.4em 0",
    },
    ".rich-text-editor .ProseMirror li": { margin: "0.15em 0" },
    ".rich-text-editor .ProseMirror blockquote": {
      borderLeft: "3px solid",
      borderColor: "border.default",
      paddingLeft: 3,
      margin: "0.5em 0",
      color: "text.secondary",
    },
    ".rich-text-editor .ProseMirror code": {
      bg: "bg.muted",
      px: 1,
      borderRadius: "3px",
      fontSize: "0.9em",
    },
    ".rich-text-editor .ProseMirror p": { margin: "0.25em 0" },
    ".rich-text-viewer": { fontSize: "sm", lineHeight: 1.6, color: "text.secondary" },
    ".rich-text-viewer h2": {
      fontSize: "1.15em",
      fontWeight: 700,
      margin: "0.8em 0 0.4em",
      color: "text.primary",
    },
    ".rich-text-viewer h3": {
      fontSize: "1.05em",
      fontWeight: 600,
      margin: "0.6em 0 0.3em",
      color: "text.primary",
    },
    ".rich-text-viewer ul, .rich-text-viewer ol": {
      paddingLeft: "1.4em",
      margin: "0.4em 0",
    },
    ".rich-text-viewer li": { margin: "0.15em 0" },
    ".rich-text-viewer blockquote": {
      borderLeft: "3px solid",
      borderColor: "border.default",
      paddingLeft: 3,
      margin: "0.5em 0",
      color: "text.muted",
    },
    ".rich-text-viewer code": {
      bg: "bg.muted",
      px: 1,
      borderRadius: "3px",
      fontSize: "0.9em",
    },
    ".rich-text-viewer p": { margin: "0.25em 0" },
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
        heading: { value: "'Nunito Sans', sans-serif" },
        body: { value: "'Nunito Sans', sans-serif" },
        mono: { value: "'JetBrains Mono', 'Fira Code', monospace" },
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
      shadows: {
        sm: {
          value:
            "0px 1px 3px rgba(15, 23, 42, 0.08), 0px 1px 2px rgba(15, 23, 42, 0.04)",
        },
        "recording-glow": {
          value:
            "0px 0px 0px 3px rgba(239, 68, 68, 0.15), 0px 4px 16px rgba(239, 68, 68, 0.10)",
        },
      },
    },
    semanticTokens: {
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
            gold: { value: { base: "#E0A500", _dark: "#FACC15" } },
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
          onBrand: { value: { base: "#ffffff", _dark: "#ffffff" } },
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
            bg: { value: { base: "{colors.green.50}", _dark: "rgba(34, 197, 94, 0.12)" } },
            border: { value: { base: "{colors.green.200}", _dark: "rgba(34, 197, 94, 0.30)" } },
          },
          warning: {
            fg: { value: { base: "{colors.purple.600}", _dark: "{colors.purple.300}" } },
            bg: { value: { base: "{colors.purple.50}", _dark: "rgba(168, 85, 247, 0.12)" } },
            border: { value: { base: "{colors.purple.200}", _dark: "rgba(168, 85, 247, 0.30)" } },
          },
          error: {
            fg: { value: { base: "{colors.red.600}", _dark: "{colors.red.300}" } },
            bg: { value: { base: "{colors.red.50}", _dark: "rgba(239, 68, 68, 0.12)" } },
            border: { value: { base: "{colors.red.200}", _dark: "rgba(239, 68, 68, 0.30)" } },
          },
          info: {
            fg: { value: { base: "{colors.brand.600}", _dark: "{colors.brand.300}" } },
            bg: { value: { base: "{colors.brand.50}", _dark: "rgba(95, 161, 255, 0.12)" } },
            border: { value: { base: "{colors.brand.200}", _dark: "rgba(95, 161, 255, 0.30)" } },
          },
          neutral: {
            fg: { value: { base: "{colors.neutral.600}", _dark: "#a8a6b1" } },
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
        },
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
    },
    textStyles: {
      display: {
        value: {
          fontFamily: "heading",
          fontWeight: "800",
          fontSize: { base: "2xl", md: "3xl" },
          lineHeight: "1.2",
          letterSpacing: "-0.02em",
        },
      },
      pageTitle: {
        value: {
          fontFamily: "heading",
          fontWeight: "700",
          fontSize: { base: "lg", md: "xl" },
          lineHeight: "1.25",
          letterSpacing: "tight",
        },
      },
      sectionTitle: {
        value: {
          fontFamily: "heading",
          fontWeight: "700",
          fontSize: "md",
          lineHeight: "1.3",
        },
      },
      eyebrow: {
        value: {
          fontFamily: "heading",
          fontWeight: "700",
          fontSize: "xs",
          lineHeight: "1.2",
          letterSpacing: "wider",
          textTransform: "uppercase",
        },
      },
      body: {
        value: { fontFamily: "body", fontWeight: "400", fontSize: "sm", lineHeight: "1.6" },
      },
      bodyStrong: {
        value: { fontFamily: "body", fontWeight: "600", fontSize: "sm", lineHeight: "1.5" },
      },
      caption: {
        value: { fontFamily: "body", fontWeight: "500", fontSize: "xs", lineHeight: "1.4" },
      },
      mono: {
        value: { fontFamily: "mono", fontWeight: "500", fontSize: "xs", lineHeight: "1.4" },
      },
    },
    recipes: {
      button: buttonRecipe,
      badge: badgeRecipe,
      input: inputRecipe,
      textarea: textareaRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
