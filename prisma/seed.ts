/**
 * Seed PostgreSQL from version-controlled curated content (/content).
 * Content is validated (schema + integrity) first; the seed aborts on any error.
 * Idempotent: evidence tables are rebuilt; workspace tables (users, bookmarks,
 * notebooks) are left untouched.
 */
import { PrismaClient, type Prisma, type TimelineEventType, type TrialPhase } from "@prisma/client";
import { checkTrialIntegrity } from "../src/lib/content/integrity";
import { loadBiomarkers, loadDrugs, loadTrials } from "../src/lib/content/load";
import type { TrialSeed } from "../src/lib/content/schema";
import { DISEASE_DEFS, PATHWAYS } from "../src/lib/taxonomy";
import { QUIZ_QUESTIONS } from "../src/lib/exams/questions";
import { analysisKey } from "../src/lib/content/keys";

const prisma = new PrismaClient();

const PHASE: Record<TrialSeed["phase"], TrialPhase> = {
  I: "I", "I/II": "I_II", II: "II", "II/III": "II_III", III: "III", IV: "IV", META: "META", OBS: "OBS",
};

const DRIVER_BIOMARKERS = new Set(["egfr", "alk", "ros1", "braf", "met", "ret", "ntrk", "kras", "her2", "nrg1", "dll3", "brca", "pik3ca", "esr1", "akt1"]);

export function timelineTypeFor(t: TrialSeed): TimelineEventType {
  if (t.result === "NEGATIVE") return "NEGATIVE_TRIAL";
  if (t.treatmentClasses.includes("radiotherapy")) return "RADIATION_MILESTONE";
  if (t.treatmentClasses.includes("surgery")) return "SURGERY_MILESTONE";
  if (t.biomarkers.some((b) => DRIVER_BIOMARKERS.has(b)) && ["tki", "adc", "parp", "pi3k-akt", "bispecific"].some((c) => t.treatmentClasses.includes(c)))
    return "MOLECULAR_BREAKTHROUGH";
  return "LANDMARK_TRIAL";
}

function toDate(publicationDate: string | undefined, year: number): Date {
  if (publicationDate && /^\d{4}-\d{2}(-\d{2})?$/.test(publicationDate)) {
    const [y, m, d] = publicationDate.split("-").map(Number);
    return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  }
  return new Date(Date.UTC(year, 0, 1));
}

async function main() {
  const trials = loadTrials();
  const biomarkers = loadBiomarkers();
  const drugs = loadDrugs();
  const errors = [...trials.errors, ...biomarkers.errors, ...drugs.errors].map((e) => `${e.file}: ${e.message}`);
  for (const t of trials.items) for (const i of checkTrialIntegrity(t)) errors.push(`${t.slug} ${i.path}: ${i.message}`);
  if (errors.length) {
    console.error("Content validation failed; refusing to seed:\n" + errors.join("\n"));
    process.exit(1);
  }

  console.log("Clearing evidence tables…");
  await prisma.$transaction([
    prisma.evidenceTimelineEvent.deleteMany(),
    prisma.trialOutcomeAnalysis.deleteMany(),
    prisma.trialOutcome.deleteMany(),
    prisma.trialEndpoint.deleteMany(),
    prisma.trialSafety.deleteMany(),
    prisma.trialSubgroup.deleteMany(),
    prisma.trialPublication.deleteMany(),
    prisma.evidenceClaim.deleteMany(),
    prisma.clinicalTrial.deleteMany(),
    prisma.regulatoryDecision.deleteMany(),
    prisma.regulatoryIndication.deleteMany(),
    prisma.guidelineRecommendation.deleteMany(),
    prisma.guideline.deleteMany(),
    prisma.sourceDocument.deleteMany(),
    prisma.biomarkerOnDrug.deleteMany(),
    prisma.biomarkerOnCancer.deleteMany(),
    prisma.biomarker.deleteMany(),
    prisma.drug.deleteMany(),
    prisma.molecularPathway.deleteMany(),
    prisma.clinicalAlgorithm.deleteMany(),
    prisma.quizQuestion.deleteMany(),
    prisma.cancerType.deleteMany(),
  ]);

  console.log("Taxonomy…");
  const cancerIds: Record<string, string> = {};
  for (const [i, d] of DISEASE_DEFS.entries()) {
    const ct = await prisma.cancerType.create({
      data: {
        slug: d.slug,
        name: d.name,
        shortName: d.shortName,
        description: d.description,
        organSystem: d.organSystem,
        sortOrder: i,
        subtypes: { create: d.subtypes.map((s) => ({ slug: s.slug, name: s.name, description: s.description })) },
        histologies: { create: d.histologies },
        stageSystems: { create: d.stageSystems.map((s) => ({ name: s.name, versions: { create: s.versions.map((label) => ({ label })) } })) },
      },
    });
    cancerIds[d.slug] = ct.id;
  }
  const pathwayIds: Record<string, string> = {};
  for (const p of PATHWAYS) pathwayIds[p.slug] = (await prisma.molecularPathway.create({ data: p })).id;

  console.log(`Drugs (${drugs.items.length})…`);
  const drugIds: Record<string, string> = {};
  for (const d of drugs.items) {
    const row = await prisma.drug.create({
      data: {
        slug: d.slug, name: d.name, brandNames: d.brandNames, drugClass: d.drugClass, targets: d.targets,
        mechanism: d.mechanism, route: d.route, keyToxicities: d.keyToxicities, monitoring: d.monitoring,
        interactions: d.interactions, resistance: d.resistance, diseases: d.diseases, status: d.status,
        curatedBy: d.curation.curatedBy, reviewedBy: d.curation.reviewedBy,
      },
    });
    drugIds[d.slug] = row.id;
  }

  console.log(`Biomarkers (${biomarkers.items.length})…`);
  const biomarkerIds: Record<string, string> = {};
  for (const b of biomarkers.items) {
    const row = await prisma.biomarker.create({
      data: {
        slug: b.slug, name: b.name, gene: b.gene, category: b.category, summary: b.summary, biology: b.biology,
        alterations: b.alterations, testingMethods: b.testing.methods, testingSpecimen: b.testing.specimen,
        testingNotes: b.testing.notes, predictiveRelevance: b.predictiveRelevance, resistance: b.resistance,
        cnsConsiderations: b.cnsConsiderations, status: b.status, curatedBy: b.curation.curatedBy,
        reviewedBy: b.curation.reviewedBy,
        pathwayId: b.pathway ? pathwayIds[b.pathway] : undefined,
        cancers: { create: b.diseases.map((d) => ({ cancerTypeId: cancerIds[d] })) },
        drugs: { create: b.drugs.filter((s) => drugIds[s]).map((s) => ({ drugId: drugIds[s] })) },
      },
    });
    biomarkerIds[b.slug] = row.id;
  }

  // Human approvals live in VerificationRecord (never cleared) keyed by stable analysis key.
  const decisions = new Map<string, string>();
  for (const v of await prisma.verificationRecord.findMany({ where: { entityType: "TrialOutcomeAnalysis" }, orderBy: { createdAt: "asc" } })) {
    if (v.toStatus) decisions.set(v.entityId, v.toStatus);
  }

  console.log(`Trials (${trials.items.length})…`);
  const sourceIds = new Map<string, string>(); // pmid|doi -> SourceDocument.id
  for (const t of trials.items) {
    // Source documents are shared across trials (e.g. pooled analyses) — upsert by PMID/DOI.
    for (const p of t.publications) {
      const key = p.pmid ?? p.doi!;
      if (sourceIds.has(key)) continue;
      const data: Prisma.SourceDocumentCreateInput = {
        kind: "JOURNAL_ARTICLE", title: p.title, journal: p.journal, year: p.year, publicationDate: p.publicationDate,
        firstAuthor: p.firstAuthor, pmid: p.pmid, doi: p.doi,
        url: p.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/` : `https://doi.org/${p.doi}`,
        retrievedVia: p.verifiedVia, retrievedAt: new Date(p.retrievedAt),
      };
      const existing = await prisma.sourceDocument.findFirst({ where: { OR: [p.pmid ? { pmid: p.pmid } : {}, p.doi ? { doi: p.doi } : {}].filter((o) => Object.keys(o).length) } });
      const row = existing ?? (await prisma.sourceDocument.create({ data }));
      if (p.pmid) sourceIds.set(p.pmid, row.id);
      if (p.doi) sourceIds.set(p.doi, row.id);
    }
    const src = (ref: { pmid?: string; doi?: string }) => sourceIds.get((ref.pmid ?? ref.doi)!)!;

    const trial = await prisma.clinicalTrial.create({
      data: {
        slug: t.slug, acronym: t.acronym, officialTitle: t.officialTitle, cancerTypeId: cancerIds[t.disease],
        subtypes: t.subtypes, stages: t.stages, setting: t.setting, lineOfTherapy: t.lineOfTherapy,
        treatmentClasses: t.treatmentClasses, phase: PHASE[t.phase], sponsor: t.sponsor, registryIds: t.registryIds,
        yearOfPrimaryPublication: t.yearOfPrimaryPublication, clinicalQuestion: t.clinicalQuestion, result: t.result,
        landmark: t.landmark, picoPopulation: t.pico.population, picoIntervention: t.pico.intervention,
        picoComparator: t.pico.comparator, picoOutcomes: t.pico.outcomes, strengths: t.appraisal.strengths,
        limitations: t.appraisal.limitations, clinicalImplications: t.clinicalImplications?.text,
        tumourBoardPearl: t.tumourBoardPearl?.text, evidenceStatus: t.evidenceStatus, curatedBy: t.curation.curatedBy,
        curatedAt: new Date(t.curation.curatedAt), reviewedBy: t.curation.reviewedBy,
        reviewedAt: t.curation.reviewedAt ? new Date(t.curation.reviewedAt) : undefined, curationNotes: t.curation.notes,
        design: {
          create: {
            randomised: t.design.randomised, blinding: t.design.blinding, sampleSize: t.design.sampleSize,
            sampleSizeSourceQuote: t.design.sampleSizeSourceQuote, notes: t.design.notes,
          },
        },
        arms: { create: t.arms.map((a, i) => ({ ...a, sortOrder: i })) },
        publications: {
          create: t.publications.map((p) => ({ sourceDocumentId: sourceIds.get((p.pmid ?? p.doi)!)!, type: p.type, label: p.label })),
        },
        safety: {
          create: t.safety.map((s) => ({
            category: s.category, description: s.description, experimentalValue: s.experimentalValue,
            controlValue: s.controlValue, sourceDocumentId: src(s.source), sourceLocation: s.source.location,
            sourceQuote: s.sourceQuote, status: s.status,
          })),
        },
        biomarkers: { create: t.biomarkers.map((b) => ({ biomarkerSlug: b, biomarkerId: biomarkerIds[b] })) },
        drugs: { create: t.drugs.map((d) => ({ drugSlug: d, drugId: drugIds[d] })) },
      },
    });

    // Endpoint hierarchy: declared primary endpoints first, then secondary.
    const endpointIds = new Map<string, string>();
    for (const o of t.outcomes) {
      const label = o.endpointLabel ?? o.endpoint;
      const epKey = `${o.endpoint}|${label}`;
      if (!endpointIds.has(epKey)) {
        const ep = await prisma.trialEndpoint.create({
          data: { trialId: trial.id, code: o.endpoint, label, isPrimary: o.isPrimaryEndpoint, hierarchy: o.isPrimaryEndpoint ? 0 : 1 },
        });
        endpointIds.set(epKey, ep.id);
      }
      const endpointId = endpointIds.get(epKey)!;
      const population = o.population ?? "ITT";
      const outcome = await prisma.trialOutcome.upsert({
        where: { endpointId_population: { endpointId, population } },
        create: { endpointId, population },
        update: {},
      });
      await prisma.trialOutcomeAnalysis.create({
        data: {
          outcomeId: outcome.id, analysisLabel: o.analysisLabel, experimentalArm: o.experimentalArm,
          controlArm: o.controlArm, experimentalValue: o.experimentalValue, controlValue: o.controlValue,
          effectMeasure: o.effectMeasure, effectEstimate: o.effectEstimate, ciLevel: o.ciLevel, ciLower: o.ciLower,
          ciUpper: o.ciUpper, pValue: o.pValue, followUp: o.followUp, dataCutoff: o.dataCutoff,
          sourceDocumentId: src(o.source), sourceLocation: o.source.location, sourceQuote: o.sourceQuote,
          status: (decisions.get(analysisKey({ trialSlug: t.slug, endpoint: o.endpoint, endpointLabel: o.endpointLabel, population: o.population, analysisLabel: o.analysisLabel })) ?? o.status) as typeof o.status,
        },
      });
    }

    const primary = t.publications.find((p) => p.type === "PRIMARY") ?? t.publications[0];
    await prisma.evidenceTimelineEvent.create({
      data: {
        date: toDate(primary.publicationDate, primary.year),
        year: primary.year,
        title: t.acronym,
        summary: `${t.setting}: ${t.pico.intervention} vs ${t.pico.comparator}. Primary report — ${primary.journal} ${primary.year}.`,
        type: timelineTypeFor(t),
        cancerTypeId: cancerIds[t.disease],
        trialId: trial.id,
        biomarkers: t.biomarkers,
        treatmentClasses: t.treatmentClasses,
        stages: t.stages,
        status: t.evidenceStatus,
      },
    });
  }

  console.log(`Quiz questions (${QUIZ_QUESTIONS.length})…`);
  for (const q of QUIZ_QUESTIONS) {
    await prisma.quizQuestion.create({
      data: {
        slug: q.slug, format: q.format, topic: q.topic, stem: q.stem, options: q.options, answer: q.answer,
        explanation: q.explanation, trialSlugs: q.trialSlugs, status: "AWAITING_VERIFICATION",
      },
    });
  }

  const counts = {
    trials: await prisma.clinicalTrial.count(),
    analyses: await prisma.trialOutcomeAnalysis.count(),
    sources: await prisma.sourceDocument.count(),
    biomarkers: await prisma.biomarker.count(),
    drugs: await prisma.drug.count(),
    timeline: await prisma.evidenceTimelineEvent.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
