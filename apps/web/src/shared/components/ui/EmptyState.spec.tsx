import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("shows the title, the description and no action by default", () => {
    renderWithProviders(<EmptyState title="Nada aqui" description="Crie o primeiro." />);

    expect(screen.getByText("Nada aqui")).toBeInTheDocument();
    expect(screen.getByText("Crie o primeiro.")).toBeInTheDocument();
    expect(screen.queryByTestId("empty-state-action")).not.toBeInTheDocument();
  });

  it("calls the action", () => {
    const onAction = vi.fn();
    renderWithProviders(
      <EmptyState title="Nada" description="..." actionLabel="Adicionar" onAction={onAction} />,
    );

    fireEvent.click(screen.getByTestId("empty-state-action"));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("renders the animated glyph, playing once on mount", () => {
    renderWithProviders(<EmptyState title="Nada" description="..." animatedIcon="search" />);

    expect(screen.getByTestId("animated-icon-search")).toHaveAttribute("data-playing", "true");
  });
});
