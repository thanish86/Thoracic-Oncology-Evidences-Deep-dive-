"use client";

import { useMemo, useState } from "react";
import { ForestPlot, type ForestRow } from "@/components/charts/forest-plot";
import { interactionTest } from "@/lib/stats/normal";
import { SliderField, Stat } from "./controls";
import { SyntheticBadge, fmt, fmtP } from "./synthetic-badge";

const r2 = (v: number) => Math.round(v * 100) / 100;

/** Build a CI for a ratio from an estimate and an approximate event count (se ≈ 2/√events for 1:1). */
function rowFrom(label: string, sublabel: string, estimate: number, events: number): ForestRow {
  const se = 2 / Math.sqrt(events);
  return { label, sublabel, estimate: r2(estimate), lower: r2(Math.exp(Math.log(estimate) - 1.96 * se)), upper: r2(Math.exp(Math.log(estimate) + 1.96 * se)), measure: "HR" };
}

export function SubgroupForest() {
  const [hrB, setHrB] = useState(0.95);
  const [eventsB, setEventsB] = useState(80);

  const { rows, test } = useMemo(() => {
    const a = rowFrom("Biomarker-positive", "synthetic · 220 events", 0.62, 220);
    const b = rowFrom("Biomarker-negative", `synthetic · ${eventsB} events`, hrB, eventsB);
    const rows: ForestRow[] = [
      rowFrom("Overall", "synthetic · 300 events", 0.72, 300),
      rowFrom("Age < 65", "synthetic · 160 events", 0.7, 160),
      rowFrom("Age ≥ 65", "synthetic · 140 events", 0.76, 140),
      a,
      b,
      rowFrom("Region 1", "synthetic · 90 events", 0.58, 90),
      rowFrom("Region 2", "synthetic · 210 events", 0.79, 210),
    ];
    return { rows, test: interactionTest(a, b) };
  }, [hrB, eventsB]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-serif text-lg text-ink">Forest plot &amp; interaction test</h3>
        <SyntheticBadge />
      </div>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <fieldset className="space-y-4">
          <legend className="mb-2 text-[13px] text-ink-2">Adjust the biomarker-negative subgroup:</legend>
          <SliderField label="HR in biomarker-negative" value={hrB} onChange={setHrB} min={0.4} max={1.4} step={0.01} format={(v) => v.toFixed(2)} />
          <SliderField label="Events in biomarker-negative" value={eventsB} onChange={setEventsB} min={20} max={300} step={10} />
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Ratio of HRs" value={fmt(test.ratioOfRatios)} sub={`95% CI ${fmt(test.lower)}–${fmt(test.upper)}`} />
            <Stat label="P interaction" value={fmtP(test.p)} sub={`z = ${fmt(test.z)}`} />
          </div>
          <p className="text-[12px] leading-relaxed text-ink-3">
            z = (ln HR₁ − ln HR₂) / √(SE₁² + SE₂²). A “significant” HR in one subgroup and a “non-significant” HR in another is <em>not</em> evidence of a difference — only the interaction test addresses that.
          </p>
        </fieldset>
        <div className="min-w-0">
          <ForestPlot rows={rows} title="Synthetic subgroup analysis (illustrative only)" />
        </div>
      </div>
    </div>
  );
}
