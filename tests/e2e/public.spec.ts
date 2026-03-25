import { expect, test } from "@playwright/test";
import { expectHealthyPage } from "./helpers";

test("renders the public broadcast shell", async ({ page }) => {
  await page.goto("/");
  await expectHealthyPage(page);

  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("link", { name: "Schedule" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: /key update and context/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /live now and next up/i })).toHaveCount(0);
  await expect(page.getByText("Inter Cultural League").first()).toBeVisible();
  await expect(page.getByText(/Seed data|Live data/).first()).toBeVisible();
  await expect(page.locator("body")).toContainText("GYMG & MedC Grounds | Sponsored by Midtown");
  await expect(page.getByRole("heading", { name: /choose a sport/i })).toHaveCount(0);
});

test("renders schedule filters and grouped fixtures", async ({ page }) => {
  await page.goto("/schedule");
  await expectHealthyPage(page);

  await expect(page.getByRole("heading", { level: 1, name: "Tournament Schedule" })).toBeVisible();
  await expect(page.locator(".filter-rail")).toBeVisible();
  await expect(page.getByRole("link", { name: /all sports/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /what this schedule is showing/i })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /sports on this day/i })).toHaveCount(0);
  await expect(page.getByText("Stage")).toHaveCount(0);
  await expect(page.getByText("Group")).toHaveCount(0);
});

test("renders the announcements newsroom", async ({ page }) => {
  await page.goto("/announcements");
  await expectHealthyPage(page);

  await expect(page.getByRole("heading", { level: 1, name: "Updates & Alerts" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Read this notice first" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "More notices" })).toBeVisible();
});

test("renders standings and team index routes", async ({ page }) => {
  await page.goto("/standings");
  await expectHealthyPage(page);
  await expect(page.getByRole("heading", { level: 1, name: "Tournament Tables" })).toBeVisible();

  await page.goto("/teams");
  await expectHealthyPage(page);
  await expect(page.getByRole("heading", { level: 1, name: "Association Grid" })).toBeVisible();
});

