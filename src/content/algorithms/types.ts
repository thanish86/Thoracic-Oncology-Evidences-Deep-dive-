/**
 * Educational treatment-pathway graphs.
 *
 * Zero-fabrication policy: nodes contain qualitative branches only. No efficacy numbers,
 * doses or guideline category levels. Supporting evidence is referenced exclusively by
 * curated trial slug; slugs that do not exist in the database are filtered out at render time.
 */

export type AlgorithmNodeKind = "decision" | "test" | "treatment" | "note";

export interface AlgorithmNode {
  id: string;
  kind: AlgorithmNodeKind;
  label: string;
  detail?: string;
  trialSlugs?: string[];
}

export interface AlgorithmEdge {
  source: string;
  target: string;
  label?: string;
}

export type AlgorithmDisease = "nsclc" | "sclc" | "breast" | "mesothelioma" | "thymic";

export interface TreatmentAlgorithm {
  slug: string;
  title: string;
  summary: string;
  disease: AlgorithmDisease;
  stage: string;
  intent: "curative" | "palliative" | "curative or palliative";
  jurisdiction: string;
  asOf: string;
  status: "AWAITING_VERIFICATION";
  nodes: AlgorithmNode[];
  edges: AlgorithmEdge[];
}

export const JURISDICTION_LABEL =
  "Educational synthesis — not jurisdiction-specific; not a substitute for ESMO/NCCN/ASCO guidance";

export const ALGORITHM_AS_OF = "2026-10-09";
