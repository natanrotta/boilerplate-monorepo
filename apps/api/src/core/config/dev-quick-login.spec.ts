import { devQuickLoginHint, isDevQuickLoginEnabled } from "./dev-quick-login";

describe("devQuickLoginHint", () => {
  it("tells a local machine with the flag off how to turn the quick login on", () => {
    const hint = devQuickLoginHint({
      NODE_ENV: "local",
      DEV_QUICK_LOGIN_ENABLED: false,
    });

    expect(hint).toContain("DEV_QUICK_LOGIN_ENABLED=true");
    expect(hint).toContain("apps/api/.env");
  });

  it("says nothing when the quick login is already on", () => {
    expect(
      devQuickLoginHint({ NODE_ENV: "local", DEV_QUICK_LOGIN_ENABLED: true }),
    ).toBeNull();
  });

  it.each(["development", "staging", "production", "test"])(
    "says nothing with NODE_ENV=%s — the flag would not enable anything there",
    (NODE_ENV) => {
      const config = { NODE_ENV, DEV_QUICK_LOGIN_ENABLED: false };

      expect(devQuickLoginHint(config)).toBeNull();
      expect(isDevQuickLoginEnabled(config)).toBe(false);
    },
  );
});
