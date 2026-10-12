import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "@/core/errors/AppError";
import { useDevQuickLogin } from "./useDevQuickLogin";

const listUsers = vi.hoisted(() => vi.fn());

vi.mock("@/modules/auth/infrastructure/repositories/HttpDevAuthRepository", () => ({
  HttpDevAuthRepository: class {
    listUsers = listUsers;
    impersonate = vi.fn();
  },
}));

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useDevQuickLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists the users of the local database", async () => {
    const users = [{ id: "u1", name: "Demo User", email: "demo@example.com", avatarUrl: null }];
    listUsers.mockResolvedValue(users);

    const { result } = renderHook(() => useDevQuickLogin(), { wrapper });

    await waitFor(() => expect(result.current.users).toEqual(users));
    expect(result.current.isDisabled).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("reads a 404 as \"the API does not expose the dev routes\" — the panel hides", async () => {
    listUsers.mockRejectedValue(new AppError("Not found", "NOT_FOUND", 404));

    const { result } = renderHook(() => useDevQuickLogin(), { wrapper });

    await waitFor(() => expect(result.current.isDisabled).toBe(true));
  });

  it("keeps the panel (with its retry) when the API is simply unreachable", async () => {
    listUsers.mockRejectedValue(new AppError("Network error", "NETWORK_ERROR", 0));

    const { result } = renderHook(() => useDevQuickLogin(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.isDisabled).toBe(false);
  });
});
