import { Box, type BoxProps } from "@chakra-ui/react";
import { motion } from "motion/react";
import type { MotionConflictingProps } from "@/shared/constants/animation";

const MotionBox = motion.create(Box);

/** A quick, slightly sprung glide: it arrives without overshooting. */
export const INDICATOR_SPRING = { type: "spring", stiffness: 520, damping: 42, mass: 0.9 } as const;

interface SlidingIndicatorProps extends Omit<BoxProps, MotionConflictingProps> {
  /**
   * Shared between the options of ONE control: the indicator of the newly
   * selected option animates from where the previous one was. Wrap the
   * control in a `LayoutGroup` with its own id so two controls on the same
   * page never trade indicators.
   */
  layoutId: string;
}

/**
 * The "selected" mark of a navigation control (the sidebar row's tint, a
 * segmented control's pill, a tab's underline) that SLIDES to the new
 * selection instead of blinking from one option to the other. Render it only
 * inside the selected option, behind its content (the option must be
 * `position: relative`). Decorative: the option itself carries the state
 * (`aria-current`, `aria-checked`, `aria-selected`). Stays still under
 * `prefers-reduced-motion` (see `MotionConfig` in `AppProviders`).
 */
export function SlidingIndicator({ layoutId, ...boxProps }: SlidingIndicatorProps) {
  return (
    <MotionBox
      aria-hidden="true"
      layoutId={layoutId}
      position="absolute"
      inset={0}
      pointerEvents="none"
      transition={INDICATOR_SPRING}
      data-cy="sliding-indicator"
      {...boxProps}
    />
  );
}
