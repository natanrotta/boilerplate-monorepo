import type { ReactNode } from "react";
import { motion, type Transition } from "motion/react";
import { EASE_ORGANIC } from "@/shared/constants/animation";

// Every glyph is drawn on a 16px grid (1.4 stroke, round caps,
// `currentColor`) and takes one boolean: `playing`. A glyph plays ONCE per
// trigger and snaps back to the rest pose the moment `playing` turns off
// (see `timing`), so a `playing` that never turns off (touch "hover") leaves
// a perfectly normal icon and leaving never replays anything.

type Glyph = (playing: boolean) => ReactNode;

const ease = EASE_ORGANIC;

/**
 * The transition of a glyph part: the given timing while playing, an instant
 * snap back to rest otherwise. Without the snap, a part whose keyframes end
 * away from the rest value (the plus at 90°, the clock hand at 360°) would
 * tween BACK on mouse-out — a second, reversed animation — and staggered
 * parts would wait out their delay before returning.
 */
function timing(playing: boolean, config: Transition): Transition {
  return playing ? config : { duration: 0 };
}
/** Transforms on SVG children pivot on the element's own box, not the canvas. */
const pivot = { transformBox: "fill-box", transformOrigin: "center" } as const;

const DASHBOARD_CELLS = [
  [2, 2],
  [9, 2],
  [2, 9],
  [9, 9],
] as const;

export const GLYPHS = {
  // Four tiles that press in one after the other.
  dashboard: (playing) =>
    DASHBOARD_CELLS.map(([x, y], index) => (
      <motion.rect
        key={index}
        x={x}
        y={y}
        width={5}
        height={5}
        rx={1.2}
        style={pivot}
        animate={{ scale: playing ? [1, 0.78, 1] : 1 }}
        transition={timing(playing, { duration: 0.42, delay: index * 0.06, ease })}
      />
    )),

  // Two sliders trade places.
  settings: (playing) => (
    <>
      <path d="M2.4 5h11.2M2.4 11h11.2" />
      <motion.circle
        cx={6}
        cy={5}
        r={1.7}
        fill="currentColor"
        stroke="none"
        animate={{ x: playing ? [0, 3.6, 0] : 0 }}
        transition={timing(playing, { duration: 0.55, ease })}
      />
      <motion.circle
        cx={10}
        cy={11}
        r={1.7}
        fill="currentColor"
        stroke="none"
        animate={{ x: playing ? [0, -3.6, 0] : 0 }}
        transition={timing(playing, { duration: 0.55, ease })}
      />
    </>
  ),

  // The lens sweeps.
  search: (playing) => (
    <motion.g
      style={pivot}
      animate={{ x: playing ? [0, 1.2, -0.8, 0] : 0, y: playing ? [0, -1, 0.6, 0] : 0 }}
      transition={timing(playing, { duration: 0.55, ease })}
    >
      <circle cx={7} cy={7} r={4.3} />
      <path d="m10.3 10.3 3.3 3.3" />
    </motion.g>
  ),

  // A quarter turn.
  plus: (playing) => (
    <motion.path
      d="M8 3v10M3 8h10"
      style={pivot}
      animate={{ rotate: playing ? [0, 90] : 0 }}
      transition={timing(playing, { duration: 0.35, ease })}
    />
  ),

  // The hands run a lap.
  clock: (playing) => (
    <>
      <circle cx={8} cy={8} r={5.8} />
      <motion.path
        d="M8 4.8V8l2.2 1.4"
        style={{ transformBox: "view-box", transformOrigin: "8px 8px" }}
        animate={{ rotate: playing ? [0, 360] : 0 }}
        transition={timing(playing, { duration: 0.7, ease })}
      />
    </>
  ),

  // The check draws itself.
  success: (playing) => (
    <>
      <circle cx={8} cy={8} r={5.8} />
      <motion.path
        d="m5.3 8.2 1.9 1.9 3.5-3.8"
        animate={{ pathLength: playing ? [0, 1] : 1 }}
        transition={timing(playing, { duration: 0.4, ease })}
      />
    </>
  ),

  // A short shake.
  error: (playing) => (
    <motion.g
      animate={{ x: playing ? [0, -1.2, 1.2, -0.8, 0] : 0 }}
      transition={timing(playing, { duration: 0.4, ease })}
    >
      <circle cx={8} cy={8} r={5.8} />
      <path d="M8 5v3.4" />
      <circle cx={8} cy={10.8} r={0.8} fill="currentColor" stroke="none" />
    </motion.g>
  ),
} satisfies Record<string, Glyph>;

export type AnimatedIconName = keyof typeof GLYPHS;

export const ANIMATED_ICON_NAMES = Object.keys(GLYPHS) as AnimatedIconName[];
