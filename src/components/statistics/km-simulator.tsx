"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { CartesianGrid, ComposedChart, Legend, Line, ReferenceLine, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis } from "recharts";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { kaplanMeier, kmMedian, kmPlotPoints, numberAtRisk, survivalAt, type KmCurve, type SurvivalObs } from "@/lib/stats/km";
import { logRank } from "@/lib/stats/logrank";
import { rmst } from "@/lib/stats/rmst";
import { simulateTrial } from "@/lib/stats/simulate";
import { SliderField, Stat, TOOLTIP_STYLE } from "./controls";
import { SyntheticBadge, fmt, fmtP } from "./synthetic-badge";

const ARMS = [
  { key: "experimental", label: "Experimental", color: "var(--accent)" },
  { key: "control", label: "Control", color: "var(--rose)" },
] as const;

function censorMarks(obs: SurvivalObs[], curve: KmCurve) {
  return obs.filter((o) => !o.event).map((o) => ({ time: o.time, survival: survivalAt(curve, o.time) }));
}

export function KmSimulator() {
  const [controlMedian, setControlMedian] = useState(12);
  const [hr, setHr] = useState(0.7);
  const [nPerArm, setNPerArm] = useState(150);
  const [accrual, setAccrual] = useState(18);
  const [followUp, setFollowUp] = useState(18);
  const [seed, setSeed] = useState(2026);
  const [tauRaw, setTau] = useState(24);

  const params = useDeferredValue({ controlMedian, hr, nPerArm, accrual, followUp, seed });
  const maxT = accrual + followUp;
  const tau = Math.min(tauRaw, maxT);

  const result = useMemo(() => {
    const sim = simulateTrial(params);
    const kmE = kaplanMeier(sim.experimental);
    const kmC = kaplanMeier(sim.control);
    const lr = logRank(sim.experimental, sim.control);
    const tickStep = sim.analysisTime > 36 ? 12 : 6;
    const ticks: number[] = [];
    for (let t = 0; t <= sim.analysisTime; t += tickStep) ticks.push(t);
    return {
      sim,
      kmE,
      kmC,
      lr,
      ticks,
      ptsE: kmPlotPoints(kmE),
      ptsC: kmPlotPoints(kmC),
      censE: censorMarks(sim.experimental, kmE),
      censC: censorMarks(sim.control, kmC),
      riskE: numberAtRisk(sim.experimental, ticks),
      riskC: numberAtRisk(sim.control, ticks),
    };
  }, [params]);

  const rmstE = rmst(result.kmE, tau);
  const rmstC = rmst(result.kmC, tau);
  const medE = kmMedian(result.kmE);
  const medC = kmMedian(result.kmC);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-serif text-lg text-ink">Kaplan–Meier simulator</h3>
        <SyntheticBadge />
      </div>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <fieldset className="space-y-4">
          <legend className="sr-only">Simulation parameters</legend>
          <SliderField label="Control median (months)" value={controlMedian} onChange={setControlMedian} min={3} max={36} step={1} />
          <SliderField label="True hazard ratio" value={hr} onChange={setHr} min={0.4} max={1.5} step={0.05} format={(v) => v.toFixed(2)} hint="Experimental vs control; < 1 favours experimental." />
          <SliderField label="Patients per arm" value={nPerArm} onChange={setNPerArm} min={25} max={500} step={25} />
          <SliderField label="Accrual period (months)" value={accrual} onChange={setAccrual} min={3} max={36} step={1} />
          <SliderField label="Follow-up after last patient (months)" value={followUp} onChange={setFollowUp} min={3} max={48} step={1} hint="Administrative censoring at accrual + follow-up." />
          <SliderField label="RMST horizon τ (months)" value={tau} onChange={setTau} min={1} max={maxT} step={1} />
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" onClick={() => setSeed((s) => (s * 48271 + 1) % 2147483647)}>
              <Shuffle className="h-3.5 w-3.5" aria-hidden /> New random seed
            </Button>
            <span className="tabular text-[11px] text-ink-3">seed {seed}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-ink-3">
            Exponential survival times from a seeded mulberry32 generator; uniform entry over the accrual period. Same seed → same dataset.
          </p>
        </fieldset>

        <div className="min-w-0">
          <div
            className="h-72 w-full"
            role="img"
            aria-label={`Synthetic Kaplan–Meier curves. Experimental median ${medE == null ? "not reached" : medE.toFixed(1) + " months"}, control median ${medC == null ? "not reached" : medC.toFixed(1) + " months"}; log-rank P ${fmtP(result.lr.p)}.`}
          >
            <ResponsiveContainer>
              <ComposedChart margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="time"
                  type="number"
                  domain={[0, result.sim.analysisTime]}
                  ticks={result.ticks}
                  tick={{ fontSize: 11, fill: "var(--ink-3)" }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                  label={{ value: "Months", position: "insideBottomRight", offset: -2, fontSize: 11, fill: "var(--ink-3)" }}
                />
                <YAxis domain={[0, 1]} ticks={[0, 0.25, 0.5, 0.75, 1]} tickFormatter={(v: number) => `${Math.round(v * 100)}%`} tick={{ fontSize: 11, fill: "var(--ink-3)" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(v) => (typeof v === "number" ? `${(v * 100).toFixed(1)}%` : String(v))}
                  labelFormatter={(l) => `Month ${Number(l).toFixed(1)}`}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine y={0.5} stroke="var(--border-strong)" strokeDasharray="3 3" />
                <ReferenceLine x={tau} stroke="var(--lavender)" strokeDasharray="4 3" label={{ value: "τ", fontSize: 11, fill: "var(--lavender)", position: "top" }} />
                <Line data={result.ptsE} dataKey="survival" name="Experimental" type="stepAfter" stroke={ARMS[0].color} strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line data={result.ptsC} dataKey="survival" name="Control" type="stepAfter" stroke={ARMS[1].color} strokeWidth={2} dot={false} isAnimationActive={false} />
                <Scatter data={result.censE} dataKey="survival" name="Censored (exp.)" fill={ARMS[0].color} shape="cross" legendType="none" isAnimationActive={false} />
                <Scatter data={result.censC} dataKey="survival" name="Censored (ctrl)" fill={ARMS[1].color} shape="cross" legendType="none" isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[420px] text-[12px]">
              <caption className="mb-1 text-left text-[11px] font-medium uppercase tracking-wide text-ink-3">Number at risk</caption>
              <thead>
                <tr>
                  <th scope="col" className="pr-2 text-left font-medium text-ink-3">Month</th>
                  {result.ticks.map((t) => (
                    <th key={t} scope="col" className="tabular px-1 text-right font-medium text-ink-3">{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Experimental", color: ARMS[0].color, row: result.riskE },
                  { label: "Control", color: ARMS[1].color, row: result.riskC },
                ].map((r) => (
                  <tr key={r.label}>
                    <th scope="row" className="pr-2 text-left font-medium" style={{ color: r.color }}>{r.label}</th>
                    {r.row.map((n, i) => (
                      <td key={i} className="tabular px-1 text-right text-ink-2">{n}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Stat label="Events (exp / ctrl)" value={`${result.kmE.totalEvents} / ${result.kmC.totalEvents}`} sub={`${result.kmE.totalEvents + result.kmC.totalEvents} total`} />
            <Stat label="Median (exp / ctrl)" value={`${medE == null ? "NR" : medE.toFixed(1)} / ${medC == null ? "NR" : medC.toFixed(1)}`} sub="months; NR = not reached" />
            <Stat label="Log-rank" value={`P ${fmtP(result.lr.p)}`} sub={`χ² = ${fmt(result.lr.chiSquare)} (1 df)`} />
            <Stat label="HR (Peto O−E)" value={fmt(result.lr.hrPeto)} sub={`95% CI ${fmt(result.lr.hrPetoLower)}–${fmt(result.lr.hrPetoUpper)}`} />
            <Stat label="HR (O/E ratio)" value={fmt(result.lr.hrOE)} sub={`O/E exp ${fmt(result.lr.observedA, 0)}/${fmt(result.lr.expectedA, 1)}`} />
            <Stat label={`RMST to ${tau} mo`} value={`${fmt(rmstE, 1)} vs ${fmt(rmstC, 1)}`} sub={`Δ ${fmt(rmstE - rmstC, 1)} months`} />
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
            Try it: shrink the sample to 50 per arm and re-seed — the observed HR and P value swing widely around the true HR. Shorten follow-up and watch medians become “not reached” while RMST remains estimable.
          </p>
        </div>
      </div>
    </div>
  );
}
