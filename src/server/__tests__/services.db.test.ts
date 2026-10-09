// @vitest-environment node
/**
 * Database integration tests against the seeded PostgreSQL database.
 * Skipped automatically when DATABASE_URL is not set.
 */
import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "@/server/db";
import { listTrials, getTrial, getTrialsForCompare } from "@/server/services/trials";
import { globalSearch } from "@/server/services/search";
import { getTimeline, getBiomarker } from "@/server/services/catalog";
import { trialFilterSchema } from "@/server/services/filters";

const run = process.env.DATABASE_URL ? describe : describe.skip;

run("services (seeded database)", () => {
  afterAll(() => prisma.$disconnect());

  it("every outcome analysis links to a source document and quote", async () => {
    const orphan = await prisma.trialOutcomeAnalysis.count({ where: { OR: [{ sourceQuote: "" }] } });
    expect(orphan).toBe(0);
    const total = await prisma.trialOutcomeAnalysis.count();
    const withSource = await prisma.trialOutcomeAnalysis.count({ where: { sourceDocument: { OR: [{ pmid: { not: null } }, { doi: { not: null } }] } } });
    expect(withSource).toBe(total);
  });

  it("filters trials by disease and biomarker", async () => {
    const nsclc = await listTrials(trialFilterSchema.parse({ disease: "nsclc" }));
    expect(nsclc.length).toBeGreaterThan(0);
    expect(nsclc.every((t) => t.cancerType.slug === "nsclc")).toBe(true);
    const egfr = await listTrials(trialFilterSchema.parse({ biomarker: "egfr" }));
    expect(egfr.every((t) => t.biomarkers.some((b) => b.biomarkerSlug === "egfr"))).toBe(true);
  });

  it("full-text search finds a trial by acronym and by concept", async () => {
    const byAcronym = await listTrials(trialFilterSchema.parse({ q: "KEYNOTE-024" }));
    expect(byAcronym.map((t) => t.slug)).toContain("keynote-024");
    const byConcept = await listTrials(trialFilterSchema.parse({ q: "pembrolizumab" }));
    expect(byConcept.length).toBeGreaterThan(0);
  });

  it("ignores invalid filter values instead of failing", () => {
    expect(trialFilterSchema.parse({ disease: "pancreas", from: "1800" })).toMatchObject({ disease: undefined, from: undefined });
  });

  it("returns a complete trial dossier", async () => {
    const t = await getTrial("keynote-024");
    expect(t?.acronym).toBe("KEYNOTE-024");
    expect(t?.publications.length).toBeGreaterThan(0);
    const pfs = t?.endpoints.find((e) => e.code === "PFS");
    expect(pfs?.outcomes[0].analyses[0]).toMatchObject({ effectMeasure: "HR", effectEstimate: 0.5, ciLower: 0.37, ciUpper: 0.68 });
  });

  it("preserves the order of compared trials and drops unknown slugs", async () => {
    const rows = await getTrialsForCompare(["keynote-189", "does-not-exist", "keynote-024"]);
    expect(rows.map((r) => r.slug)).toEqual(["keynote-189", "keynote-024"]);
  });

  it("global search spans trials, biomarkers and drugs", async () => {
    const hits = await globalSearch("osimertinib");
    const types = new Set(hits.map((h) => h.type));
    expect(types.has("drug")).toBe(true);
    expect(types.has("trial")).toBe(true);
  });

  it("timeline filters by disease and year", async () => {
    const ev = await getTimeline({ disease: "sclc", from: 2018, to: 2026 } as never);
    expect(ev.every((e) => e.cancerType.slug === "sclc" && e.year >= 2018)).toBe(true);
  });

  it("biomarker pages link trials", async () => {
    const b = await getBiomarker("egfr");
    expect(b?.trials.length).toBeGreaterThan(0);
  });
});
