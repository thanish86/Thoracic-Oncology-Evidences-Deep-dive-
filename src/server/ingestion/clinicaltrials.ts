/**
 * ClinicalTrials.gov API v2 client. https://clinicaltrials.gov/data-api/api
 * Used for registry matching: confirms an NCT ID and retrieves design metadata.
 */
import { z } from "zod";
import { politeFetch, type FetchLike } from "./http";

const BASE = "https://clinicaltrials.gov/api/v2";

const studySchema = z.object({
  protocolSection: z.object({
    identificationModule: z.object({
      nctId: z.string(),
      briefTitle: z.string().optional(),
      officialTitle: z.string().optional(),
      acronym: z.string().optional(),
    }),
    statusModule: z.object({ overallStatus: z.string().optional() }).partial().optional(),
    sponsorCollaboratorsModule: z.object({ leadSponsor: z.object({ name: z.string() }).optional() }).partial().optional(),
    designModule: z
      .object({
        phases: z.array(z.string()).optional(),
        enrollmentInfo: z.object({ count: z.number().optional(), type: z.string().optional() }).partial().optional(),
        designInfo: z
          .object({ allocation: z.string().optional(), maskingInfo: z.object({ masking: z.string().optional() }).partial().optional() })
          .partial()
          .optional(),
      })
      .partial()
      .optional(),
    outcomesModule: z
      .object({
        primaryOutcomes: z.array(z.object({ measure: z.string(), timeFrame: z.string().optional() })).optional(),
        secondaryOutcomes: z.array(z.object({ measure: z.string(), timeFrame: z.string().optional() })).optional(),
      })
      .partial()
      .optional(),
    eligibilityModule: z.object({ eligibilityCriteria: z.string().optional() }).partial().optional(),
  }),
});
export type RegistryStudy = z.infer<typeof studySchema>;

export async function getRegistryStudy(nctId: string, { fetchImpl }: { fetchImpl?: FetchLike } = {}): Promise<RegistryStudy | null> {
  if (!/^NCT\d{8}$/.test(nctId)) throw new Error(`invalid NCT id: ${nctId}`);
  try {
    const res = await politeFetch(`${BASE}/studies/${nctId}?format=json`, { minIntervalMs: 250, fetchImpl });
    return studySchema.parse(await res.json());
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("HTTP 404")) return null;
    throw e;
  }
}

/** Normalise registry design fields for the TrialDesign / TrialEligibility models. */
export function summariseRegistryStudy(s: RegistryStudy) {
  const p = s.protocolSection;
  return {
    nctId: p.identificationModule.nctId,
    acronym: p.identificationModule.acronym,
    officialTitle: p.identificationModule.officialTitle ?? p.identificationModule.briefTitle,
    sponsor: p.sponsorCollaboratorsModule?.leadSponsor?.name,
    phases: p.designModule?.phases ?? [],
    enrollment: p.designModule?.enrollmentInfo?.count,
    enrollmentType: p.designModule?.enrollmentInfo?.type,
    randomised: p.designModule?.designInfo?.allocation === "RANDOMIZED",
    masking: p.designModule?.designInfo?.maskingInfo?.masking,
    primaryOutcomes: p.outcomesModule?.primaryOutcomes?.map((o) => o.measure) ?? [],
    secondaryOutcomes: p.outcomesModule?.secondaryOutcomes?.map((o) => o.measure) ?? [],
    eligibility: p.eligibilityModule?.eligibilityCriteria,
    status: p.statusModule?.overallStatus,
  };
}
