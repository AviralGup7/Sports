import { expect, test } from "@playwright/test";

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

test("renders the admin login screen", async ({ page }) => {
  await page.goto("/admin/login");

  await expect(page.getByRole("heading", { name: /backstage access/i })).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});

test("allows an organizer login when credentials are provided", async ({ page }) => {
  test.skip(!adminEmail || !adminPassword, "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to exercise authenticated admin flows.");

  await page.goto("/admin/login");
  await page.getByLabel(/email/i).fill(adminEmail ?? "");
  await page.getByLabel(/password/i).fill(adminPassword ?? "");
  await page.getByRole("button", { name: /sign in to control room/i }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: /control room focus/i })).toBeVisible();
});
