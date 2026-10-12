import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { SegmentedControl } from "./SegmentedControl";

const OPTIONS = [
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "30", label: "30" },
];

describe("SegmentedControl", () => {
  it("exposes a radio group with the selected option checked and alone in the tab order", () => {
    renderWithProviders(
      <SegmentedControl ariaLabel="Por página" options={OPTIONS} value="20" onChange={vi.fn()} />,
    );

    expect(screen.getByRole("radiogroup", { name: "Por página" })).toBeInTheDocument();
    const selected = screen.getByRole("radio", { name: "20" });
    expect(selected).toHaveAttribute("aria-checked", "true");
    expect(selected).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: "10" })).toHaveAttribute("tabindex", "-1");
  });

  it("reports the clicked option", () => {
    const onChange = vi.fn();
    renderWithProviders(
      <SegmentedControl ariaLabel="Por página" options={OPTIONS} value="10" onChange={onChange} />,
    );

    fireEvent.click(screen.getByRole("radio", { name: "30" }));

    expect(onChange).toHaveBeenCalledWith("30");
  });

  it("moves the selection with the arrow keys and wraps around", () => {
    const onChange = vi.fn();
    renderWithProviders(
      <SegmentedControl ariaLabel="Por página" options={OPTIONS} value="30" onChange={onChange} />,
    );
    const group = screen.getByRole("radiogroup");

    fireEvent.keyDown(group, { key: "ArrowRight" });
    fireEvent.keyDown(group, { key: "ArrowLeft" });

    expect(onChange).toHaveBeenNthCalledWith(1, "10");
    expect(onChange).toHaveBeenNthCalledWith(2, "20");
  });

  it("moves DOM focus to the newly selected option", () => {
    renderWithProviders(
      <SegmentedControl ariaLabel="Por página" options={OPTIONS} value="10" onChange={vi.fn()} />,
    );

    fireEvent.keyDown(screen.getByRole("radiogroup"), { key: "ArrowRight" });

    expect(document.activeElement).toBe(screen.getByRole("radio", { name: "20" }));
  });

  it("keeps a tab stop when the value is not one of the options", () => {
    renderWithProviders(
      <SegmentedControl ariaLabel="Por página" options={OPTIONS} value="99" onChange={vi.fn()} />,
    );

    expect(screen.getByRole("radio", { name: "10" })).toHaveAttribute("tabindex", "0");
  });

  it("draws the selection indicator inside the selected option only", () => {
    renderWithProviders(
      <SegmentedControl ariaLabel="Por página" options={OPTIONS} value="20" onChange={vi.fn()} />,
    );

    // One indicator, in the selected option: it is what slides on a change.
    const selected = screen.getAllByRole("radio").filter(
      (option) => option.getAttribute("aria-checked") === "true",
    );
    expect(selected).toHaveLength(1);
    expect(screen.getAllByTestId("sliding-indicator")).toHaveLength(1);
    expect(selected[0]).toContainElement(screen.getByTestId("sliding-indicator"));
  });
});
