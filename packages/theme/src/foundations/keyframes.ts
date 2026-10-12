import { defineKeyframes } from "@chakra-ui/react";

// The motion vocabulary, declared once. A component names one of these in its
// `animation` — it never writes its own `@keyframes`.
export const keyframes = defineKeyframes({
  // Content rising into place (the site's hero and revealed sections).
  rise: {
    from: { opacity: "0", transform: "translateY(12px)" },
    to: { opacity: "1", transform: "none" },
  },
  // The accent glow breathing behind a hero.
  drift: {
    "0%, 100%": { transform: "translate(-50%, 0) scale(1)" },
    "50%": { transform: "translate(-50%, -20px) scale(1.06)" },
  },
});
