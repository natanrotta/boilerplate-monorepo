import { memo, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { GLYPHS, type AnimatedIconName } from "./glyphs";

/** How long `playOnMount` holds the playing state — longer than any glyph's keyframes. */
const MOUNT_PLAY_MS = 900;

interface AnimatedIconProps {
  name: AnimatedIconName;
  /** Box size — a number is px; defaults to `1em` so it follows the font size. */
  size?: number | string;
  /**
   * Controlled trigger: the control that OWNS the icon (a nav row, a button)
   * passes its hover/focus state — see `useHoverPlay`. Omit it and the icon
   * plays when pointed at directly.
   */
  playing?: boolean;
  /** Play once when the icon MOUNTS (empty states). Read on mount only. */
  playOnMount?: boolean;
  /** Decorative by default; pass a label only when the icon is the sole content. */
  ariaLabel?: string;
}

/**
 * A product icon with a single-shot micro-animation: it moves once when the
 * user points at its control, rests in exactly the static pose, never loops,
 * and stays still under `prefers-reduced-motion`.
 * Color is inherited (`currentColor`): set it with a token on the parent.
 */
function AnimatedIconComponent({
  name,
  size = "1em",
  playing,
  playOnMount = false,
  ariaLabel,
}: AnimatedIconProps) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [mountPlaying, setMountPlaying] = useState(playOnMount);

  useEffect(() => {
    if (!playOnMount) return;
    const timer = setTimeout(() => setMountPlaying(false), MOUNT_PLAY_MS);
    return () => clearTimeout(timer);
  }, [playOnMount]);

  const isControlled = playing !== undefined;
  const wantsToPlay = (isControlled ? playing : hovered) || mountPlaying;
  const isPlaying = wantsToPlay && !reduceMotion;

  return (
    <svg
      data-cy={`animated-icon-${name}`}
      data-playing={isPlaying}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      focusable="false"
      style={{ flexShrink: 0, overflow: "visible" }}
      onMouseEnter={isControlled ? undefined : () => setHovered(true)}
      onMouseLeave={isControlled ? undefined : () => setHovered(false)}
    >
      {GLYPHS[name](isPlaying)}
    </svg>
  );
}

export const AnimatedIcon = memo(AnimatedIconComponent);
