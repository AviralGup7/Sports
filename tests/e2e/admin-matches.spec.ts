import { expect, test } from "@playwright/test";

import { expectHealthyPage, loginAsAdmin } from "./helpers";

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

test.describe("admin matches", () => {
  test("defaults to the live desk workflow", async ({ page }) => {
    test.skip(!adminEmail || !adminPassword, "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to exercise authenticated admin flows.");

    await loginAsAdmin(page, adminEmail ?? "", adminPassword ?? "");
    await page.goto("/admin/matches");
    await expectHealthyPage(page);

    await expect(page.getByRole("heading", { name: "Live Desk" })).toBeVisible();
    await expect(page.getByText("Sport").first()).toBeVisible();
    await expect(page.getByText("Status").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /save result/i }).first()).toBeVisible();
  });

  test("keeps old mode-specific controls out of the primary admin screen", async ({ page }) => {
    test.skip(!adminEmail || !adminPassword, "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to exercise authenticated admin flows.");

    await loginAsAdmin(page, adminEmail ?? "", adminPassword ?? "");
    await page.goto("/admin/matches");
    await expectHealthyPage(page);

    await expect(page.getByRole("link", { name: "Setup" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Bracket" })).toHaveCount(0);
    await expect(page.getByText("Advanced Tools")).toHaveCount(0);
    await expect(page.getByText("Operator Guide")).toHaveCount(0);
  });
});
