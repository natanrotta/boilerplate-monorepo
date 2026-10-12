import { useMemo, useState, type FocusEvent } from "react";

function isKeyboardFocus(element: HTMLElement): boolean {
  try {
    return element.matches(":focus-visible");
  } catch {
    // An engine without `:focus-visible` (old jsdom): treat focus as keyboard.
    return true;
  }
}

/**
 * Hover/focus state of the control that owns an `AnimatedIcon`:
 *
 * ```tsx
 * const { playing, hostProps } = useHoverPlay();
 * <Flex {...hostProps}><AnimatedIcon name="settings" playing={playing} /> Settings</Flex>
 * ```
 *
 * The whole row triggers the icon (pointing at the label counts), and keyboard
 * focus (`:focus-visible`) plays it too.
 */
export function useHoverPlay() {
  const [playing, setPlaying] = useState(false);

  const hostProps = useMemo(
    () => ({
      onMouseEnter: () => setPlaying(true),
      onMouseLeave: () => setPlaying(false),
      // Keyboard focus only: a mouse click also focuses the control, and must
      // not replay the icon the pointer already played.
      onFocus: (event: FocusEvent<HTMLElement>) => {
        if (isKeyboardFocus(event.currentTarget)) setPlaying(true);
      },
      onBlur: () => setPlaying(false),
    }),
    [],
  );

  return { playing, hostProps };
}
