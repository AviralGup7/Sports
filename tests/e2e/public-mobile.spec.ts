import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const { documentElement } = document;
    return documentElement.scrollWidth - window.innerWidth;
  });

  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe("android public shell", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "android-chrome", "Android-only coverage");
  });

  test("home page keeps hero and dock visible", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".mobile-dock")).toBeVisible();
    await expect(page.getByRole("link", { name: /enter live schedule/i })).toBeVisible();
    await expect(page.locator(".broadcast-hero")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("schedule page wraps filters and fixtures safely", async ({ page }) => {
    await page.goto("/schedule");

    await expect(page.locator(".filter-rail")).toBeVisible();
    await expect(page.locator(".timeline-group").first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("sport center bracket works with tap-only interaction", async ({ page }) => {
    await page.goto("/sports/cricket?tab=bracket");

    await expect(page.locator(".bracket-tree-shell")).toBeVisible();

    const firstNode = page.locator(".bracket-tree-node").first();
    await firstNode.click();

    await expect(page.locator(".bracket-focus-panel")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("match center keeps scoreboard and actions above the dock", async ({ page }) => {
    await page.goto("/matches/cricket-final");

    await expect(page.locator(".broadcast-hero")).toBeVisible();
    await expect(page.getByRole("link", { name: /back to cricket/i })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("announcements feed stays readable on narrow android widths", async ({ page }) => {
    await page.goto("/announcements");

    await expect(page.locator(".news-bulletin").first()).toBeVisible();
    await expect(page.locator(".mobile-dock")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
