import { expect, test } from "@playwright/test";
import { expectHealthyPage } from "./helpers";

test("renders the public broadcast shell", async ({ page }) => {
  await page.goto("/");
  await expectHealthyPage(page);

  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("link", { name: "View Schedule" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: /champions podium/i })).toBeVisible();
});

test("renders schedule filters and grouped fixtures", async ({ page }) => {
  await page.goto("/schedule");
  await expectHealthyPage(page);

  await expect(page.getByRole("heading", { level: 1, name: "Tournament Schedule" })).toBeVisible();
  await expect(page.getByRole("link", { name: /all sports/i })).toBeVisible();
});

test("renders the announcements newsroom", async ({ page }) => {
  await page.goto("/announcements");
  await expectHealthyPage(page);

  await expect(page.getByRole("heading", { level: 1, name: "Updates & Alerts" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pinned updates" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "All updates" })).toBeVisible();
});
