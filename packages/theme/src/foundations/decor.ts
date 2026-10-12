/**
 * Decorative backgrounds written as raw CSS — a gradient cannot be a color
 * token. Each one paints with `{colors.*}` references, so it follows the color
 * mode like everything else and no component writes a color function.
 */

/** The soft accent glow behind a hero or a closing call to action. */
export const ACCENT_GLOW = "radial-gradient(closest-side, {colors.bg.glow.primary}, transparent)";

/** The faint square grid behind a hero (56px cells)… */
export const GRID_IMAGE =
  "linear-gradient({colors.border.grid} 1px, transparent 1px), linear-gradient(90deg, {colors.border.grid} 1px, transparent 1px)";

/** …faded out towards the edges. A mask only reads alpha; the color is irrelevant. */
export const GRID_MASK = "radial-gradient(ellipse 60% 55% at 50% 40%, black 30%, transparent 75%)";
