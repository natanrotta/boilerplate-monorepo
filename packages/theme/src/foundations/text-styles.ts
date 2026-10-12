import { defineTextStyles } from "@chakra-ui/react";

// The voices of the product. Geist carries structure and prose, with tight
// negative tracking on anything large. Geist Mono carries identifiers, versions
// and timestamps, and the small uppercase eyebrow.
export const textStyles = defineTextStyles({
  // Marketing-sized statement (auth screens).
  display: {
    value: {
      fontFamily: "heading",
      fontWeight: "600",
      fontSize: { base: "28px", md: "32px" },
      lineHeight: "1.1",
      letterSpacing: "-0.04em",
    },
  },
  // Page title — `PageHeader` renders it as the `<h1>`.
  pageTitle: {
    value: {
      fontFamily: "heading",
      fontWeight: "600",
      fontSize: { base: "lg", md: "xl" },
      lineHeight: "1.2",
      letterSpacing: "-0.03em",
    },
  },
  // Card / section title.
  sectionTitle: {
    value: {
      fontFamily: "heading",
      fontWeight: "600",
      fontSize: "md",
      lineHeight: "1.3",
      letterSpacing: "-0.02em",
    },
  },
  // Field label and column header: tiny, uppercase, mono, wide tracking.
  eyebrow: {
    value: {
      fontFamily: "mono",
      fontWeight: "400",
      fontSize: "11px",
      lineHeight: "1.2",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
  },
  body: {
    value: { fontFamily: "body", fontWeight: "400", fontSize: "sm", lineHeight: "1.55" },
  },
  bodyStrong: {
    value: { fontFamily: "body", fontWeight: "500", fontSize: "sm", lineHeight: "1.5" },
  },
  caption: {
    value: { fontFamily: "body", fontWeight: "400", fontSize: "xs", lineHeight: "1.4" },
  },
  // Identifiers, versions, timestamps.
  mono: {
    value: {
      fontFamily: "mono",
      fontWeight: "400",
      fontSize: "xs",
      lineHeight: "1.4",
      fontVariantNumeric: "tabular-nums",
    },
  },
});
