/** Competing risks: Aalen–Johansen cumulative incidence vs the naive 1 − Kaplan–Meier. */
import { exponential, mulberry32, uniform } from "./prng";

export interface CompetingObs {
  time: number;
  /** 0 = censored, 1 = event of interest, 2 = competing event. */
  cause: 0 | 1 | 2;
}

export interface CifPoint {
  time: number;
  /** Aalen–Johansen cumulative incidence of cause 1. */
  cif: number;
  /** 1 − KM treating competing events as censored (biased upward). */
  oneMinusKm: number;
}

export function cumulativeIncidence(data: readonly CompetingObs[]): CifPoint[] {
  const sorted = [...data].sort((a, b) => a.time - b.time);
  let atRisk = sorted.length;
  let sAll = 1; // overall event-free survival (any cause)
  let kmNaive = 1; // KM for cause 1 with cause 2 censored
  let cif = 0;
  const out: CifPoint[] = [{ time: 0, cif: 0, oneMinusKm: 0 }];
  let i = 0;
  while (i < sorted.length) {
    const t = sorted[i].time;
    let d1 = 0;
    let d2 = 0;
    let c = 0;
    while (i < sorted.length && sorted[i].time === t) {
      const k = sorted[i].cause;
      if (k === 1) d1++;
      else if (k === 2) d2++;
      else c++;
      i++;
    }
    if (atRisk > 0 && d1 + d2 > 0) {
      cif += sAll * (d1 / atRisk);
      sAll *= 1 - (d1 + d2) / atRisk;
      kmNaive *= 1 - d1 / atRisk;
      out.push({ time: t, cif, oneMinusKm: 1 - kmNaive });
    }
    atRisk -= d1 + d2 + c;
  }
  return out;
}

/** Synthetic competing-risks cohort with constant cause-specific hazards and uniform censoring. */
export function simulateCompeting({ n, rate1, rate2, maxFollowUp, seed }: { n: number; rate1: number; rate2: number; maxFollowUp: number; seed: number }): CompetingObs[] {
  const rng = mulberry32(seed);
  return Array.from({ length: n }, () => {
    const t1 = exponential(rng, rate1);
    const t2 = rate2 > 0 ? exponential(rng, rate2) : Infinity;
    const c = uniform(rng, maxFollowUp * 0.5, maxFollowUp);
    const t = Math.min(t1, t2, c);
    const cause: 0 | 1 | 2 = t === c ? 0 : t === t1 ? 1 : 2;
    return { time: t, cause };
  });
}
