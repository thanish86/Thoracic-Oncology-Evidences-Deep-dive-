/** Kaplan–Meier estimator and helpers (pure functions, right-censored data). */

export interface SurvivalObs {
  /** Follow-up time (event or censoring), ≥ 0. */
  time: number;
  /** true = event observed; false = right-censored. */
  event: boolean;
}

export interface KmStep {
  time: number;
  /** Number at risk just before `time`. */
  atRisk: number;
  events: number;
  censored: number;
  /** Survival estimate just after `time`. */
  survival: number;
  /** Greenwood standard error of the survival estimate. */
  se: number;
}

export interface KmCurve {
  steps: KmStep[];
  n: number;
  totalEvents: number;
  maxTime: number;
}

/**
 * Product-limit estimator. At tied times events are processed before censorings
 * (the conventional assumption that censored subjects were at risk at that instant).
 */
export function kaplanMeier(data: readonly SurvivalObs[]): KmCurve {
  const sorted = [...data].filter((d) => Number.isFinite(d.time) && d.time >= 0).sort((a, b) => a.time - b.time);
  const steps: KmStep[] = [];
  let atRisk = sorted.length;
  let s = 1;
  let greenwood = 0;
  let totalEvents = 0;
  let i = 0;
  while (i < sorted.length) {
    const t = sorted[i].time;
    let d = 0;
    let c = 0;
    while (i < sorted.length && sorted[i].time === t) {
      if (sorted[i].event) d++;
      else c++;
      i++;
    }
    if (d > 0) {
      s *= 1 - d / atRisk;
      if (atRisk > d) greenwood += d / (atRisk * (atRisk - d));
    }
    totalEvents += d;
    steps.push({ time: t, atRisk, events: d, censored: c, survival: s, se: s * Math.sqrt(greenwood) });
    atRisk -= d + c;
  }
  return { steps, n: sorted.length, totalEvents, maxTime: sorted.length ? sorted[sorted.length - 1].time : 0 };
}

/** S(t): survival estimate at time t (right-continuous step function). */
export function survivalAt(curve: KmCurve, t: number): number {
  let s = 1;
  for (const step of curve.steps) {
    if (step.time > t) break;
    s = step.survival;
  }
  return s;
}

/** Median survival: smallest event time with S(t) ≤ 0.5; null if the curve never reaches 0.5 ("not reached"). */
export function kmMedian(curve: KmCurve, quantile = 0.5): number | null {
  for (const step of curve.steps) {
    if (step.events > 0 && step.survival <= 1 - quantile + 1e-12) return step.time;
  }
  return null;
}

/** Number of subjects still at risk (follow-up ≥ t) at each requested time. */
export function numberAtRisk(data: readonly SurvivalObs[], times: readonly number[]): number[] {
  return times.map((t) => data.filter((d) => d.time >= t).length);
}

/** Points for plotting a step curve: starts at (0, 1), one point per event time, extended to the last follow-up. */
export function kmPlotPoints(curve: KmCurve): { time: number; survival: number }[] {
  const pts: { time: number; survival: number }[] = [{ time: 0, survival: 1 }];
  for (const step of curve.steps) if (step.events > 0) pts.push({ time: step.time, survival: step.survival });
  const last = pts[pts.length - 1];
  if (curve.maxTime > last.time) pts.push({ time: curve.maxTime, survival: last.survival });
  return pts;
}
