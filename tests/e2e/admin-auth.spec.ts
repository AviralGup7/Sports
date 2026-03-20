import { expect, test } from "@playwright/test";
import { expectHealthyPage } from "./helpers";

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

test("renders the admin login screen", async ({ page }) => {
  await page.goto("/admin/login");
  await expectHealthyPage(page);

  await expect(page.getByRole("heading", { name: /backstage access/i })).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});

test("keeps the admin login usable on android-sized screens", async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 915 });
  await page.goto("/admin/login");
  await expectHealthyPage(page);

  await expect(page.getByRole("heading", { name: /backstage access/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /sign in to control room/i })).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("allows an organizer login when credentials are provided", async ({ page }) => {
  test.skip(!adminEmail || !adminPassword, "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to exercise authenticated admin flows.");

  await page.goto("/admin/login");
  await expectHealthyPage(page);
  await page.getByLabel(/email/i).fill(adminEmail ?? "");
  await page.getByLabel(/password/i).fill(adminPassword ?? "");
  await page.getByRole("button", { name: /sign in to control room/i }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: /organizer deck/i })).toBeVisible();
});
