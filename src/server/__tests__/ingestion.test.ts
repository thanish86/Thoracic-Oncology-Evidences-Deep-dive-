// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { parsePubMedXml, searchPubMed, fetchPubMedRecords } from "@/server/ingestion/pubmed";
import { politeFetch, resetRateLimiter } from "@/server/ingestion/http";
import { buildDraft, slugFromTitle } from "@/server/ingestion/pipeline";
import { getRegistryStudy, summariseRegistryStudy } from "@/server/ingestion/clinicaltrials";

const xml = fs.readFileSync(path.join(__dirname, "../ingestion/__fixtures__/efetch-sample.xml"), "utf8");

beforeEach(() => resetRateLimiter());

describe("PubMed XML parser", () => {
  const [rec] = parsePubMedXml(xml);
  it("extracts identifiers and bibliographic fields", () => {
    expect(rec.pmid).toBe("10000001");
    expect(rec.doi).toBe("10.9999/synthetic.2020.001");
    expect(rec.title).toBe("Drug X versus Placebo in EXAMPLE-Mutant Test Cancer.");
    expect(rec.journal).toBe("Journal of Synthetic Oncology");
    expect(rec.journalIso).toBe("J Synth Oncol");
    expect(rec.publicationDate).toBe("2020-03-05");
    expect(rec.firstAuthor).toBe("Example A");
  });
  it("keeps the structured abstract verbatim (entities decoded)", () => {
    expect(rec.abstract).toContain("BACKGROUND: Background text & context.");
    expect(rec.abstract).toContain("The hazard ratio was 0.50 (95% CI, 0.40 to 0.60).");
  });
  it("detects registry numbers in the abstract", () => {
    expect(rec.registryIds).toEqual(["NCT00000001"]);
  });
});

describe("polite fetch", () => {
  it("retries on 429 then succeeds", async () => {
    const fetchImpl = vi.fn().mockResolvedValueOnce(new Response("", { status: 429 })).mockResolvedValueOnce(new Response("ok", { status: 200 }));
    const res = await politeFetch("https://example.org/x", { minIntervalMs: 0, fetchImpl, sleep: async () => {} });
    expect(await res.text()).toBe("ok");
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
  it("gives up after the retry budget on persistent 5xx", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response("", { status: 503 }));
    await expect(politeFetch("https://example.org/y", { minIntervalMs: 0, retries: 2, fetchImpl, sleep: async () => {} })).rejects.toThrow(/503/);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });
  it("sends an identifying User-Agent", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response("ok"));
    await politeFetch("https://example.org/z", { minIntervalMs: 0, fetchImpl });
    expect((fetchImpl.mock.calls[0][1] as RequestInit).headers).toMatchObject({ "User-Agent": expect.stringContaining("ONCOATLAS") });
  });
});

describe("E-utilities client (mocked network)", () => {
  it("searches and fetches records", async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.includes("esearch")) return new Response(JSON.stringify({ esearchresult: { count: "1", idlist: ["10000001"] } }));
      return new Response(xml);
    });
    const s = await searchPubMed("example", { fetchImpl });
    expect(s).toEqual({ count: 1, pmids: ["10000001"] });
    expect(fetchImpl.mock.calls[0][0]).toContain("tool=oncoatlas");
    const recs = await fetchPubMedRecords(s.pmids, { fetchImpl });
    expect(recs[0].pmid).toBe("10000001");
  });
  it("rejects non-numeric PMIDs without calling the network", async () => {
    const fetchImpl = vi.fn();
    expect(await fetchPubMedRecords(["abc"], { fetchImpl })).toEqual([]);
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe("ClinicalTrials.gov v2 client (mocked network)", () => {
  it("validates NCT format", async () => {
    await expect(getRegistryStudy("NCT123")).rejects.toThrow(/invalid NCT/);
  });
  it("parses and summarises a study", async () => {
    const body = {
      protocolSection: {
        identificationModule: { nctId: "NCT00000001", acronym: "SYNTH-1", officialTitle: "A Synthetic Study" },
        designModule: { phases: ["PHASE3"], enrollmentInfo: { count: 300, type: "ACTUAL" }, designInfo: { allocation: "RANDOMIZED", maskingInfo: { masking: "NONE" } } },
        outcomesModule: { primaryOutcomes: [{ measure: "Progression-free survival" }] },
      },
    };
    const study = await getRegistryStudy("NCT00000001", { fetchImpl: async () => new Response(JSON.stringify(body)) });
    const s = summariseRegistryStudy(study!);
    expect(s).toMatchObject({ nctId: "NCT00000001", acronym: "SYNTH-1", randomised: true, enrollment: 300, primaryOutcomes: ["Progression-free survival"] });
  });
  it("returns null on 404", async () => {
    expect(await getRegistryStudy("NCT00000002", { fetchImpl: async () => new Response("", { status: 404 }) })).toBeNull();
  });
});

describe("draft builder", () => {
  it("never produces outcome values", () => {
    const [rec] = parsePubMedXml(xml);
    const d = buildDraft(rec, null, "2026-10-09");
    expect(d.outcomes).toEqual([]);
    expect(d._draft).toBe(true);
    expect(d.publications[0]).toMatchObject({ pmid: "10000001", verifiedVia: "PubMed", retrievedAt: "2026-10-09", type: "PRIMARY" });
    expect(d.registryIds).toEqual([{ registry: "ClinicalTrials.gov", id: "NCT00000001" }]);
  });
  it("slugifies titles", () => {
    expect(slugFromTitle("CheckMate 816: Neoadjuvant!")).toBe("checkmate-816-neoadjuvant");
  });
});
