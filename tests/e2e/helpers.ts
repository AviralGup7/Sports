import { expect, type Page } from "@playwright/test";

export async function expectHealthyPage(page: Page) {
  await expect(page.getByText("Internal Server Error")).toHaveCount(0);
  await expect(page.getByText("Runtime Error")).toHaveCount(0);
}

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const { documentElement } = document;
    return documentElement.scrollWidth - window.innerWidth;
  });

  expect(overflow).toBeLessThanOrEqual(1);
}
