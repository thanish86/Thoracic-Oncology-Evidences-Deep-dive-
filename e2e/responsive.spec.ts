import { expect, test } from "@playwright/test";

for (const route of ["/", "/trials", "/trials/keynote-024", "/nsclc"]) {
  test(`no horizontal page scroll on mobile: ${route}`, async ({ page }) => {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("mobile navigation drawer opens and navigates", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const dialog = page.getByRole("dialog", { name: "Navigation" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { name: "Trial explorer" }).click();
  await expect(page).toHaveURL(/\/trials$/);
  await expect(dialog).toBeHidden();
});
