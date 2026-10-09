import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an effect estimate with CI exactly as stored (2 dp max, no rounding beyond source precision). */
export function formatEstimate(
  measure: string,
  estimate?: number | null,
  lower?: number | null,
  upper?: number | null,
  level = 95,
): string | null {
  if (estimate == null) return null;
  const f = (n: number) => String(Number(n.toFixed(3)));
  const ci = lower != null && upper != null ? ` (${level}% CI ${f(lower)}–${f(upper)})` : "";
  return `${measure} ${f(estimate)}${ci}`;
}

export function pubmedUrl(pmid: string) {
  return `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
}
export function doiUrl(doi: string) {
  return `https://doi.org/${doi}`;
}
export function registryUrl(registry: string, id: string): string | null {
  if (registry === "ClinicalTrials.gov") return `https://clinicaltrials.gov/study/${id}`;
  if (registry === "ISRCTN") return `https://www.isrctn.com/${id}`;
  return null;
}

export const PHASE_LABEL: Record<string, string> = {
  I: "Phase I", I_II: "Phase I/II", II: "Phase II", II_III: "Phase II/III", III: "Phase III", IV: "Phase IV",
  META: "Meta-analysis", OBS: "Observational",
};

export const RESULT_LABEL: Record<string, string> = {
  POSITIVE: "Met primary endpoint",
  NEGATIVE: "Did not meet primary endpoint",
  NON_INFERIOR: "Non-inferior",
  MIXED: "Mixed",
  PENDING: "Pending",
  DESCRIPTIVE: "Descriptive / single-arm",
};
