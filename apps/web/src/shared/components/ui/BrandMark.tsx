import { memo, useId } from "react";
import { chakra } from "@chakra-ui/react";
import { BRAND_MARK } from "@boilerplate/theme";

interface BrandMarkProps {
  /** Edge of the tile, in px. */
  size?: number;
}

/**
 * The placeholder brand mark: a gradient tile carrying a monoline "B" with a
 * spark. The same drawing as `public/favicon.svg`, so the tab, the sidebar and
 * the sign-in screen show one brand. It keeps its colors in both color modes.
 * Decorative: the name next to it is the label. Swap the drawing (and
 * `BRAND_MARK` in `@boilerplate/theme`) when you rebrand.
 */
function BrandMarkComponent({ size = 22 }: BrandMarkProps) {
  const id = useId();
  const [from, via, to] = BRAND_MARK.gradient;

  return (
    <chakra.svg
      data-cy="brand-mark"
      aria-hidden
      viewBox="0 0 64 64"
      flexShrink={0}
      w={`${size}px`}
      h={`${size}px`}
    >
      <defs>
        <linearGradient id={`${id}-tile`} x1="6" y1="2" x2="58" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={from} />
          <stop offset="0.5" stopColor={via} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="32" y1="0" x2="32" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={BRAND_MARK.ink} stopOpacity={BRAND_MARK.sheenOpacity} />
          <stop offset="1" stopColor={BRAND_MARK.ink} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${id}-tile)`} />
      <rect width="64" height="64" rx="16" fill={`url(#${id}-sheen)`} />
      <g
        fill="none"
        stroke={BRAND_MARK.ink}
        strokeWidth="6.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M24 17.5v29" />
        <path d="M24 17.5h10.2a7.25 7.25 0 0 1 0 14.5H33" />
        <path d="M33 32h4.2a7.25 7.25 0 0 1 0 14.5H24" />
      </g>
      <circle cx="47.5" cy="18" r="3.4" fill={BRAND_MARK.ink} opacity="0.92" />
    </chakra.svg>
  );
}

export const BrandMark = memo(BrandMarkComponent);
