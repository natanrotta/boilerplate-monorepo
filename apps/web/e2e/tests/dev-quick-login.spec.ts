import { test, expect } from "../fixtures/auth.fixture";
import { DEMO_USER } from "../fixtures/constants";

/**
 * The dev-only quick login on the sign-in page: one click on a seeded user
 * mints a real session, no password typed. The E2E API runs with
 * NODE_ENV=local + DEV_QUICK_LOGIN_ENABLED=true (`apps/api/.env.e2e.example`),
 * the only combination under which `/api/dev/*` exists.
 */
test.describe("dev quick login", () => {
  test("signs in as a seeded user with one click and survives a reload", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto("/sign-in");

    await page.getByTestId("dev-quick-login-trigger").click();
    await page
      .getByTestId("dev-quick-login-user")
      .filter({ hasText: DEMO_USER.email })
      .click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });

    await page.reload();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });
});
