import { describe, expect, it } from "vitest";
import { logRank } from "../logrank";
import { simulateTrial } from "../simulate";
import { mulberry32 } from "../prng";
import { classifyNonInferiority } from "../noninferiority";
import { cumulativeIncidence, simulateCompeting } from "../competing";

describe("mulberry32", () => {
  it("is deterministic for a given seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const xs = Array.from({ length: 5 }, () => a());
    expect(Array.from({ length: 5 }, () => b())).toEqual(xs);
    expect(xs.every((x) => x >= 0 && x < 1)).toBe(true);
  });
});

describe("logRank", () => {
  it("gives χ² = 0 and P = 1 for identical groups", () => {
    const g = [
      { time: 1, event: true },
      { time: 2, event: false },
      { time: 3, event: true },
      { time: 5, event: true },
      { time: 6, event: false },
    ];
    const r = logRank(g, g);
    expect(r.chiSquare).toBeCloseTo(0, 10);
    expect(r.p).toBeCloseTo(1, 6);
    expect(r.hrPeto).toBeCloseTo(1, 10);
    expect(r.observedA + r.observedB).toBeCloseTo(r.expectedA + r.expectedB, 10);
  });

  it("returns a large P when both arms come from the same distribution", () => {
    const sim = simulateTrial({ controlMedian: 12, hr: 1, nPerArm: 300, accrual: 18, followUp: 24, seed: 7 });
    const r = logRank(sim.experimental, sim.control);
    expect(r.p).toBeGreaterThan(0.05);
  });

  it("detects a strong effect and recovers the HR approximately", () => {
    const sim = simulateTrial({ controlMedian: 12, hr: 0.5, nPerArm: 400, accrual: 18, followUp: 24, seed: 11 });
    const r = logRank(sim.experimental, sim.control);
    expect(r.p).toBeLessThan(0.001);
    expect(r.hrPeto).toBeGreaterThan(0.4);
    expect(r.hrPeto).toBeLessThan(0.65);
    expect(r.hrPetoLower).toBeLessThan(r.hrPeto);
  });
});

describe("classifyNonInferiority", () => {
  it.each([
    [0.7, 0.95, "superior"],
    [0.9, 1.15, "non-inferior"],
    [0.95, 1.4, "inconclusive"],
    [1.35, 1.6, "inferior"],
    [1.05, 1.4, "inferior"],
  ] as const)("CI %s–%s with margin 1.25 → %s", (lower, upper, expected) => {
    expect(classifyNonInferiority({ lower, upper, margin: 1.25 }).conclusion).toBe(expected);
  });
});

describe("competing risks", () => {
  it("1 − KM overestimates cumulative incidence when competing events occur", () => {
    const cohort = simulateCompeting({ n: 500, rate1: 0.03, rate2: 0.05, maxFollowUp: 60, seed: 3 });
    const pts = cumulativeIncidence(cohort);
    const last = pts[pts.length - 1];
    expect(last.oneMinusKm).toBeGreaterThan(last.cif);
    expect(pts.every((p) => p.oneMinusKm + 1e-12 >= p.cif)).toBe(true);
  });
  it("agrees with 1 − KM when there are no competing events", () => {
    const cohort = simulateCompeting({ n: 200, rate1: 0.05, rate2: 0, maxFollowUp: 40, seed: 5 });
    const pts = cumulativeIncidence(cohort);
    for (const p of pts) expect(p.cif).toBeCloseTo(p.oneMinusKm, 10);
  });
});
