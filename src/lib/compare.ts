/**
 * Comparability assessment between trials. Pure functions (unit-tested).
 * Cross-trial comparisons are always indirect; this module explains WHY two
 * trials are additionally non-equivalent so the UI can say so explicitly.
 */
export interface ComparableTrial {
  acronym: string;
  disease: string;
  setting: string;
  lineOfTherapy?: string | null;
  stages: string[];
  biomarkers: string[];
  comparator: string;
  phase: string;
  randomised?: boolean | null;
  primaryEndpoints: string[];
  year: number;
}

export interface ComparabilityWarning {
  level: "info" | "caution" | "critical";
  message: string;
}

const distinct = <T,>(xs: T[]) => [...new Set(xs)];

export function assessComparability(trials: ComparableTrial[]): ComparabilityWarning[] {
  if (trials.length < 2) return [];
  const w: ComparabilityWarning[] = [
    {
      level: "info",
      message:
        "These are separate trials. Any comparison across them is indirect: patient populations, control arms, assessment methods and eras differ. Do not rank treatments on cross-trial numbers without a head-to-head trial or a formally conducted network meta-analysis.",
    },
  ];
  const diseases = distinct(trials.map((t) => t.disease));
  if (diseases.length > 1) w.push({ level: "critical", message: `Different diseases (${diseases.join(", ")}): results are not transferable between these trials.` });

  const settings = distinct(trials.map((t) => t.setting.toLowerCase()));
  if (settings.length > 1) w.push({ level: "critical", message: `Different clinical settings (${distinct(trials.map((t) => t.setting)).join("; ")}): endpoints and baseline risk are not comparable.` });

  const lines = distinct(trials.map((t) => t.lineOfTherapy ?? "unspecified"));
  if (lines.length > 1) w.push({ level: "caution", message: `Different lines of therapy (${lines.join(", ")}).` });

  const bm = distinct(trials.map((t) => [...t.biomarkers].sort().join("+") || "unselected"));
  if (bm.length > 1) w.push({ level: "caution", message: `Different biomarker selection (${bm.join(" vs ")}): selected and unselected populations have different prognosis.` });

  const comparators = distinct(trials.map((t) => t.comparator.toLowerCase().trim()));
  if (comparators.length > 1) w.push({ level: "caution", message: "Control arms differ, so hazard ratios are relative to different references and cannot be compared directly." });

  const endpoints = distinct(trials.map((t) => [...t.primaryEndpoints].sort().join("+")));
  if (endpoints.length > 1) w.push({ level: "caution", message: `Primary endpoints differ (${endpoints.join(" vs ")}).` });

  if (trials.some((t) => t.randomised === false)) w.push({ level: "caution", message: "At least one study is non-randomised; single-arm response rates cannot be compared with randomised effect estimates." });

  const years = trials.map((t) => t.year);
  if (Math.max(...years) - Math.min(...years) >= 8) w.push({ level: "caution", message: `Trials span ${Math.min(...years)}–${Math.max(...years)}: imaging, staging editions, supportive care and subsequent therapies changed over this period.` });

  return w;
}
