import { describe, expect, it } from "vitest";
import { kaplanMeier, kmMedian, kmPlotPoints, numberAtRisk, survivalAt } from "../km";
import { rmst } from "../rmst";

// Hand-computed example: times 1(e) 2(c) 3(e) 4(e) 5(c)
// t=1: 5 at risk, 1 event → S = 4/5 = 0.8
// t=3: 3 at risk, 1 event → S = 0.8 × 2/3 = 0.5333
// t=4: 2 at risk, 1 event → S = 0.5333 × 1/2 = 0.2667
const DATA = [
  { time: 1, event: true },
  { time: 2, event: false },
  { time: 3, event: true },
  { time: 4, event: true },
  { time: 5, event: false },
];

describe("kaplanMeier", () => {
  it("matches the hand-computed product-limit estimates", () => {
    const km = kaplanMeier(DATA);
    const events = km.steps.filter((s) => s.events > 0);
    expect(events.map((s) => s.time)).toEqual([1, 3, 4]);
    expect(events.map((s) => s.atRisk)).toEqual([5, 3, 2]);
    expect(events[0].survival).toBeCloseTo(0.8, 10);
    expect(events[1].survival).toBeCloseTo(8 / 15, 10);
    expect(events[2].survival).toBeCloseTo(4 / 15, 10);
    expect(km.totalEvents).toBe(3);
  });

  it("evaluates S(t) as a right-continuous step function", () => {
    const km = kaplanMeier(DATA);
    expect(survivalAt(km, 0.5)).toBe(1);
    expect(survivalAt(km, 1)).toBeCloseTo(0.8);
    expect(survivalAt(km, 2.9)).toBeCloseTo(0.8);
    expect(survivalAt(km, 3)).toBeCloseTo(8 / 15);
    expect(survivalAt(km, 10)).toBeCloseTo(4 / 15);
  });

  it("returns the first time S(t) ≤ 0.5 as the median, or null if not reached", () => {
    expect(kmMedian(kaplanMeier(DATA))).toBe(4);
    expect(kmMedian(kaplanMeier([{ time: 1, event: true }, { time: 2, event: false }, { time: 3, event: false }]))).toBeNull();
  });

  it("processes events before censorings at tied times", () => {
    const km = kaplanMeier([
      { time: 2, event: true },
      { time: 2, event: false },
      { time: 3, event: true },
    ]);
    expect(km.steps[0].atRisk).toBe(3);
    expect(km.steps[0].survival).toBeCloseTo(2 / 3);
    expect(km.steps[1].atRisk).toBe(1);
    expect(km.steps[1].survival).toBe(0);
  });

  it("counts numbers at risk (follow-up ≥ t)", () => {
    expect(numberAtRisk(DATA, [0, 1, 2.5, 5, 6])).toEqual([5, 5, 3, 1, 0]);
  });

  it("builds plot points starting at (0,1) and extending to last follow-up", () => {
    const pts = kmPlotPoints(kaplanMeier(DATA));
    expect(pts[0]).toEqual({ time: 0, survival: 1 });
    expect(pts[pts.length - 1].time).toBe(5);
  });
});

describe("rmst", () => {
  it("integrates the KM step function up to tau", () => {
    const km = kaplanMeier(DATA);
    // 1×1 + 0.8×2 + 0.5333×1 + 0.2667×1 = 3.4
    expect(rmst(km, 5)).toBeCloseTo(1 + 1.6 + 8 / 15 + 4 / 15, 10);
    expect(rmst(km, 0.5)).toBeCloseTo(0.5);
    expect(rmst(km, 2)).toBeCloseTo(1 + 0.8);
  });
});
