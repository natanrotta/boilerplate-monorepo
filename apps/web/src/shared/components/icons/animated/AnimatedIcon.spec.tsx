import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

const reducedMotion = vi.hoisted(() => ({ value: false }));
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => reducedMotion.value,
}));

import { AnimatedIcon } from "./AnimatedIcon";
import { ANIMATED_ICON_NAMES } from "./glyphs";

const icon = (name: string) => screen.getByTestId(`animated-icon-${name}`);

describe("AnimatedIcon", () => {
  beforeEach(() => {
    reducedMotion.value = false;
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it("renders a decorative svg for every registered glyph", () => {
    expect(ANIMATED_ICON_NAMES.length).toBeGreaterThan(0);
    for (const name of ANIMATED_ICON_NAMES) {
      const { unmount } = render(<AnimatedIcon name={name} />);
      const svg = icon(name);
      expect(svg.tagName.toLowerCase()).toBe("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("stroke", "currentColor");
      expect(svg.childElementCount).toBeGreaterThan(0);
      unmount();
    }
  });

  it("is labelled instead of hidden when it is the only content", () => {
    render(<AnimatedIcon name="success" ariaLabel="Concluído" />);

    expect(screen.getByRole("img", { name: "Concluído" })).toBeInTheDocument();
  });

  it("rests until told to play, and follows the controlled prop", () => {
    const { rerender } = render(<AnimatedIcon name="settings" playing={false} />);
    expect(icon("settings")).toHaveAttribute("data-playing", "false");

    rerender(<AnimatedIcon name="settings" playing />);
    expect(icon("settings")).toHaveAttribute("data-playing", "true");
  });

  it("ignores its own hover while a host controls it", () => {
    render(<AnimatedIcon name="settings" playing={false} />);

    fireEvent.mouseEnter(icon("settings"));

    expect(icon("settings")).toHaveAttribute("data-playing", "false");
  });

  it("plays on its own hover when uncontrolled", () => {
    render(<AnimatedIcon name="search" />);

    fireEvent.mouseEnter(icon("search"));
    expect(icon("search")).toHaveAttribute("data-playing", "true");

    fireEvent.mouseLeave(icon("search"));
    expect(icon("search")).toHaveAttribute("data-playing", "false");
  });

  it("plays once on mount, then rests", () => {
    render(<AnimatedIcon name="dashboard" playOnMount />);
    expect(icon("dashboard")).toHaveAttribute("data-playing", "true");

    act(() => vi.advanceTimersByTime(1000));

    expect(icon("dashboard")).toHaveAttribute("data-playing", "false");
  });

  it("never plays under prefers-reduced-motion", () => {
    reducedMotion.value = true;
    const { rerender } = render(<AnimatedIcon name="clock" playing playOnMount />);
    expect(icon("clock")).toHaveAttribute("data-playing", "false");

    rerender(<AnimatedIcon name="clock" />);
    fireEvent.mouseEnter(icon("clock"));
    expect(icon("clock")).toHaveAttribute("data-playing", "false");
  });
});
