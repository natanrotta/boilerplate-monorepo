// The brand mark's own colors. They do NOT follow the color mode: the mark is
// the same tile on the light canvas, on the dark one and in the browser tab
// (`apps/*/public/favicon.svg` is this same drawing). Rebranding starts here.
export const BRAND_MARK = {
  /** The tile's diagonal gradient, top-left to bottom-right. */
  gradient: ["#6b9bff", "#3e6fef", "#7a56e8"],
  /** The monogram and its spark. */
  ink: "#ffffff",
  /** Opacity of the light falling on the top of the tile. */
  sheenOpacity: 0.26,
} as const;
