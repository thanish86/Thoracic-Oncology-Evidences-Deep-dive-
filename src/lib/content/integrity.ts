/**
 * Anti-fabrication integrity checks for curated content.
 * A number displayed in ONCOATLAS must be traceable to the verbatim quote
 * stored next to it. These checks are deliberately strict.
 */
import type { TrialSeed } from "./schema";

/** Extract every numeric token from free text ("0.62", "1,234", "−0.5"). */
export function extractNumbers(text: string): number[] {
  const normalised = text.replace(/[−–]/g, "-").replace(/(\d),(\d{3})/g, "$1$2").replace(/·/g, ".");
  const matches = normalised.match(/\d+(?:\.\d+)?/g) ?? [];
  return matches.map(Number);
}

function containsNumber(quote: string, value: number): boolean {
  return extractNumbers(quote).some((n) => Math.abs(n - value) < 1e-9);
}

export interface IntegrityIssue {
  trial: string;
  path: string;
  message: string;
}

export function checkTrialIntegrity(t: TrialSeed): IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  const push = (path: string, message: string) => issues.push({ trial: t.slug, path, message });

  t.outcomes.forEach((o, i) => {
    const base = `outcomes[${i}] (${o.endpoint})`;
    for (const [field, value] of [
      ["effectEstimate", o.effectEstimate],
      ["ciLower", o.ciLower],
      ["ciUpper", o.ciUpper],
    ] as const) {
      if (value !== undefined && !containsNumber(o.sourceQuote, value)) {
        push(`${base}.${field}`, `${value} not found in sourceQuote`);
      }
    }
    for (const [field, value] of [
      ["experimentalValue", o.experimentalValue],
      ["controlValue", o.controlValue],
      ["pValue", o.pValue],
    ] as const) {
      if (!value) continue;
      for (const n of extractNumbers(value)) {
        if (!containsNumber(o.sourceQuote, n)) push(`${base}.${field}`, `${n} (from "${value}") not found in sourceQuote`);
      }
    }
    if ((o.ciLower !== undefined) !== (o.ciUpper !== undefined)) push(base, "CI must have both bounds");
    if (o.ciLower !== undefined && o.ciUpper !== undefined && o.ciLower > o.ciUpper) push(base, "ciLower > ciUpper");
    if (o.effectEstimate !== undefined && o.effectMeasure === "NONE") push(base, "effectEstimate without effectMeasure");
    if (
      o.effectEstimate !== undefined && o.ciLower !== undefined && o.ciUpper !== undefined &&
      (o.effectEstimate < o.ciLower || o.effectEstimate > o.ciUpper)
    ) {
      push(base, "effectEstimate outside its CI");
    }
  });

  t.safety.forEach((s, i) => {
    for (const value of [s.experimentalValue, s.controlValue]) {
      if (!value) continue;
      for (const n of extractNumbers(value)) {
        if (!containsNumber(s.sourceQuote, n)) push(`safety[${i}]`, `${n} not found in sourceQuote`);
      }
    }
  });

  if (t.design.sampleSize && t.design.sampleSizeSourceQuote && !containsNumber(t.design.sampleSizeSourceQuote, t.design.sampleSize)) {
    push("design.sampleSize", "sampleSize not found in its source quote");
  }
  return issues;
}
