/** Non-inferiority / superiority classification for a hazard ratio CI (lower HR favours experimental). */

export type NiConclusion = "superior" | "non-inferior" | "inconclusive" | "inferior";

export interface NiResult {
  conclusion: NiConclusion;
  explanation: string;
}

/**
 * HR scale, experimental vs control, with a margin M > 1 (largest acceptable loss of efficacy):
 *  - upper < 1          → superior (and therefore also non-inferior)
 *  - upper < M          → non-inferior
 *  - lower > 1          → inferior (statistically worse than control)
 *  - otherwise          → inconclusive (CI crosses the margin)
 */
export function classifyNonInferiority({ lower, upper, margin }: { lower: number; upper: number; margin: number }): NiResult {
  if (!(lower > 0 && upper >= lower)) throw new RangeError("need 0 < lower ≤ upper");
  if (!(margin > 1)) throw new RangeError("margin must be > 1 on the HR scale");
  if (upper < 1)
    return { conclusion: "superior", explanation: "The whole CI lies below 1: superiority is shown (non-inferiority follows automatically)." };
  if (upper < margin)
    return { conclusion: "non-inferior", explanation: "The upper CI bound is below the margin: non-inferiority is shown, but the CI includes 1, so superiority is not." };
  if (lower > 1)
    return {
      conclusion: "inferior",
      explanation:
        lower >= margin
          ? "The whole CI lies above the margin: the experimental arm is inferior by more than the acceptable margin."
          : "The CI excludes 1 on the harmful side and crosses the margin: statistically worse than control; non-inferiority is not shown.",
    };
  return { conclusion: "inconclusive", explanation: "The CI includes 1 and crosses the margin: neither non-inferiority nor a difference is demonstrated." };
}
