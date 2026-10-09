"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cumulativeIncidence, simulateCompeting } from "@/lib/stats/competing";
import { SliderField, Stat, TOOLTIP_STYLE } from "./controls";
import { SyntheticBadge } from "./synthetic-badge";

export function CompetingRisks() {
  const [rate1, setRate1] = useState(0.02);
  const [rate2, setRate2] = useState(0.04);
  const params = useDeferredValue({ rate1, rate2 });

  const pts = useMemo(() => {
    const cohort = simulateCompeting({ n: 600, rate1: params.rate1, rate2: params.rate2, maxFollowUp: 60, seed: 1729 });
    return cumulativeIncidence(cohort);
  }, [params]);
  const last = pts[pts.length - 1];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-serif text-lg text-ink">Competing risks: 1 − KM vs cumulative incidence</h3>
        <SyntheticBadge />
      </div>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <fieldset className="space-y-4">
          <legend className="sr-only">Cause-specific hazards</legend>
          <SliderField label="Hazard of event of interest (/month)" value={rate1} onChange={setRate1} min={0.005} max={0.08} step={0.005} format={(v) => v.toFixed(3)} hint="e.g. cancer-specific death or local relapse" />
          <SliderField label="Hazard of competing event (/month)" value={rate2} onChange={setRate2} min={0} max={0.1} step={0.005} format={(v) => v.toFixed(3)} hint="e.g. death from other causes" />
          <div className="grid grid-cols-2 gap-2">
            <Stat label="1 − KM at end" value={`${(last.oneMinusKm * 100).toFixed(1)}%`} />
            <Stat label="CIF at end" value={`${(last.cif * 100).toFixed(1)}%`} />
          </div>
          <p className="text-[12px] leading-relaxed text-ink-3">600 synthetic patients, seeded; set the competing hazard to 0 and the two curves coincide.</p>
        </fieldset>
        <div className="h-72 min-w-0" role="img" aria-label={`1 minus Kaplan–Meier reaches ${(last.oneMinusKm * 100).toFixed(1)}% while the Aalen–Johansen cumulative incidence reaches ${(last.cif * 100).toFixed(1)}%`}>
          <ResponsiveContainer>
            <LineChart data={pts} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="time" type="number" domain={[0, 60]} ticks={[0, 12, 24, 36, 48, 60]} tick={{ fontSize: 11, fill: "var(--ink-3)" }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
              <YAxis domain={[0, 1]} tickFormatter={(v: number) => `${Math.round(v * 100)}%`} tick={{ fontSize: 11, fill: "var(--ink-3)" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => (typeof v === "number" ? `${(v * 100).toFixed(1)}%` : String(v))} labelFormatter={(l) => `Month ${Number(l).toFixed(1)}`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line dataKey="oneMinusKm" name="1 − KM (competing events censored) — biased" type="stepAfter" stroke="var(--rose)" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line dataKey="cif" name="Cumulative incidence (Aalen–Johansen)" type="stepAfter" stroke="var(--accent)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
