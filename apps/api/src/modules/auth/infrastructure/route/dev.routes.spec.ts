import { Request, Response } from "express";
import { NotFoundError } from "@shared/error";

const env = vi.hoisted(() => ({
  NODE_ENV: "local",
  DEV_QUICK_LOGIN_ENABLED: true,
}));

vi.mock("@core/config", async () => ({
  env,
  ...(await vi.importActual("@core/config/dev-quick-login")),
}));
vi.mock("@core/http/middlewares", () => ({
  validateRequest: () => vi.fn(),
  asyncHandler: (handler: unknown) => handler,
}));
vi.mock("../controller/dev.controller", () => ({
  DevController: class {
    listUsers = vi.fn();
    impersonate = vi.fn();
  },
}));

import { isDevQuickLoginEnabled } from "@core/config/dev-quick-login";
import { localOnlyGuard } from "./dev.routes";

describe("dev routes gate", () => {
  it.each([
    ["local", true, true],
    ["local", false, false],
    ["development", true, false],
    ["staging", true, false],
    ["production", true, false],
    ["test", true, false],
  ])(
    "NODE_ENV=%s + DEV_QUICK_LOGIN_ENABLED=%s → enabled=%s",
    (NODE_ENV, DEV_QUICK_LOGIN_ENABLED, expected) => {
      expect(
        isDevQuickLoginEnabled({ NODE_ENV, DEV_QUICK_LOGIN_ENABLED }),
      ).toBe(expected);
    },
  );

  const requestTo = (
    host?: string,
    remoteAddress = "127.0.0.1",
    ip = remoteAddress,
  ) =>
    ({
      headers: host === undefined ? {} : { host },
      socket: { remoteAddress },
      ip,
    }) as unknown as Request;

  beforeEach(() => {
    env.NODE_ENV = "local";
    env.DEV_QUICK_LOGIN_ENABLED = true;
  });

  it.each(["localhost:3333", "LOCALHOST", "127.0.0.1:3333", "[::1]:3333"])(
    "localOnlyGuard lets a request addressed to %s through on an opted-in local machine",
    (host) => {
      const next = vi.fn();

      localOnlyGuard(requestTo(host), {} as Response, next);

      expect(next).toHaveBeenCalledWith();
    },
  );

  it.each([
    ["a LAN address", "192.168.0.10:3333"],
    ["a rebinding domain", "attacker.example:3333"],
    ["a look-alike", "localhost.attacker.example"],
    ["a missing Host header", undefined],
  ])("localOnlyGuard answers 404 to %s", (_label, host) => {
    const next = vi.fn();

    expect(() => localOnlyGuard(requestTo(host), {} as Response, next)).toThrow(
      NotFoundError,
    );
    expect(next).not.toHaveBeenCalled();
  });

  it.each(["::1", "::ffff:127.0.0.1"])(
    "localOnlyGuard accepts the loopback peer %s",
    (peer) => {
      const next = vi.fn();

      localOnlyGuard(requestTo("localhost:3333", peer), {} as Response, next);

      expect(next).toHaveBeenCalledWith();
    },
  );

  it.each(["192.168.0.10", "172.18.0.1", ""])(
    "localOnlyGuard answers 404 to a peer at '%s' even when it claims Host: localhost",
    (peer) => {
      const next = vi.fn();

      expect(() =>
        localOnlyGuard(requestTo("localhost:3333", peer), {} as Response, next),
      ).toThrow(NotFoundError);
      expect(next).not.toHaveBeenCalled();
    },
  );

  it("localOnlyGuard answers 404 to a LAN client that came through a local proxy (loopback socket, forwarded LAN address)", () => {
    const next = vi.fn();

    expect(() =>
      localOnlyGuard(
        requestTo("localhost:3333", "127.0.0.1", "192.168.0.10"),
        {} as Response,
        next,
      ),
    ).toThrow(NotFoundError);
    expect(next).not.toHaveBeenCalled();
  });

  it("localOnlyGuard answers 404 when the env changes under an already-mounted router", () => {
    const next = vi.fn();
    env.NODE_ENV = "production";

    expect(() =>
      localOnlyGuard(requestTo("localhost:3333"), {} as Response, next),
    ).toThrow(NotFoundError);
    expect(next).not.toHaveBeenCalled();
  });
});
