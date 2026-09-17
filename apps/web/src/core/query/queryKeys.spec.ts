import { describe, expect, it } from "vitest";
import { queryKeys } from "./queryKeys";

describe("queryKeys", () => {
  describe("hierarchy", () => {
    it("nests narrow keys under the entity's `all` root", () => {
      expect(queryKeys.auth.me()[0]).toBe("auth");
      expect(queryKeys.health.version()[0]).toBe("health");
    });
  });

  describe("auth namespace", () => {
    it("exposes me() under the auth root for invalidation factories", () => {
      expect(queryKeys.auth.me()).toEqual(["auth", "me"]);
      expect(queryKeys.auth.all).toEqual(["auth"]);
    });
  });

  describe("health namespace", () => {
    it("nests version() under the health root", () => {
      expect(queryKeys.health.version()).toEqual(["health", "version"]);
      expect(queryKeys.health.all).toEqual(["health"]);
    });
  });

  it("returns readonly tuples (compile-time guard)", () => {
    // Runtime check: the array must be a real array (the `as const` is a TS-only narrowing).
    const list = queryKeys.auth.me();
    expect(Array.isArray(list)).toBe(true);
  });
});
