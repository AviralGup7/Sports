import { expect, test } from "@playwright/test";

test("renders the public broadcast shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("link", { name: /enter live schedule/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /champions podium/i })).toBeVisible();
});

test("renders schedule filters and grouped fixtures", async ({ page }) => {
  await page.goto("/schedule");

  await expect(page.getByRole("heading", { name: /match schedule|schedule/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /all sports/i })).toBeVisible();
});

test("renders the announcements newsroom", async ({ page }) => {
  await page.goto("/announcements");

  await expect(page.getByRole("heading", { name: /announcements/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /latest calls/i })).toBeVisible();
});
