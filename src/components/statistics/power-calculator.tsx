"use client";

import { useMemo, useState } from "react";
import { patientsForEvents, schoenfeldEvents } from "@/lib/stats/power";
import { SliderField, Stat } from "./controls";

export function PowerCalculator() {
  const [hr, setHr] = useState(0.75);
  const [alpha, setAlpha] = useState(0.05);
  const [power, setPower] = useState(0.8);
  const [ratio, setRatio] = useState(1);
  const [eventProb, setEventProb] = useState(0.7);

  const r = useMemo(() => (hr === 1 ? null : schoenfeldEvents({ hr, alpha, power, allocationRatio: ratio })), [hr, alpha, power, ratio]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-5">
      <h3 className="mb-4 font-serif text-lg text-ink">Events-driven power calculator (Schoenfeld)</h3>
      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <fieldset className="space-y-4">
          <legend className="sr-only">Design assumptions</legend>
          <SliderField label="Target hazard ratio" value={hr} onChange={setHr} min={0.4} max={0.95} step={0.01} format={(v) => v.toFixed(2)} />
          <SliderField label="Two-sided α" value={alpha} onChange={setAlpha} min={0.01} max={0.1} step={0.005} format={(v) => v.toFixed(3)} />
          <SliderField label="Power (1 − β)" value={power} onChange={setPower} min={0.5} max={0.99} step={0.01} format={(v) => `${Math.round(v * 100)}%`} />
          <SliderField label="Allocation (experimental : control)" value={ratio} onChange={setRatio} min={1} max={3} step={0.5} format={(v) => `${v}:1`} />
          <SliderField label="Expected proportion with event at analysis" value={eventProb} onChange={setEventProb} min={0.2} max={1} step={0.05} format={(v) => `${Math.round(v * 100)}%`} hint="Used only to translate events into patients." />
        </fieldset>
        <div className="min-w-0 space-y-4">
          <div className="rounded-xl bg-surface-2 px-4 py-3 font-mono text-[13px] text-ink" aria-label="Schoenfeld formula">
            D = (z<sub>1−α/2</sub> + z<sub>1−β</sub>)² / [ p(1−p) · (ln HR)² ]
          </div>
          {r && (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Stat label="Required events" value={r.events} sub={`exact ${r.eventsExact.toFixed(1)}`} />
                <Stat label="Patients (approx.)" value={patientsForEvents(r.events, eventProb)} sub={`if ${Math.round(eventProb * 100)}% have an event`} />
                <Stat label="z values" value={`${r.zAlpha.toFixed(3)} + ${r.zBeta.toFixed(3)}`} sub={`p = ${r.p.toFixed(3)}; ln HR = ${Math.log(hr).toFixed(3)}`} />
              </div>
              <p className="text-[13px] leading-relaxed text-ink-2">
                Power in a time-to-event trial is driven by the number of <strong>events</strong>, not patients. Halving the log-HR roughly quadruples the events needed; moving from 1:1 to 2:1 randomisation costs ≈12.5% more events. Check: HR 0.75, two-sided α 0.05, 80% power, 1:1 → ≈380 events.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
