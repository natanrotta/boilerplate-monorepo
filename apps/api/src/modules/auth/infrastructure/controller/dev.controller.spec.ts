import { Request, Response } from "express";
import { container } from "tsyringe";
import { DevController } from "./dev.controller";
import {
  setAccessTokenCookie,
  setAuthCookies,
} from "@core/http/helpers/auth-cookies";

const mockExecute = vi.fn();

vi.mock("@core/http/helpers/auth-cookies", () => ({
  setAuthCookies: vi.fn(),
  setAccessTokenCookie: vi.fn(),
}));

vi.mock("@core/http/logger", () => ({
  logger: { warn: vi.fn() },
}));

vi.mock("tsyringe", async (importOriginal) => ({
  ...((await importOriginal()) as any),
  container: {
    resolve: vi.fn(() => ({ execute: mockExecute })),
  },
}));

function mockReqRes(body: unknown = {}) {
  const req = { body, ip: "127.0.0.1" } as unknown as Request;
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  const res = { status, json } as unknown as Response;
  return { req, res, status, json };
}

describe("DevController", () => {
  const sut = new DevController();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(container.resolve).mockImplementation(
      () => ({ execute: mockExecute }) as never,
    );
  });

  it("listUsers returns 200 with the users", async () => {
    mockExecute.mockResolvedValue([{ id: "u1" }]);
    const { req, res, status, json } = mockReqRes();

    await sut.listUsers(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ ok: true, data: [{ id: "u1" }] });
  });

  it("impersonate sets the session cookies and never echoes the refresh token", async () => {
    mockExecute.mockResolvedValue({
      user: { id: "u1" },
      token: "t",
      refreshToken: "rt",
    });
    const { req, res, status, json } = mockReqRes({ userId: "u1" });

    await sut.impersonate(req, res);

    expect(mockExecute).toHaveBeenCalledWith("u1");
    expect(setAuthCookies).toHaveBeenCalledWith(res, "rt", expect.any(String));
    expect(setAccessTokenCookie).toHaveBeenCalledWith(res, "t");
    expect(status).toHaveBeenCalledWith(200);
    const payload = json.mock.calls[0]![0];
    expect(payload).toMatchObject({
      ok: true,
      data: { user: { id: "u1" }, token: "t" },
    });
    expect(payload.data).not.toHaveProperty("refreshToken");
  });
});
