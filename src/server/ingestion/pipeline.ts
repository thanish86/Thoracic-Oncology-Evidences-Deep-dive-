/**
 * Evidence ingestion pipeline:
 *   Discovery → Registry matching → Bibliographic metadata → Source retrieval
 *   → Structured extraction (draft) → Verification queue → Human approval
 *   → Publication → Revalidation.
 *
 * Automated stages stop at a DRAFT: the pipeline never writes efficacy numbers
 * into published content. A curator completes extraction in a draft JSON file
 * (verbatim quotes required), `content:validate` enforces integrity, and a
 * human reviewer approves values in /admin/evidence.
 */
import type { PrismaClient } from "@prisma/client";
import { fetchPubMedRecords, searchPubMed, type PubMedRecord } from "./pubmed";
import { getRegistryStudy, summariseRegistryStudy } from "./clinicaltrials";
import type { FetchLike } from "./http";

export interface DraftTrial {
  _draft: true;
  _instructions: string;
  slug: string;
  officialTitle: string;
  registryIds: { registry: "ClinicalTrials.gov"; id: string }[];
  publications: {
    pmid: string;
    doi?: string;
    title: string;
    journal: string;
    year?: number;
    publicationDate?: string;
    firstAuthor?: string;
    type: "PRIMARY";
    verifiedVia: "PubMed";
    retrievedAt: string;
  }[];
  registry?: ReturnType<typeof summariseRegistryStudy>;
  abstract: string;
  outcomes: [];
}

export function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .split("-")
    .slice(0, 6)
    .join("-");
}

/** Build a draft content record from retrieved metadata — no outcome values are generated. */
export function buildDraft(rec: PubMedRecord, registry: ReturnType<typeof summariseRegistryStudy> | null, today = new Date().toISOString().slice(0, 10)): DraftTrial {
  return {
    _draft: true,
    _instructions:
      "Complete per content/CURATION_GUIDE.md: set acronym, disease, stages, setting, PICO, arms; add outcomes ONLY with verbatim sourceQuote from the abstract below. Remove _draft/_instructions/abstract/registry before moving to content/trials/<disease>/.",
    slug: registry?.acronym ? slugFromTitle(registry.acronym) : slugFromTitle(rec.title),
    officialTitle: registry?.officialTitle ?? rec.title,
    registryIds: (registry ? [registry.nctId] : rec.registryIds).map((id) => ({ registry: "ClinicalTrials.gov" as const, id })),
    publications: [
      {
        pmid: rec.pmid,
        doi: rec.doi,
        title: rec.title,
        journal: rec.journalIso ?? rec.journal,
        year: rec.year,
        publicationDate: rec.publicationDate,
        firstAuthor: rec.firstAuthor,
        type: "PRIMARY",
        verifiedVia: "PubMed",
        retrievedAt: today,
      },
    ],
    registry: registry ?? undefined,
    abstract: rec.abstract,
    outcomes: [],
  };
}

export interface RunOptions {
  query: string;
  retmax?: number;
  fetchImpl?: FetchLike;
  log?: (msg: string) => void;
}

/** Discover + enrich. Persists IngestionJob rows and returns draft records. */
export async function runDiscovery(prisma: PrismaClient, { query, retmax = 10, fetchImpl, log = () => {} }: RunOptions): Promise<DraftTrial[]> {
  const { pmids, count } = await searchPubMed(query, { retmax, fetchImpl });
  log(`PubMed: ${count} hits, processing ${pmids.length}`);
  for (const pmid of pmids) {
    await prisma.ingestionJob.upsert({
      where: { source_externalId: { source: "pubmed", externalId: pmid } },
      create: { source: "pubmed", externalId: pmid, query, stage: "DISCOVERED" },
      update: {},
    });
  }
  const records = await fetchPubMedRecords(pmids, { fetchImpl });
  const drafts: DraftTrial[] = [];
  for (const rec of records) {
    let registry: ReturnType<typeof summariseRegistryStudy> | null = null;
    const nct = rec.registryIds[0];
    try {
      if (nct) {
        const study = await getRegistryStudy(nct, { fetchImpl });
        registry = study ? summariseRegistryStudy(study) : null;
      }
      const draft = buildDraft(rec, registry);
      drafts.push(draft);
      await prisma.ingestionJob.update({
        where: { source_externalId: { source: "pubmed", externalId: rec.pmid } },
        data: { stage: registry ? "REGISTRY_MATCHED" : "METADATA_RETRIEVED", payload: JSON.parse(JSON.stringify(draft)), attempts: { increment: 1 }, error: null },
      });
      log(`  ${rec.pmid} ${registry ? `↔ ${registry.nctId}` : "(no registry match)"} — ${rec.title.slice(0, 80)}`);
    } catch (e) {
      await prisma.ingestionJob.update({
        where: { source_externalId: { source: "pubmed", externalId: rec.pmid } },
        data: { error: e instanceof Error ? e.message : String(e), attempts: { increment: 1 } },
      });
      log(`  ${rec.pmid} failed: ${e instanceof Error ? e.message : e}`);
    }
  }
  return drafts;
}
