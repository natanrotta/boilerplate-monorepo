import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { UnderlineTabs } from "./UnderlineTabs";

const ITEMS = [
  { value: "profile", label: "Perfil", count: 3 },
  { value: "preferences", label: "Preferências" },
];

describe("UnderlineTabs", () => {
  it("marks the selected tab and shows counters", () => {
    renderWithProviders(
      <UnderlineTabs ariaLabel="Seções" items={ITEMS} value="profile" onChange={vi.fn()} />,
    );

    expect(screen.getByRole("tablist", { name: "Seções" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Perfil/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: /Perfil/ })).toHaveTextContent("3");
    expect(screen.getByRole("tab", { name: "Preferências" })).toHaveAttribute("aria-selected", "false");
  });

  it("reports the clicked tab", () => {
    const onChange = vi.fn();
    renderWithProviders(
      <UnderlineTabs ariaLabel="Seções" items={ITEMS} value="profile" onChange={onChange} />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Preferências" }));

    expect(onChange).toHaveBeenCalledWith("preferences");
  });

  it("moves selection and focus with the arrow keys and wires the panel", () => {
    const onChange = vi.fn();
    renderWithProviders(
      <UnderlineTabs
        ariaLabel="Seções"
        items={ITEMS}
        value="profile"
        onChange={onChange}
        panelId="settings-panel"
      />,
    );

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });

    expect(onChange).toHaveBeenCalledWith("preferences");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Preferências" }));
    expect(screen.getByRole("tab", { name: "Preferências" })).toHaveAttribute("aria-controls", "settings-panel");
    expect(screen.getByRole("tab", { name: /Perfil/ })).toHaveAttribute("tabindex", "0");
  });

  it("draws the selection indicator inside the selected option only", () => {
    renderWithProviders(
      <UnderlineTabs ariaLabel="Seções" items={ITEMS} value="profile" onChange={vi.fn()} />,
    );

    // One indicator, in the selected option: it is what slides on a change.
    const selected = screen.getAllByRole("tab").filter(
      (option) => option.getAttribute("aria-selected") === "true",
    );
    expect(selected).toHaveLength(1);
    expect(screen.getAllByTestId("sliding-indicator")).toHaveLength(1);
    expect(selected[0]).toContainElement(screen.getByTestId("sliding-indicator"));
  });
});
