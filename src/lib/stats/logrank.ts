/** Two-sample log-rank test with an O/E-based hazard-ratio estimate (no Cox model needed). */
import type { SurvivalObs } from "./km";
import { chiSquare1P, normQuantile } from "./normal";

export interface LogRankResult {
  /** Observed / expected events in group A (the "experimental" arm). */
  observedA: number;
  expectedA: number;
  observedB: number;
  expectedB: number;
  /** Hypergeometric variance of O_A − E_A. */
  variance: number;
  chiSquare: number;
  p: number;
  /** Peto one-step HR estimate: exp((O_A − E_A) / V), with 95% CI exp(… ± 1.96/√V). */
  hrPeto: number;
  hrPetoLower: number;
  hrPetoUpper: number;
  /** Ratio of O/E ratios: (O_A/E_A) / (O_B/E_B). */
  hrOE: number;
}

export function logRank(groupA: readonly SurvivalObs[], groupB: readonly SurvivalObs[], level = 0.95): LogRankResult {
  const all = [
    ...groupA.map((d) => ({ ...d, g: 0 as const })),
    ...groupB.map((d) => ({ ...d, g: 1 as const })),
  ].sort((x, y) => x.time - y.time);

  let nA = groupA.length;
  let nB = groupB.length;
  let oA = 0;
  let eA = 0;
  let oB = 0;
  let eB = 0;
  let v = 0;
  let i = 0;
  while (i < all.length) {
    const t = all[i].time;
    let dA = 0;
    let dB = 0;
    let cA = 0;
    let cB = 0;
    while (i < all.length && all[i].time === t) {
      const r = all[i];
      if (r.event) {
        if (r.g === 0) dA++;
        else dB++;
      } else if (r.g === 0) cA++;
      else cB++;
      i++;
    }
    const d = dA + dB;
    const n = nA + nB;
    if (d > 0 && n > 0) {
      const e = (d * nA) / n;
      oA += dA;
      oB += dB;
      eA += e;
      eB += d - e;
      if (n > 1) v += (nA * nB * d * (n - d)) / (n * n * (n - 1));
    }
    nA -= dA + cA;
    nB -= dB + cB;
  }
  const chiSquare = v > 0 ? ((oA - eA) * (oA - eA)) / v : 0;
  const z = normQuantile(1 - (1 - level) / 2);
  const logHr = v > 0 ? (oA - eA) / v : 0;
  const se = v > 0 ? 1 / Math.sqrt(v) : Infinity;
  return {
    observedA: oA,
    expectedA: eA,
    observedB: oB,
    expectedB: eB,
    variance: v,
    chiSquare,
    p: chiSquare1P(chiSquare),
    hrPeto: Math.exp(logHr),
    hrPetoLower: Math.exp(logHr - z * se),
    hrPetoUpper: Math.exp(logHr + z * se),
    hrOE: eA > 0 && eB > 0 && oB > 0 ? oA / eA / (oB / eB) : NaN,
  };
}
