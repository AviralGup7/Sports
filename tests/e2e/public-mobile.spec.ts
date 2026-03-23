import { expect, test } from "@playwright/test";
import { expectHealthyPage, expectNoHorizontalOverflow } from "./helpers";

test.describe("android public shell", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "android-chrome", "Android-only coverage");
  });

  test("home page keeps hero and dock visible", async ({ page }) => {
    await page.goto("/");
    await expectHealthyPage(page);

    await expect(page.locator(".mobile-dock")).toBeVisible();
    await expect(page.getByRole("link", { name: "View Schedule" }).first()).toBeVisible();
    await expect(page.locator(".broadcast-hero")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("schedule page wraps filters and fixtures safely", async ({ page }) => {
    await page.goto("/schedule");
    await expectHealthyPage(page);

    await expect(page.locator(".filter-rail")).toBeVisible();
    await expect(page.locator(".timeline-group").first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("sport center bracket works with tap-only interaction", async ({ page }) => {
    await page.goto("/sports/cricket?tab=bracket");
    await expectHealthyPage(page);

    await expect(page.locator(".bracket-tree-shell")).toBeVisible();

    const firstNode = page.locator(".bracket-tree-node").first();
    await firstNode.click();

    await expect(page.locator(".bracket-focus-panel")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("match center keeps scoreboard and actions above the dock", async ({ page }) => {
    await page.goto("/matches/cricket-final");
    await expectHealthyPage(page);

    await expect(page.locator(".broadcast-hero")).toBeVisible();
    await expect(page.getByRole("link", { name: /back to cricket/i })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("announcements feed stays readable on narrow android widths", async ({ page }) => {
    await page.goto("/announcements");
    await expectHealthyPage(page);

    await expect(page.locator(".news-bulletin").first()).toBeVisible();
    await expect(page.locator(".mobile-dock")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("standings page stays readable on narrow android widths", async ({ page }) => {
    await page.goto("/standings");
    await expectHealthyPage(page);

    await expect(page.getByRole("heading", { level: 1, name: "Tournament Tables" })).toBeVisible();
    await expect(page.locator(".mobile-dock")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
