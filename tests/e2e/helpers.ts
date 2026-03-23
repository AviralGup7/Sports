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

export async function loginAsAdmin(page: Page, email: string, password: string) {
  await page.goto("/admin/login");
  await expectHealthyPage(page);
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in to control room/i }).click();
  await expect(page).toHaveURL(/\/admin$/);
}
