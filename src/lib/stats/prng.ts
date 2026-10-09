/**
 * Deterministic pseudo-random number generation for teaching simulations.
 * Same seed → same synthetic dataset, so screenshots and explanations stay reproducible.
 */

export type Rng = () => number;

/** mulberry32: small, fast 32-bit PRNG returning floats in [0, 1). */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Uniform draw on [min, max). */
export function uniform(rng: Rng, min = 0, max = 1): number {
  return min + (max - min) * rng();
}

/** Exponential draw with the given rate (events per unit time) via inverse-CDF sampling. */
export function exponential(rng: Rng, rate: number): number {
  if (!(rate > 0)) throw new RangeError("rate must be > 0");
  // 1 - u lies in (0, 1], so the log is always finite.
  return -Math.log(1 - rng()) / rate;
}

/** Exponential rate implied by a median survival time: λ = ln 2 / median. */
export function rateFromMedian(median: number): number {
  if (!(median > 0)) throw new RangeError("median must be > 0");
  return Math.LN2 / median;
}
