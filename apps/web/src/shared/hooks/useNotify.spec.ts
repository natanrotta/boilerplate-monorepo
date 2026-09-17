import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { ErrorCodes } from "@boilerplate/shared-types";
import { AppError } from "@/core/errors/AppError";
import commonPtBR from "@/shared/i18n/locales/pt-BR/common.json";

const createMock = vi.fn();
const isVisibleMock = vi.fn((_id: string) => false);

// Stub the toaster store, not the hook: the contract under test is exactly what
// `useNotify` hands to it (type, title, description, duration, dedupe id).
vi.mock("@/components/ui/toaster", () => ({
  toaster: {
    create: (options: unknown) => createMock(options),
    isVisible: (id: string) => isVisibleMock(id),
  },
}));

const { useNotify } = await import("@/shared/hooks/useNotify");

function lastDescription(): unknown {
  const options = createMock.mock.lastCall?.[0] as { description?: unknown } | undefined;
  return options?.description;
}

describe("useNotify", () => {
  beforeEach(() => {
    createMock.mockClear();
    isVisibleMock.mockReset();
    isVisibleMock.mockReturnValue(false);
  });

  it("publishes a success toast", () => {
    const { result } = renderHook(() => useNotify());
    result.current.showSuccess("Salvo");

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success", title: "Salvo", duration: 2500 }),
    );
  });

  it("publishes info and warning toasts with their own durations", () => {
    const { result } = renderHook(() => useNotify());
    result.current.showInfo("Info");
    result.current.showWarning("Cuidado");

    expect(createMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: "info", title: "Info", duration: 2500 }),
    );
    expect(createMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ type: "warning", title: "Cuidado", duration: 3000 }),
    );
  });

  it("uses the localized default title for the auto-save toast", () => {
    const { result } = renderHook(() => useNotify());
    result.current.showAutoSaved();

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: "info", title: commonPtBR.notify.autoSaved }),
    );
  });

  it("surfaces an AppError message as the toast description", () => {
    const { result } = renderHook(() => useNotify());
    result.current.showError(new AppError("Registro não encontrado"));

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        title: commonPtBR.notify.errorTitle,
        description: "Registro não encontrado",
      }),
    );
  });

  it("flattens VALIDATION_ERROR field details into one readable line", () => {
    const { result } = renderHook(() => useNotify());
    result.current.showError(
      new AppError("inválido", ErrorCodes.VALIDATION_ERROR, 422, {
        name: ["Nome é obrigatório"],
        phone: ["Telefone inválido"],
      }),
    );

    expect(lastDescription()).toBe("Nome é obrigatório. Telefone inválido");
  });

  it("keeps the error message when the validation details carry no field errors", () => {
    const { result } = renderHook(() => useNotify());
    result.current.showError(new AppError("inválido", ErrorCodes.VALIDATION_ERROR, 422, {}));

    expect(lastDescription()).toBe("inválido");
  });

  it("surfaces a plain Error message", () => {
    const { result } = renderHook(() => useNotify());
    result.current.showError(new Error("falha de rede"));

    expect(lastDescription()).toBe("falha de rede");
  });

  it("falls back to the localized default error for a non-error value", () => {
    const { result } = renderHook(() => useNotify());
    result.current.showError(undefined);

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        title: commonPtBR.notify.errorTitle,
        description: commonPtBR.notify.defaultError,
      }),
    );
  });

  it("does not stack a duplicate error toast that is still on screen", () => {
    isVisibleMock.mockReturnValue(true);
    const { result } = renderHook(() => useNotify());

    result.current.showError(new AppError("mesma falha"));

    expect(createMock).not.toHaveBeenCalled();
  });

  it("keys the dedupe id on the message, truncated so it stays bounded", () => {
    const longMessage = "x".repeat(200);
    const { result } = renderHook(() => useNotify());

    result.current.showError(new AppError(longMessage));

    expect(isVisibleMock).toHaveBeenCalledWith(`error:${"x".repeat(80)}`);
  });
});
