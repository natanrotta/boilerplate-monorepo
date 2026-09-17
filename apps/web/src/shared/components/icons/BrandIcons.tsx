import type { SVGProps } from "react";

/**
 * Fill marks with no Lucide equivalent, inlined so the app doesn't carry a
 * whole icon package for one glyph. Same render contract as the Lucide
 * re-exports in `index.ts`: 1em box, `currentColor` fill, props spread onto the
 * svg — works with `<Icon as={...}>`, `icon={<... />}` and `<Box as={...}>`.
 */

/** Filled bookmark (Bootstrap Icons `bookmark-fill`, MIT). */
export function BsBookmarkFill(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
    </svg>
  );
}
