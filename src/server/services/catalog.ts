import "server-only";
import type { Prisma, TimelineEventType } from "@prisma/client";
import { prisma } from "@/server/db";
import type { TimelineFilters } from "./filters";

export async function getDashboardStats() {
  const [trials, analyses, sources, biomarkers, drugs, verifiedAnalyses, awaiting, perDisease] = await Promise.all([
    prisma.clinicalTrial.count(),
    prisma.trialOutcomeAnalysis.count(),
    prisma.sourceDocument.count(),
    prisma.biomarker.count(),
    prisma.drug.count(),
    prisma.trialOutcomeAnalysis.count({ where: { status: "VERIFIED" } }),
    prisma.trialOutcomeAnalysis.count({ where: { status: "AWAITING_VERIFICATION" } }),
    prisma.cancerType.findMany({ orderBy: { sortOrder: "asc" }, select: { slug: true, shortName: true, _count: { select: { trials: true } } } }),
  ]);
  return { trials, analyses, sources, biomarkers, drugs, verifiedAnalyses, awaiting, perDisease };
}

export async function getRecentlyCurated(limit = 6) {
  return prisma.clinicalTrial.findMany({
    orderBy: [{ updatedAt: "desc" }, { yearOfPrimaryPublication: "desc" }],
    take: limit,
    select: { slug: true, acronym: true, setting: true, yearOfPrimaryPublication: true, evidenceStatus: true, cancerType: { select: { shortName: true, slug: true } } },
  });
}

export async function getLatestPublications(limit = 6) {
  return prisma.clinicalTrial.findMany({
    orderBy: [{ yearOfPrimaryPublication: "desc" }, { acronym: "asc" }],
    take: limit,
    select: { slug: true, acronym: true, setting: true, yearOfPrimaryPublication: true, evidenceStatus: true, cancerType: { select: { shortName: true, slug: true } } },
  });
}

const EVENT_TYPES: TimelineEventType[] = [
  "LANDMARK_TRIAL", "NEGATIVE_TRIAL", "PRACTICE_CHANGE", "MOLECULAR_BREAKTHROUGH", "RADIATION_MILESTONE", "SURGERY_MILESTONE", "GUIDELINE_UPDATE", "DRUG_APPROVAL",
];

export async function getTimeline(f: TimelineFilters) {
  const where: Prisma.EvidenceTimelineEventWhereInput = {};
  if (f.disease) where.cancerType = { slug: f.disease };
  if (f.type && (EVENT_TYPES as string[]).includes(f.type)) where.type = f.type as TimelineEventType;
  if (f.biomarker) where.biomarkers = { has: f.biomarker };
  if (f.cls) where.treatmentClasses = { has: f.cls };
  if (f.stage) where.stages = { has: f.stage };
  if (f.from || f.to) where.year = { gte: f.from, lte: f.to };
  return prisma.evidenceTimelineEvent.findMany({
    where,
    orderBy: [{ date: "asc" }, { title: "asc" }],
    include: { cancerType: { select: { slug: true, shortName: true } }, trial: { select: { slug: true, result: true } } },
  });
}

export async function getDisease(slug: string) {
  return prisma.cancerType.findUnique({
    where: { slug },
    include: {
      subtypes: true,
      histologies: true,
      stageSystems: { include: { versions: true } },
      biomarkers: { include: { biomarker: { select: { slug: true, name: true, category: true } } } },
      trials: {
        orderBy: [{ yearOfPrimaryPublication: "desc" }],
        select: {
          slug: true, acronym: true, officialTitle: true, setting: true, stages: true, phase: true, result: true, landmark: true,
          yearOfPrimaryPublication: true, evidenceStatus: true, treatmentClasses: true, subtypes: true,
          cancerType: { select: { slug: true, shortName: true } }, biomarkers: { select: { biomarkerSlug: true } },
          _count: { select: { publications: true } },
        },
      },
    },
  });
}

export async function listBiomarkers() {
  return prisma.biomarker.findMany({
    orderBy: { name: "asc" },
    include: { pathway: true, cancers: { include: { cancerType: { select: { slug: true, shortName: true } } } }, _count: { select: { trials: true, drugs: true } } },
  });
}

export async function getBiomarker(slug: string) {
  return prisma.biomarker.findUnique({
    where: { slug },
    include: {
      pathway: true,
      cancers: { include: { cancerType: { select: { slug: true, shortName: true } } } },
      drugs: { include: { drug: { select: { slug: true, name: true, drugClass: true } } } },
      trials: {
        include: {
          trial: { select: { slug: true, acronym: true, setting: true, yearOfPrimaryPublication: true, result: true, evidenceStatus: true, cancerType: { select: { shortName: true } } } },
        },
      },
    },
  });
}

export async function listDrugs() {
  return prisma.drug.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { trials: true, biomarkers: true } } } });
}

export async function getDrug(slug: string) {
  return prisma.drug.findUnique({
    where: { slug },
    include: {
      indications: { include: { sourceDocument: true, decisions: true } },
      biomarkers: { include: { biomarker: { select: { slug: true, name: true } } } },
      trials: {
        include: {
          trial: {
            select: {
              slug: true, acronym: true, setting: true, yearOfPrimaryPublication: true, result: true, evidenceStatus: true,
              cancerType: { select: { shortName: true } },
              arms: { select: { label: true, role: true, regimen: true, dosing: true, doseSourceQuote: true } },
            },
          },
        },
      },
    },
  });
}

export async function listTrialsByClass(cls: string) {
  return prisma.clinicalTrial.findMany({
    where: { treatmentClasses: { has: cls } },
    orderBy: { yearOfPrimaryPublication: "asc" },
    select: {
      slug: true, acronym: true, officialTitle: true, setting: true, stages: true, phase: true, result: true, landmark: true,
      yearOfPrimaryPublication: true, evidenceStatus: true, treatmentClasses: true, subtypes: true,
      cancerType: { select: { slug: true, shortName: true } }, biomarkers: { select: { biomarkerSlug: true } },
      _count: { select: { publications: true } },
    },
  });
}

export async function getVerificationQueue() {
  const [analyses, safety, trials, history] = await Promise.all([
    prisma.trialOutcomeAnalysis.findMany({
      where: { status: { in: ["AWAITING_VERIFICATION", "PRELIMINARY"] } },
      take: 100,
      orderBy: { createdAt: "asc" },
      include: {
        sourceDocument: { select: { pmid: true, doi: true, title: true, journal: true, year: true } },
        outcome: { include: { endpoint: { include: { trial: { select: { slug: true, acronym: true } } } } } },
      },
    }),
    prisma.trialSafety.count({ where: { status: "AWAITING_VERIFICATION" } }),
    prisma.clinicalTrial.groupBy({ by: ["evidenceStatus"], _count: true }),
    prisma.verificationRecord.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { reviewer: { select: { name: true, email: true } } } }),
  ]);
  return { analyses, safetyAwaiting: safety, trialStatus: trials, history };
}

export async function listQuizQuestions() {
  return prisma.quizQuestion.findMany({ orderBy: { topic: "asc" } });
}
