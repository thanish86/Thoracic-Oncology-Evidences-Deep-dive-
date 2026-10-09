"use client";

import { useState } from "react";
import { classifyNonInferiority, type NiConclusion } from "@/lib/stats/noninferiority";
import { cn } from "@/lib/utils";
import { SliderField } from "./controls";
import { SyntheticBadge } from "./synthetic-badge";

const TONE: Record<NiConclusion, string> = {
  superior: "bg-sage-soft text-success",
  "non-inferior": "bg-blue-soft text-accent",
  inconclusive: "bg-sand-soft text-warning",
  inferior: "bg-rose-soft text-danger",
};

export function NiVisualiser() {
  const [estimate, setEstimate] = useState(1.02);
  const [halfWidth, setHalfWidth] = useState(0.15);
  const [margin, setMargin] = useState(1.25);

  // symmetric on the log scale
  const lower = Math.exp(Math.log(estimate) - halfWidth);
  const upper = Math.exp(Math.log(estimate) + halfWidth);
  const res = classifyNonInferiority({ lower, upper, margin });

  const W = 520;
  const lmin = Math.log(0.5);
  const lmax = Math.log(2);
  const x = (v: number) => 20 + ((Math.log(Math.min(Math.max(v, 0.5), 2)) - lmin) / (lmax - lmin)) * (W - 40);
  const ticks = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-serif text-lg text-ink">Non-inferiority margin visualiser</h3>
        <SyntheticBadge />
      </div>
      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <fieldset className="space-y-4">
          <legend className="sr-only">Hypothetical trial result</legend>
          <SliderField label="Observed HR" value={estimate} onChange={setEstimate} min={0.6} max={1.6} step={0.01} format={(v) => v.toFixed(2)} />
          <SliderField label="CI half-width (log scale)" value={halfWidth} onChange={setHalfWidth} min={0.03} max={0.4} step={0.01} format={(v) => v.toFixed(2)} hint="Wider = fewer events / less precision." />
          <SliderField label="Non-inferiority margin (HR)" value={margin} onChange={setMargin} min={1.05} max={1.6} step={0.01} format={(v) => v.toFixed(2)} />
        </fieldset>
        <div className="min-w-0">
          <svg viewBox={`0 0 ${W} 120`} className="w-full" role="img" aria-label={`HR ${estimate.toFixed(2)}, 95% CI ${lower.toFixed(2)}–${upper.toFixed(2)}, margin ${margin.toFixed(2)}: ${res.conclusion}`}>
            <rect x={x(margin)} y={10} width={x(2) - x(margin)} height={70} fill="var(--rose-soft)" />
            <text x={x(margin) + 6} y={24} fontSize={10} fill="var(--danger)">Beyond margin</text>
            <line x1={x(1)} x2={x(1)} y1={6} y2={84} stroke="var(--ink-3)" strokeDasharray="3 3" />
            <line x1={x(margin)} x2={x(margin)} y1={6} y2={84} stroke="var(--danger)" strokeWidth={1.5} />
            <text x={x(margin)} y={100} textAnchor="middle" fontSize={10} fill="var(--danger)">M = {margin.toFixed(2)}</text>
            <line x1={x(lower)} x2={x(upper)} y1={50} y2={50} stroke="var(--ink)" strokeWidth={2} />
            <line x1={x(lower)} x2={x(lower)} y1={43} y2={57} stroke="var(--ink)" strokeWidth={2} />
            <line x1={x(upper)} x2={x(upper)} y1={43} y2={57} stroke="var(--ink)" strokeWidth={2} />
            <rect x={x(estimate) - 6} y={44} width={12} height={12} fill="var(--accent)" />
            {ticks.map((t) => (
              <text key={t} x={x(t)} y={116} textAnchor="middle" fontSize={10} fill="var(--ink-3)">{t}</text>
            ))}
            <text x={x(1) - 6} y={20} textAnchor="end" fontSize={10} fill="var(--ink-3)">← favours experimental</text>
          </svg>
          <p className="tabular mt-1 text-[13px] text-ink-2">
            HR {estimate.toFixed(2)} (95% CI {lower.toFixed(2)}–{upper.toFixed(2)})
          </p>
          <div className="mt-3 rounded-xl border border-border p-3" aria-live="polite">
            <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[12px] font-semibold capitalize", TONE[res.conclusion])}>{res.conclusion}</span>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{res.explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
