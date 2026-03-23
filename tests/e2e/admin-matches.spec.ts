import { expect, test } from "@playwright/test";

import { expectHealthyPage, loginAsAdmin } from "./helpers";

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

test.describe("admin matches", () => {
  test("supports mode switching for organizer workflows", async ({ page }) => {
    test.skip(!adminEmail || !adminPassword, "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to exercise authenticated admin flows.");

    await loginAsAdmin(page, adminEmail ?? "", adminPassword ?? "");
    await page.goto("/admin/matches?mode=live");
    await expectHealthyPage(page);

    await expect(page.getByRole("heading", { name: /run fixtures without the clutter/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Setup" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Live" })).toHaveClass(/chip-active/);

    await page.getByRole("link", { name: "Bracket" }).click();
    await expect(page).toHaveURL(/mode=tree/);
    await expect(page.getByText("Bracket Manager").first()).toBeVisible();
  });

  test("keeps admin match filters and live desk usable", async ({ page }) => {
    test.skip(!adminEmail || !adminPassword, "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to exercise authenticated admin flows.");

    await loginAsAdmin(page, adminEmail ?? "", adminPassword ?? "");
    await page.goto("/admin/matches?mode=live");
    await expectHealthyPage(page);

    await expect(page.getByText("Sport").first()).toBeVisible();
    await expect(page.getByText("Status").first()).toBeVisible();
    await expect(page.getByText("Day").first()).toBeVisible();
    await expect(page.getByText("Advanced Tools")).toBeVisible();
  });
});
