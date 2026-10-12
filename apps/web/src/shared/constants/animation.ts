// Typed as a fixed 4-tuple so `motion` (v12) accepts it as a cubic-bezier
// easing (its `Easing` type rejects a plain `number[]`).
export const EASE_ORGANIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const TRANSITION_FAST = { duration: 0.2, ease: EASE_ORGANIC };
export const TRANSITION_DEFAULT = { duration: 0.25, ease: EASE_ORGANIC };
export const TRANSITION_SLOW = { duration: 0.3, ease: EASE_ORGANIC };

/**
 * Chakra v3 style/DOM props whose types collide with motion's own props once a
 * Chakra component is wrapped with `motion.create(...)` — the CSS `transition`
 * prop vs. motion's animation `transition`, and React's drag/animation DOM
 * handlers vs. motion's gesture handlers. Omit these from any Chakra `*Props`
 * you spread onto a `MotionBox`/`MotionFlex` root to keep the spread type-safe.
 */
export type MotionConflictingProps =
  | "transition"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";
