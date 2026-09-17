import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import commonPtBR from "@/shared/i18n/locales/pt-BR/common.json";

const { toggleColorModeMock, colorModeRef } = vi.hoisted(() => ({
  toggleColorModeMock: vi.fn(),
  colorModeRef: { current: "dark" as "dark" | "light" },
}));

vi.mock("@/components/ui/color-mode", async () => {
  const actual =
    await vi.importActual<typeof import("@/components/ui/color-mode")>(
      "@/components/ui/color-mode",
    );
  return {
    ...actual,
    useColorMode: () => ({
      colorMode: colorModeRef.current,
      setColorMode: vi.fn(),
      toggleColorMode: toggleColorModeMock,
    }),
  };
});

const { ColorModeToggle } = await import("./ColorModeToggle");

/**
 * The control is a single `role="switch"` whose label advertises the
 * DESTINATION of the toggle, not the current mode — so a screen-reader user
 * hears what pressing it does. `aria-checked` carries the current state.
 */
describe("ColorModeToggle", () => {
  it("announces the destination mode and reports dark as checked", () => {
    colorModeRef.current = "dark";
    renderWithProviders(<ColorModeToggle />);

    const toggle = screen.getByRole("switch", {
      name: commonPtBR.theme.switchToLight,
    });
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("announces the dark destination and reports light as unchecked", () => {
    colorModeRef.current = "light";
    renderWithProviders(<ColorModeToggle />);

    const toggle = screen.getByRole("switch", {
      name: commonPtBR.theme.switchToDark,
    });
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("flips the mode when activated", async () => {
    colorModeRef.current = "light";
    toggleColorModeMock.mockClear();
    renderWithProviders(<ColorModeToggle />);

    await userEvent.click(screen.getByRole("switch"));

    expect(toggleColorModeMock).toHaveBeenCalledTimes(1);
  });
});
