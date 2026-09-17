import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { RouteErrorBoundary } from "@/shared/components/ui/RouteErrorBoundary";
import commonPtBR from "@/shared/i18n/locales/pt-BR/common.json";

const { reloadForStaleChunk } = vi.hoisted(() => ({ reloadForStaleChunk: vi.fn() }));

vi.mock("@/shared/utils/chunkReload", () => ({ reloadForStaleChunk }));

function Boom({ error }: { error: Error }): never {
  throw error;
}

/**
 * Every page renders inside this boundary. The two behaviours that matter are
 * that a crash degrades to a retryable fallback instead of a blank app, and
 * that a stale-chunk failure (deploy noise, not a bug) self-heals with a reload
 * instead of parking the user on the dead screen.
 */
describe("RouteErrorBoundary", () => {
  beforeEach(() => {
    reloadForStaleChunk.mockClear();
    // React logs caught render errors to console.error; keep the output clean.
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("shows the retryable fallback when a child crashes", async () => {
    renderWithProviders(
      <RouteErrorBoundary locationKey="/dashboard">
        <Boom error={new Error("boom")} />
      </RouteErrorBoundary>,
    );

    expect(
      await screen.findByRole("button", { name: commonPtBR.actions.retry }),
    ).toBeInTheDocument();
    expect(screen.getByText(commonPtBR.errors.pageLoadError)).toBeInTheDocument();
    expect(reloadForStaleChunk).not.toHaveBeenCalled();
  });

  it("reloads once on a stale-chunk error", async () => {
    renderWithProviders(
      <RouteErrorBoundary locationKey="/dashboard">
        <Boom error={new Error("Failed to fetch dynamically imported module: /x.js")} />
      </RouteErrorBoundary>,
    );

    expect(
      await screen.findByRole("button", { name: commonPtBR.actions.retry }),
    ).toBeInTheDocument();
    expect(reloadForStaleChunk).toHaveBeenCalledTimes(1);
  });

  it("clears the error when the route changes", async () => {
    const { rerender } = renderWithProviders(
      <RouteErrorBoundary locationKey="/dashboard">
        <Boom error={new Error("boom")} />
      </RouteErrorBoundary>,
    );
    await screen.findByRole("button", { name: commonPtBR.actions.retry });

    rerender(
      <RouteErrorBoundary locationKey="/settings">
        <span>conteúdo novo</span>
      </RouteErrorBoundary>,
    );

    expect(await screen.findByText("conteúdo novo")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: commonPtBR.actions.retry }),
    ).not.toBeInTheDocument();
  });
});
