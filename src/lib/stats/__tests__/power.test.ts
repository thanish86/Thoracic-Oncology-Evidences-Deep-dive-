import { describe, expect, it } from "vitest";
import { patientsForEvents, schoenfeldEvents, schoenfeldPower } from "../power";
import { normCdf, normQuantile, interactionTest } from "../normal";

describe("normal helpers", () => {
  it("inverts the normal CDF", () => {
    expect(normQuantile(0.975)).toBeCloseTo(1.959964, 5);
    expect(normQuantile(0.8)).toBeCloseTo(0.841621, 5);
    expect(normCdf(1.959964)).toBeCloseTo(0.975, 6);
  });
  it("finds no interaction for identical subgroup estimates", () => {
    const r = interactionTest({ estimate: 0.7, lower: 0.5, upper: 0.98 }, { estimate: 0.7, lower: 0.5, upper: 0.98 });
    expect(r.p).toBeCloseTo(1, 6);
    expect(r.ratioOfRatios).toBeCloseTo(1, 10);
  });
});

describe("schoenfeldEvents", () => {
  it("needs ≈380 events for HR 0.75, two-sided α 0.05, 80% power, 1:1", () => {
    const r = schoenfeldEvents({ hr: 0.75, alpha: 0.05, power: 0.8 });
    expect(r.eventsExact).toBeGreaterThan(378);
    expect(r.eventsExact).toBeLessThan(381);
    expect(r.events).toBe(380);
  });
  it("is symmetric in HR vs 1/HR", () => {
    expect(schoenfeldEvents({ hr: 0.75, alpha: 0.05, power: 0.8 }).eventsExact).toBeCloseTo(
      schoenfeldEvents({ hr: 1 / 0.75, alpha: 0.05, power: 0.8 }).eventsExact,
      8,
    );
  });
  it("inflates events by 12.5% with 2:1 allocation", () => {
    const a = schoenfeldEvents({ hr: 0.75, alpha: 0.05, power: 0.8 }).eventsExact;
    const b = schoenfeldEvents({ hr: 0.75, alpha: 0.05, power: 0.8, allocationRatio: 2 }).eventsExact;
    expect(b / a).toBeCloseTo(1.125, 8);
  });
  it("round-trips with schoenfeldPower", () => {
    const r = schoenfeldEvents({ hr: 0.7, alpha: 0.05, power: 0.9 });
    expect(schoenfeldPower({ hr: 0.7, alpha: 0.05, events: r.eventsExact })).toBeCloseTo(0.9, 6);
  });
  it("converts events to patients", () => {
    expect(patientsForEvents(380, 0.7)).toBe(543);
  });
  it("rejects HR of 1", () => {
    expect(() => schoenfeldEvents({ hr: 1, alpha: 0.05, power: 0.8 })).toThrow();
  });
});
