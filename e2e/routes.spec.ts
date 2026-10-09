import { expect, test } from "@playwright/test";

const ROUTES = [
  "/", "/dashboard", "/breast", "/nsclc", "/sclc", "/thymoma", "/mesothelioma", "/trials", "/trials/keynote-024", "/trials/compare",
  "/timeline", "/biomarkers", "/biomarkers/egfr", "/drugs", "/drugs/osimertinib", "/algorithms", "/pathology", "/radiation", "/surgery",
  "/guidelines", "/regulatory", "/statistics", "/exams", "/tumour-board", "/notebook", "/bookmarks", "/admin/evidence",
];

for (const route of ROUTES) {
  test(`renders ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const res = await page.goto(route);
    expect(res?.status(), route).toBe(200);
    await expect(page.locator("main h1").first()).toBeVisible();
    expect(errors, `uncaught errors on ${route}`).toEqual([]);
  });
}

test("unknown trial returns 404", async ({ page }) => {
  const res = await page.goto("/trials/not-a-real-trial");
  expect(res?.status()).toBe(404);
  await expect(page.getByText("Trial not found")).toBeVisible();
});
