import { defineTextStyles } from "@chakra-ui/react";

// The eight voices of the product. Nunito Sans carries structure and prose;
// `mono` is reserved for identifiers, versions and timestamps.
export const textStyles = defineTextStyles({
  // Marketing-sized statement (auth screens).
  display: {
    value: {
      fontFamily: "heading",
      fontWeight: "800",
      fontSize: { base: "2xl", md: "3xl" },
      lineHeight: "1.2",
      letterSpacing: "-0.02em",
    },
  },
  // Page title — `PageHeader` renders it as the `<h1>`.
  pageTitle: {
    value: {
      fontFamily: "heading",
      fontWeight: "700",
      fontSize: { base: "lg", md: "xl" },
      lineHeight: "1.25",
      letterSpacing: "tight",
    },
  },
  // Card / section title.
  sectionTitle: {
    value: {
      fontFamily: "heading",
      fontWeight: "700",
      fontSize: "md",
      lineHeight: "1.3",
    },
  },
  // Field label and column header: tiny, uppercase, wide tracking.
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
  // Identifiers, versions, timestamps.
  mono: {
    value: { fontFamily: "mono", fontWeight: "500", fontSize: "xs", lineHeight: "1.4" },
  },
});
