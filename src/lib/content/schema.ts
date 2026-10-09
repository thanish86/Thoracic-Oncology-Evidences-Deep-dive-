/**
 * ONCOATLAS curated-content contract.
 *
 * Every JSON file under /content is validated against these schemas
 * (`npm run content:validate`) before it can be seeded into PostgreSQL.
 *
 * Zero-fabrication rules enforced here and in content integrity tests:
 *  - Every numeric outcome carries a verbatim `sourceQuote` copied from the
 *    cited source (usually the PubMed abstract), and the numbers must appear
 *    in that quote.
 *  - Every outcome and safety record points to a publication by PMID or DOI
 *    that is listed in the trial's `publications` array.
 *  - Machine- or agent-curated records can never be VERIFIED. That status
 *    requires a named human reviewer (`reviewedBy`) and review date.
 */
import { z } from "zod";

export const DISEASES = ["breast", "nsclc", "sclc", "thymic", "mesothelioma"] as const;
export const diseaseSchema = z.enum(DISEASES);
export type DiseaseSlug = z.infer<typeof diseaseSchema>;

export const EVIDENCE_STATUSES = [
  "VERIFIED",
  "PRELIMINARY",
  "AWAITING_VERIFICATION",
  "UPDATED_ANALYSIS",
  "HISTORICAL",
  "CORRECTED_RETRACTED",
] as const;
export const evidenceStatusSchema = z.enum(EVIDENCE_STATUSES);
export type EvidenceStatus = z.infer<typeof evidenceStatusSchema>;

export const TRIAL_RESULT = [
  "POSITIVE",
  "NEGATIVE",
  "NON_INFERIOR",
  "MIXED",
  "PENDING",
  "DESCRIPTIVE",
] as const;

export const ENDPOINTS = [
  "OS", "PFS", "EFS", "DFS", "IDFS", "iDFS", "RFS", "DRFI", "DRFS", "TTF", "TTP",
  "ORR", "CR", "pCR", "MPR", "DoR", "DCR", "CNS_ORR", "CNS_PFS", "LC", "QOL", "OTHER",
] as const;
export const endpointSchema = z.enum(ENDPOINTS);

export const EFFECT_MEASURES = ["HR", "OR", "RR", "DIFF", "NONE"] as const;

const nonEmpty = z.string().trim().min(1);

export const publicationSchema = z
  .object({
    pmid: z.string().regex(/^\d{6,9}$/).optional(),
    doi: z.string().regex(/^10\.\d{4,9}\/\S+$/).optional(),
    title: nonEmpty,
    journal: nonEmpty,
    year: z.number().int().min(1990).max(2026),
    publicationDate: z.string().optional(), // ISO yyyy-mm(-dd) as printed by PubMed
    firstAuthor: z.string().optional(),
    type: z.enum(["PRIMARY", "UPDATE", "FINAL_OS", "SUBGROUP", "SAFETY", "QOL", "PROTOCOL", "META_ANALYSIS", "OTHER"]),
    label: z.string().optional(), // e.g. "5-year update"
    verifiedVia: z.enum(["PubMed", "Crossref", "ClinicalTrials.gov", "Publisher", "Manual"]),
    retrievedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
  })
  .refine((p) => p.pmid || p.doi, { message: "publication needs a PMID or DOI" });

/** Reference to a publication in the same trial file. */
const sourceRef = z.object({
  pmid: z.string().optional(),
  doi: z.string().optional(),
  location: z.enum(["abstract", "full-text", "supplement", "registry", "label"]).default("abstract"),
});

export const outcomeSchema = z.object({
  endpoint: endpointSchema,
  endpointLabel: z.string().optional(), // free label e.g. "Investigator-assessed PFS"
  analysisLabel: nonEmpty, // e.g. "Primary analysis", "Final OS analysis"
  population: z.string().optional(), // e.g. "ITT", "PD-L1 TPS >=50%"
  isPrimaryEndpoint: z.boolean().default(false),
  experimentalArm: z.string().optional(),
  controlArm: z.string().optional(),
  experimentalValue: z.string().optional(), // as reported, e.g. "10.3 months", "45%"
  controlValue: z.string().optional(),
  effectMeasure: z.enum(EFFECT_MEASURES).default("NONE"),
  effectEstimate: z.number().optional(),
  ciLevel: z.number().default(95),
  ciLower: z.number().optional(),
  ciUpper: z.number().optional(),
  pValue: z.string().optional(), // as printed, e.g. "<0.001", "0.005"
  followUp: z.string().optional(),
  dataCutoff: z.string().optional(),
  source: sourceRef,
  sourceQuote: nonEmpty, // verbatim text supporting every number above
  status: evidenceStatusSchema.default("AWAITING_VERIFICATION"),
});
export type OutcomeSeed = z.infer<typeof outcomeSchema>;

export const safetySchema = z.object({
  category: z.enum(["GRADE3PLUS", "SERIOUS", "IMMUNE", "DISCONTINUATION", "DEATHS", "SPECIFIC", "GENERAL"]),
  description: nonEmpty,
  experimentalValue: z.string().optional(),
  controlValue: z.string().optional(),
  source: sourceRef,
  sourceQuote: nonEmpty,
  status: evidenceStatusSchema.default("AWAITING_VERIFICATION"),
});

export const armSchema = z.object({
  label: nonEmpty,
  role: z.enum(["EXPERIMENTAL", "CONTROL", "SINGLE_ARM", "OTHER"]),
  regimen: nonEmpty, // agents named; doses only when sourced (doseSourceQuote)
  dosing: z.string().optional(),
  doseSourceQuote: z.string().optional(),
  n: z.number().int().positive().optional(),
});

export const editorialSchema = z.object({
  text: nonEmpty,
  // Editorial prose is authored, not extracted; it is always awaiting expert review
  status: z.literal("AWAITING_VERIFICATION").default("AWAITING_VERIFICATION"),
});

export const trialSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    acronym: nonEmpty,
    officialTitle: nonEmpty,
    disease: diseaseSchema,
    subtypes: z.array(z.string()).default([]), // e.g. "HR+/HER2-", "EGFR-mutant", "epithelioid"
    stages: z.array(z.enum(["early", "locally-advanced", "metastatic", "limited-stage", "extensive-stage", "resectable", "unresectable", "recurrent", "screening", "dcis", "any"])).min(1),
    setting: nonEmpty, // e.g. "Adjuvant", "First-line metastatic"
    lineOfTherapy: z.string().optional(),
    treatmentClasses: z.array(z.string()).default([]), // e.g. "immunotherapy", "tki", "adc"
    biomarkers: z.array(z.string()).default([]), // biomarker slugs, e.g. "egfr", "pd-l1"
    drugs: z.array(z.string()).default([]), // drug slugs, e.g. "osimertinib"
    phase: z.enum(["I", "I/II", "II", "II/III", "III", "IV", "META", "OBS"]),
    design: z.object({
      randomised: z.boolean(),
      blinding: z.string().optional(),
      sampleSize: z.number().int().positive().optional(),
      sampleSizeSourceQuote: z.string().optional(),
      primaryEndpoints: z.array(z.string()).min(1),
      secondaryEndpoints: z.array(z.string()).default([]),
      notes: z.string().optional(),
    }),
    sponsor: z.string().optional(),
    registryIds: z.array(z.object({ registry: z.enum(["ClinicalTrials.gov", "EudraCT", "ISRCTN", "UMIN", "JapicCTI", "CTRI", "Other"]), id: nonEmpty })).default([]),
    yearOfPrimaryPublication: z.number().int().min(1990).max(2026),
    clinicalQuestion: nonEmpty,
    result: z.enum(TRIAL_RESULT),
    landmark: z.boolean().default(false),
    pico: z.object({ population: nonEmpty, intervention: nonEmpty, comparator: nonEmpty, outcomes: nonEmpty }),
    arms: z.array(armSchema).min(1),
    publications: z.array(publicationSchema).min(1),
    outcomes: z.array(outcomeSchema).default([]),
    safety: z.array(safetySchema).default([]),
    appraisal: z
      .object({ strengths: z.array(z.string()).default([]), limitations: z.array(z.string()).default([]) })
      .default({ strengths: [], limitations: [] }),
    clinicalImplications: editorialSchema.optional(),
    tumourBoardPearl: editorialSchema.optional(),
    evidenceStatus: evidenceStatusSchema,
    curation: z.object({
      curatedBy: nonEmpty, // e.g. "agent:pubmed-curation" or reviewer name
      curatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}/),
      reviewedBy: z.string().optional(),
      reviewedAt: z.string().optional(),
      notes: z.string().optional(),
    }),
  })
  .superRefine((t, ctx) => {
    const ids = new Set(t.publications.flatMap((p) => [p.pmid, p.doi].filter(Boolean) as string[]));
    const check = (ref: { pmid?: string; doi?: string }, path: (string | number)[]) => {
      const key = ref.pmid ?? ref.doi;
      if (!key || !ids.has(key)) ctx.addIssue({ code: "custom", path, message: `source ${key ?? "(none)"} not in publications` });
    };
    t.outcomes.forEach((o, i) => check(o.source, ["outcomes", i, "source"]));
    t.safety.forEach((s, i) => check(s.source, ["safety", i, "source"]));
    if (t.evidenceStatus === "VERIFIED" && !(t.curation.reviewedBy && t.curation.reviewedAt)) {
      ctx.addIssue({ code: "custom", path: ["evidenceStatus"], message: "VERIFIED requires a human reviewer and review date" });
    }
    [...t.outcomes, ...t.safety].forEach((o, i) => {
      if (o.status === "VERIFIED" && !t.curation.reviewedBy) {
        ctx.addIssue({ code: "custom", path: ["outcomes", i, "status"], message: "VERIFIED value requires human review" });
      }
    });
    if (t.design.sampleSize && !t.design.sampleSizeSourceQuote) {
      ctx.addIssue({ code: "custom", path: ["design", "sampleSize"], message: "sampleSize requires sampleSizeSourceQuote" });
    }
    t.arms.forEach((a, i) => {
      if (a.dosing && !a.doseSourceQuote) {
        ctx.addIssue({ code: "custom", path: ["arms", i, "dosing"], message: "dosing requires doseSourceQuote" });
      }
    });
  });
export type TrialSeed = z.infer<typeof trialSchema>;

export const biomarkerSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: nonEmpty,
  gene: z.string().optional(),
  diseases: z.array(diseaseSchema).min(1),
  category: z.enum(["driver", "receptor", "immune", "dna-repair", "pathway", "diagnostic-ihc", "prognostic"]),
  summary: nonEmpty,
  biology: nonEmpty,
  alterations: z.array(z.string()).default([]),
  testing: z.object({ methods: z.array(z.string()).min(1), specimen: z.string().optional(), notes: z.string().optional() }),
  predictiveRelevance: nonEmpty,
  resistance: z.array(z.string()).default([]),
  cnsConsiderations: z.string().optional(),
  drugs: z.array(z.string()).default([]),
  pathway: z.string().optional(), // molecular pathway slug
  status: evidenceStatusSchema.default("AWAITING_VERIFICATION"),
  curation: z.object({ curatedBy: nonEmpty, curatedAt: nonEmpty, reviewedBy: z.string().optional() }),
});
export type BiomarkerSeed = z.infer<typeof biomarkerSchema>;

export const drugSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: nonEmpty,
  brandNames: z.array(z.string()).default([]),
  drugClass: nonEmpty,
  targets: z.array(z.string()).default([]),
  mechanism: nonEmpty,
  route: z.enum(["oral", "intravenous", "subcutaneous", "intramuscular", "other"]),
  diseases: z.array(diseaseSchema).min(1),
  keyToxicities: z.array(z.string()).default([]),
  monitoring: z.array(z.string()).default([]),
  interactions: z.string().optional(),
  resistance: z.string().optional(),
  /** Labelled dosing is never written from memory. Left empty until ingested from FDA/EMA label. */
  labelledDosing: z.array(z.object({ jurisdiction: z.enum(["FDA", "EMA", "Other"]), text: nonEmpty, sourceUrl: z.string().url(), retrievedAt: nonEmpty })).default([]),
  status: evidenceStatusSchema.default("AWAITING_VERIFICATION"),
  curation: z.object({ curatedBy: nonEmpty, curatedAt: nonEmpty, reviewedBy: z.string().optional() }),
});
export type DrugSeed = z.infer<typeof drugSchema>;
