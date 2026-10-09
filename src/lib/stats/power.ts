/** Events-driven sample size (Schoenfeld 1981) for a two-arm time-to-event comparison. */
import { normCdf, normQuantile } from "./normal";

export interface SchoenfeldInput {
  /** Target hazard ratio (experimental vs control), > 0 and ≠ 1. */
  hr: number;
  /** Two-sided type I error, e.g. 0.05. */
  alpha: number;
  /** Power = 1 − β, e.g. 0.8. */
  power: number;
  /** Allocation ratio experimental : control (k means k:1). Default 1. */
  allocationRatio?: number;
}

export interface SchoenfeldResult {
  /** Exact (non-integer) number of events from the formula. */
  eventsExact: number;
  /** Rounded up to the next whole event. */
  events: number;
  zAlpha: number;
  zBeta: number;
  /** Proportion allocated to the experimental arm. */
  p: number;
}

/** D = (z₁₋α/₂ + z₁₋β)² / (p(1−p)·(ln HR)²) */
export function schoenfeldEvents({ hr, alpha, power, allocationRatio = 1 }: SchoenfeldInput): SchoenfeldResult {
  if (!(hr > 0) || hr === 1) throw new RangeError("hr must be > 0 and ≠ 1");
  if (!(alpha > 0 && alpha < 1)) throw new RangeError("alpha must be in (0, 1)");
  if (!(power > 0 && power < 1)) throw new RangeError("power must be in (0, 1)");
  if (!(allocationRatio > 0)) throw new RangeError("allocationRatio must be > 0");
  const zAlpha = normQuantile(1 - alpha / 2);
  const zBeta = normQuantile(power);
  const p = allocationRatio / (1 + allocationRatio);
  const lnHr = Math.log(hr);
  const eventsExact = (zAlpha + zBeta) ** 2 / (p * (1 - p) * lnHr * lnHr);
  return { eventsExact, events: Math.ceil(eventsExact - 1e-9), zAlpha, zBeta, p };
}

/** Power achieved with a given number of events (inverse of Schoenfeld). */
export function schoenfeldPower({ hr, alpha, events, allocationRatio = 1 }: { hr: number; alpha: number; events: number; allocationRatio?: number }): number {
  const p = allocationRatio / (1 + allocationRatio);
  const zAlpha = normQuantile(1 - alpha / 2);
  return normCdf(Math.sqrt(events * p * (1 - p)) * Math.abs(Math.log(hr)) - zAlpha);
}

/** Total patients needed if a fraction `eventProbability` are expected to have an event by the analysis. */
export function patientsForEvents(events: number, eventProbability: number): number {
  if (!(eventProbability > 0 && eventProbability <= 1)) throw new RangeError("eventProbability must be in (0, 1]");
  return Math.ceil(events / eventProbability);
}
