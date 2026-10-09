/**
 * Editorial disease-module content.
 *
 * Qualitative, consultant-level teaching text only. Per content/CURATION_GUIDE.md,
 * module prose carries NO efficacy numbers, hazard ratios, medians, percentages,
 * doses or approval dates. Established classification thresholds and definitions
 * (e.g. HER2-low = IHC 1+ or 2+/ISH−) are permitted. Trial evidence lives in the
 * source-linked trial records referenced via `trialSlugs`.
 */
import type { DiseaseSlug } from "@/lib/content/schema";

/** Predominant evidence base underpinning a section. */
export type EvidenceType = "prospective" | "retrospective" | "consensus" | "mixed";

export interface ModuleSection {
  /** Anchor id; unique within the module, kebab-case. */
  id: string;
  title: string;
  /** One-paragraph overview. */
  summary: string;
  keyPoints: string[];
  /** Memory aids, exam traps and tumour-board pearls (rendered as callouts). */
  pearls?: string[];
  /** Slugs of curated trials (content/trials/<disease>/<slug>.json). Missing slugs are dropped at render time. */
  trialSlugs?: string[];
  evidenceType?: EvidenceType;
}

export interface ModuleGroup {
  /** Anchor id for the group heading. */
  id: string;
  title: string;
  description?: string;
  /** Render as a distinct submodule (e.g. pleural vs peritoneal mesothelioma). */
  submodule?: boolean;
  sections: ModuleSection[];
}

export interface DiseaseModuleContent {
  diseaseSlug: DiseaseSlug;
  /** ISO date the editorial text reflects. */
  asOf: string;
  /** Editorial status note shown at the top of the module. */
  status: string;
  groups: ModuleGroup[];
}

export const EDITORIAL_STATUS =
  "Editorial teaching content drafted for ONCOATLAS and awaiting expert review. It is qualitative by design: effect sizes, doses and regulatory status are deliberately omitted — consult the source-linked trial records and current guidelines.";
