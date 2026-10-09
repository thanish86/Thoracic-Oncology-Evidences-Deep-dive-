import "server-only";
import { Prisma, type TrialPhase, type TrialResult, type EvidenceStatus } from "@prisma/client";
import { prisma } from "@/server/db";
import type { TrialFilters } from "./filters";

const PHASES = ["I", "I_II", "II", "II_III", "III", "IV", "META", "OBS"] as const;
const RESULTS = ["POSITIVE", "NEGATIVE", "NON_INFERIOR", "MIXED", "PENDING", "DESCRIPTIVE"] as const;
const STATUSES = ["VERIFIED", "PRELIMINARY", "AWAITING_VERIFICATION", "UPDATED_ANALYSIS", "HISTORICAL", "CORRECTED_RETRACTED"] as const;

/** IDs of trials matching a PostgreSQL full-text query (ranked). */
async function fullTextTrialIds(q: string): Promise<string[]> {
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM "ClinicalTrial"
    WHERE oncoatlas_trial_tsv("acronym", "officialTitle", "setting", "clinicalQuestion", "picoPopulation", "picoIntervention")
          @@ websearch_to_tsquery('english', ${q})
       OR "acronym" ILIKE ${"%" + q + "%"}
    ORDER BY ts_rank(oncoatlas_trial_tsv("acronym", "officialTitle", "setting", "clinicalQuestion", "picoPopulation", "picoIntervention"),
                     websearch_to_tsquery('english', ${q})) DESC
    LIMIT 200`;
  return rows.map((r) => r.id);
}

export async function listTrials(f: TrialFilters) {
  const where: Prisma.ClinicalTrialWhereInput = {};
  if (f.disease) where.cancerType = { slug: f.disease };
  if (f.stage) where.stages = { has: f.stage };
  if (f.cls) where.treatmentClasses = { has: f.cls };
  if (f.biomarker) where.biomarkers = { some: { biomarkerSlug: f.biomarker } };
  if (f.phase && (PHASES as readonly string[]).includes(f.phase)) where.phase = f.phase as TrialPhase;
  if (f.result && (RESULTS as readonly string[]).includes(f.result)) where.result = f.result as TrialResult;
  if (f.status && (STATUSES as readonly string[]).includes(f.status)) where.evidenceStatus = f.status as EvidenceStatus;
  if (f.from || f.to) where.yearOfPrimaryPublication = { gte: f.from, lte: f.to };
  if (f.q) where.id = { in: await fullTextTrialIds(f.q) };

  const orderBy: Prisma.ClinicalTrialOrderByWithRelationInput[] =
    f.sort === "acronym" ? [{ acronym: "asc" }] : f.sort === "year-asc" ? [{ yearOfPrimaryPublication: "asc" }] : [{ yearOfPrimaryPublication: "desc" }, { acronym: "asc" }];

  return prisma.clinicalTrial.findMany({
    where,
    orderBy,
    select: {
      slug: true, acronym: true, officialTitle: true, setting: true, stages: true, phase: true, result: true, landmark: true,
      yearOfPrimaryPublication: true, evidenceStatus: true, treatmentClasses: true, subtypes: true,
      cancerType: { select: { slug: true, shortName: true } },
      biomarkers: { select: { biomarkerSlug: true } },
      _count: { select: { publications: true } },
    },
  });
}
export type TrialListItem = Awaited<ReturnType<typeof listTrials>>[number];

export async function getTrialFacets() {
  const trials = await prisma.clinicalTrial.findMany({ select: { stages: true, treatmentClasses: true, biomarkers: { select: { biomarkerSlug: true } }, yearOfPrimaryPublication: true } });
  const uniq = (xs: string[]) => [...new Set(xs)].sort();
  return {
    stages: uniq(trials.flatMap((t) => t.stages)),
    classes: uniq(trials.flatMap((t) => t.treatmentClasses)),
    biomarkers: uniq(trials.flatMap((t) => t.biomarkers.map((b) => b.biomarkerSlug))),
    years: trials.length ? [Math.min(...trials.map((t) => t.yearOfPrimaryPublication)), Math.max(...trials.map((t) => t.yearOfPrimaryPublication))] : null,
  };
}

const trialDetailInclude = {
  cancerType: true,
  design: true,
  arms: { orderBy: { sortOrder: "asc" } },
  publications: { include: { sourceDocument: true }, orderBy: { sourceDocument: { year: "asc" } } },
  endpoints: {
    orderBy: [{ hierarchy: "asc" }, { code: "asc" }],
    include: {
      outcomes: {
        include: { analyses: { include: { sourceDocument: true }, orderBy: { sourceDocument: { year: "asc" } } } },
      },
    },
  },
  safety: { include: { sourceDocument: true } },
  subgroups: { include: { sourceDocument: true } },
  biomarkers: { include: { biomarker: { select: { slug: true, name: true } } } },
  drugs: { include: { drug: { select: { slug: true, name: true } } } },
} satisfies Prisma.ClinicalTrialInclude;

export async function getTrial(slug: string) {
  return prisma.clinicalTrial.findUnique({ where: { slug }, include: trialDetailInclude });
}
export type TrialDetail = NonNullable<Awaited<ReturnType<typeof getTrial>>>;

export async function getTrialsForCompare(slugs: string[]) {
  if (!slugs.length) return [];
  const rows = await prisma.clinicalTrial.findMany({ where: { slug: { in: slugs } }, include: trialDetailInclude });
  return slugs.map((s) => rows.find((r) => r.slug === s)).filter((r): r is TrialDetail => Boolean(r));
}

export async function listTrialOptions() {
  return prisma.clinicalTrial.findMany({
    select: { slug: true, acronym: true, yearOfPrimaryPublication: true, cancerType: { select: { shortName: true } } },
    orderBy: { acronym: "asc" },
  });
}

export async function trialSlugsExisting(slugs: string[]) {
  const rows = await prisma.clinicalTrial.findMany({ where: { slug: { in: slugs } }, select: { slug: true, acronym: true } });
  return new Map(rows.map((r) => [r.slug, r.acronym]));
}
