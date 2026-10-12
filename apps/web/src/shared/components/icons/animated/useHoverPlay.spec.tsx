import { describe, expect, it } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useHoverPlay } from "./useHoverPlay";

function Host() {
  const { playing, hostProps } = useHoverPlay();
  return (
    <button type="button" data-cy="host" data-playing={playing} {...hostProps}>
      Settings
    </button>
  );
}

describe("useHoverPlay", () => {
  it("plays while the host is hovered", () => {
    render(<Host />);
    const host = screen.getByTestId("host");
    expect(host).toHaveAttribute("data-playing", "false");

    fireEvent.mouseEnter(host);
    expect(host).toHaveAttribute("data-playing", "true");

    fireEvent.mouseLeave(host);
    expect(host).toHaveAttribute("data-playing", "false");
  });

  it("plays while the host has keyboard focus", () => {
    render(<Host />);
    const host = screen.getByTestId("host");

    // A real focus (not a synthetic event), so `:focus-visible` matches.
    act(() => host.focus());
    expect(host).toHaveAttribute("data-playing", "true");

    act(() => host.blur());
    expect(host).toHaveAttribute("data-playing", "false");
  });
});
