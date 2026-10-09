/** Standard-normal helpers used across the statistics academy (pure, no dependencies). */

/** erf via Abramowitz & Stegun 7.1.26 (|error| < 1.5e-7). */
export function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-ax * ax);
  return sign * y;
}

/** Standard normal CDF Φ(z). */
export function normCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

/** Standard normal quantile Φ⁻¹(p) (Acklam's rational approximation, relative error ~1e-9). */
export function normQuantile(p: number): number {
  if (!(p > 0 && p < 1)) throw new RangeError("p must be in (0, 1)");
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const pLow = 0.02425;
  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > 1 - pLow) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  const q = p - 0.5;
  const r = q * q;
  return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

/** Upper-tail P value of a chi-square statistic with 1 degree of freedom (= two-sided normal P for √χ²). */
export function chiSquare1P(chi: number): number {
  if (!(chi > 0)) return 1;
  return Math.min(1, 2 * (1 - normCdf(Math.sqrt(chi))));
}

/** Two-sided P value for a z statistic. */
export function twoSidedP(z: number): number {
  return Math.min(1, 2 * (1 - normCdf(Math.abs(z))));
}

/** Standard error of log(ratio) recovered from a symmetric-on-log-scale confidence interval. */
export function seFromRatioCi(lower: number, upper: number, level = 0.95): number {
  if (!(lower > 0 && upper > lower)) throw new RangeError("need 0 < lower < upper");
  const z = normQuantile(1 - (1 - level) / 2);
  return (Math.log(upper) - Math.log(lower)) / (2 * z);
}

export interface RatioEstimate {
  estimate: number;
  lower: number;
  upper: number;
}

/**
 * Test for interaction between two independent subgroup ratio estimates (Altman & Bland 2003):
 * z = (ln R₁ − ln R₂) / √(se₁² + se₂²). Returns the ratio of ratios with its CI and the P value.
 */
export function interactionTest(a: RatioEstimate, b: RatioEstimate, level = 0.95) {
  const se1 = seFromRatioCi(a.lower, a.upper, level);
  const se2 = seFromRatioCi(b.lower, b.upper, level);
  const diff = Math.log(a.estimate) - Math.log(b.estimate);
  const se = Math.sqrt(se1 * se1 + se2 * se2);
  const z = diff / se;
  const zc = normQuantile(1 - (1 - level) / 2);
  return {
    ratioOfRatios: Math.exp(diff),
    lower: Math.exp(diff - zc * se),
    upper: Math.exp(diff + zc * se),
    z,
    p: twoSidedP(z),
  };
}
