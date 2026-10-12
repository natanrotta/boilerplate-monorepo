import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import { DevQuickLoginPanel } from "./DevQuickLoginPanel";

const hookState = {
  users: [] as { id: string; name: string; email: string; avatarUrl: string | null }[],
  isLoading: false,
  isError: false,
  isDisabled: false,
  refetch: vi.fn(),
  impersonate: vi.fn(),
  impersonatingId: null as string | null,
};

vi.mock("@/modules/auth/presentation/hooks/useDevQuickLogin", () => ({
  useDevQuickLogin: () => hookState,
}));

const DEMO = { id: "u1", name: "Demo User", email: "demo@example.com", avatarUrl: null };

describe("DevQuickLoginPanel", () => {
  const assign = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(hookState, {
      users: [DEMO],
      isLoading: false,
      isError: false,
      isDisabled: false,
      impersonatingId: null,
    });
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, assign },
    });
  });

  it("renders nothing when the API does not expose the dev routes", () => {
    hookState.isDisabled = true;
    hookState.isError = true;

    renderWithProviders(<DevQuickLoginPanel />);

    expect(screen.queryByTestId("dev-quick-login")).not.toBeInTheDocument();
  });

  it("signs in as the clicked user and reloads into the app", async () => {
    hookState.impersonate.mockResolvedValue(undefined);
    renderWithProviders(<DevQuickLoginPanel />);

    await userEvent.click(screen.getByRole("button", { name: /Demo User/ }));

    expect(hookState.impersonate).toHaveBeenCalledWith("u1");
    await waitFor(() => expect(assign).toHaveBeenCalledWith("/dashboard"));
  });

  it("stays on the page when the impersonation fails", async () => {
    hookState.impersonate.mockRejectedValue(new Error("boom"));
    renderWithProviders(<DevQuickLoginPanel />);

    await userEvent.click(screen.getByRole("button", { name: /Demo User/ }));

    await waitFor(() => expect(hookState.impersonate).toHaveBeenCalled());
    expect(assign).not.toHaveBeenCalled();
  });

  it("tells the developer to run the seed when the database has no users", () => {
    hookState.users = [];

    renderWithProviders(<DevQuickLoginPanel />);

    expect(screen.getByText(/Rode o seed/)).toBeInTheDocument();
    expect(screen.queryByTestId("dev-quick-login-user")).not.toBeInTheDocument();
  });

  it("offers a retry when the user list fails to load", async () => {
    hookState.isError = true;
    hookState.users = [];
    renderWithProviders(<DevQuickLoginPanel />);

    await userEvent.click(screen.getByRole("button"));

    expect(hookState.refetch).toHaveBeenCalled();
  });
});
