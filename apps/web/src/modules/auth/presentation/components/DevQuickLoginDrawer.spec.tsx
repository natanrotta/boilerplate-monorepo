import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import { DevQuickLoginDrawer } from "./DevQuickLoginDrawer";

const hookState = {
  users: [{ id: "u1", name: "Demo User", email: "demo@example.com", avatarUrl: null }],
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

describe("DevQuickLoginDrawer", () => {
  beforeEach(() => {
    hookState.isDisabled = false;
  });

  it("shows only a small trigger until it is opened", async () => {
    renderWithProviders(<DevQuickLoginDrawer />);

    expect(screen.getByTestId("dev-quick-login-trigger")).toBeInTheDocument();
    expect(screen.queryByText("Demo User")).not.toBeInTheDocument();

    await userEvent.click(screen.getByTestId("dev-quick-login-trigger"));

    expect(await screen.findByText("Demo User")).toBeInTheDocument();
  });

  it("renders nothing — not even the trigger — when the API does not expose the dev routes", () => {
    hookState.isDisabled = true;

    renderWithProviders(<DevQuickLoginDrawer />);

    expect(screen.queryByTestId("dev-quick-login-trigger")).not.toBeInTheDocument();
  });
});
