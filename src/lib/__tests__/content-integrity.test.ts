// @vitest-environment node
/**
 * The anti-fabrication gate: every curated file must validate, and every
 * number must appear in its verbatim source quote. Runs in CI on every change.
 */
import { describe, expect, it } from "vitest";
import { checkTrialIntegrity, extractNumbers } from "@/lib/content/integrity";
import { loadBiomarkers, loadDrugs, loadTrials } from "@/lib/content/load";
import { trialSchema, type TrialSeed } from "@/lib/content/schema";

const trials = loadTrials();
const biomarkers = loadBiomarkers();
const drugs = loadDrugs();

describe("curated content", () => {
  it("loads without schema errors", () => {
    expect([...trials.errors, ...biomarkers.errors, ...drugs.errors]).toEqual([]);
    expect(trials.items.length).toBeGreaterThan(0);
  });

  it("has no integrity issues (numbers traceable to quotes)", () => {
    const issues = trials.items.flatMap(checkTrialIntegrity);
    expect(issues).toEqual([]);
  });

  it("has unique trial slugs", () => {
    const slugs = trials.items.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("never marks agent-curated records as VERIFIED", () => {
    const bad = trials.items.filter((t) => t.curation.curatedBy.startsWith("agent:") && !t.curation.reviewedBy && t.evidenceStatus === "VERIFIED");
    expect(bad).toEqual([]);
  });

  it("does not ship labelled doses in drug monographs without a source URL", () => {
    for (const d of drugs.items) for (const l of d.labelledDosing) expect(l.sourceUrl).toMatch(/^https:\/\//);
  });

  it("links biomarkers to drugs that exist", () => {
    const drugSlugs = new Set(drugs.items.map((d) => d.slug));
    const missing = biomarkers.items.flatMap((b) => b.drugs.filter((d) => !drugSlugs.has(d)).map((d) => `${b.slug}->${d}`));
    // Missing links are tolerated (seed skips them) but should stay rare.
    expect(missing.length).toBeLessThan(10);
  });

  it("dates no publication after today (2026-10-09)", () => {
    for (const t of trials.items) for (const p of t.publications) if (p.publicationDate) expect(p.publicationDate <= "2026-10-09").toBe(true);
  });
});

const base: TrialSeed = trialSchema.parse(
  JSON.parse(JSON.stringify(trials.items.find((t) => t.slug === "keynote-024"))),
);

describe("integrity checker", () => {
  it("extracts numbers including decimals and thousands separators", () => {
    expect(extractNumbers("HR 0.50; 95% CI, 0.37 to 0.68; n = 1,234")).toEqual([0.5, 95, 0.37, 0.68, 1234]);
    expect(extractNumbers("HR 0·62")).toEqual([0.62]);
  });

  it("flags an effect estimate missing from the quote (fabrication)", () => {
    const t = structuredClone(base);
    t.outcomes[0].effectEstimate = 0.42;
    expect(checkTrialIntegrity(t).some((i) => i.path.includes("effectEstimate"))).toBe(true);
  });

  it("flags an arm value not in the quote", () => {
    const t = structuredClone(base);
    t.outcomes[0].experimentalValue = "median 12.1 months";
    expect(checkTrialIntegrity(t).length).toBeGreaterThan(0);
  });

  it("flags an estimate outside its CI", () => {
    const t = structuredClone(base);
    t.outcomes[0].sourceQuote += " 0.30";
    t.outcomes[0].effectEstimate = 0.3;
    expect(checkTrialIntegrity(t).some((i) => i.message.includes("outside"))).toBe(true);
  });

  it("schema refuses VERIFIED without a human reviewer", () => {
    const raw = JSON.parse(JSON.stringify(base));
    raw.evidenceStatus = "VERIFIED";
    expect(trialSchema.safeParse(raw).success).toBe(false);
    raw.curation.reviewedBy = "Dr Reviewer";
    raw.curation.reviewedAt = "2026-10-09";
    expect(trialSchema.safeParse(raw).success).toBe(true);
  });

  it("schema refuses outcome sources not listed in publications", () => {
    const raw = JSON.parse(JSON.stringify(base));
    raw.outcomes[0].source.pmid = "99999999";
    expect(trialSchema.safeParse(raw).success).toBe(false);
  });

  it("schema refuses doses without a dose source quote", () => {
    const raw = JSON.parse(JSON.stringify(base));
    delete raw.arms[0].doseSourceQuote;
    expect(trialSchema.safeParse(raw).success).toBe(false);
  });
});
