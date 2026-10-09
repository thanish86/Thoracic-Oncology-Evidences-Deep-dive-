import { expect, test } from "@playwright/test";

test.describe("trial deep-dive", () => {
  test("shows eleven tabs and sourced efficacy values", async ({ page }) => {
    await page.goto("/trials/keynote-024");
    await expect(page.getByRole("heading", { level: 1, name: "KEYNOTE-024" })).toBeVisible();
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(11);
    await page.getByRole("tab", { name: /Efficacy/ }).click();
    await expect(page).toHaveURL(/#efficacy$/);
    const panel = page.getByRole("tabpanel");
    await expect(panel.getByText("HR 0.5 (95% CI 0.37–0.68)")).toBeVisible();
    await expect(panel.getByRole("link", { name: /PMID 27718847/ }).first()).toHaveAttribute("href", "https://pubmed.ncbi.nlm.nih.gov/27718847/");
    await panel.getByText("Source quote").first().click();
    await expect(panel.getByText(/hazard ratio for disease progression or death, 0.50/)).toBeVisible();
  });

  test("tabs are keyboard navigable and deep-linkable", async ({ page }) => {
    await page.goto("/trials/keynote-024#references");
    await expect(page.getByRole("tab", { name: /References/ })).toHaveAttribute("aria-selected", "true");
    await page.getByRole("tab", { name: /References/ }).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByRole("tab", { name: /Clinical implications/ })).toBeFocused();
  });

  test("bookmark persists to the bookmarks page", async ({ page }) => {
    await page.goto("/trials/keynote-024");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByRole("button", { name: "Saved" })).toBeVisible();
    await page.goto("/bookmarks");
    await expect(page.getByRole("link", { name: "KEYNOTE-024" })).toBeVisible();
  });
});

test("trial explorer filters by disease via URL", async ({ page }) => {
  await page.goto("/trials?disease=mesothelioma");
  await expect(page.getByRole("link", { name: /CheckMate 743/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "KEYNOTE-024" })).toHaveCount(0);
});

test("compare engine flags indirect comparisons", async ({ page }) => {
  await page.goto("/trials/compare?ids=keynote-024,checkmate-743");
  const region = page.getByRole("region", { name: "Comparability warnings" });
  await expect(region.getByText(/indirect/)).toBeVisible();
  await expect(region.getByText(/Different diseases/)).toBeVisible();
});

test("command search finds a drug", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  await page.getByPlaceholder(/Search KEYNOTE-024/).fill("osimertinib");
  const option = page.getByRole("option", { name: /Osimertinib/i }).first();
  await expect(option).toBeVisible();
  await option.click();
  await expect(page).toHaveURL(/\/drugs\/osimertinib$/);
});

test("references export returns RIS", async ({ request }) => {
  const res = await request.get("/api/references?format=ris&slugs=keynote-024");
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain("DO  - 10.1056/NEJMoa1606774");
});
