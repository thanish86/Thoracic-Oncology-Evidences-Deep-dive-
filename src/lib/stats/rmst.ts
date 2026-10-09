/** Restricted mean survival time: the area under the Kaplan–Meier curve from 0 to τ. */
import type { KmCurve } from "./km";

export function rmst(curve: KmCurve, tau: number): number {
  if (!(tau > 0)) return 0;
  let area = 0;
  let prevT = 0;
  let s = 1;
  for (const step of curve.steps) {
    if (step.events === 0) continue;
    if (step.time >= tau) break;
    area += s * (step.time - prevT);
    prevT = step.time;
    s = step.survival;
  }
  area += s * (tau - prevT);
  return area;
}
