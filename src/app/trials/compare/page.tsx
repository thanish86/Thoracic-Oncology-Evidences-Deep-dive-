import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Info, Scale } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/ui/primitives";
import { ComparePicker } from "@/components/trials/compare-picker";
import { EvidenceStatusBadge } from "@/components/evidence/status-badge";
import { assessComparability } from "@/lib/compare";
import { ENDPOINT_LABEL, SAFETY_LABEL, labelFor } from "@/lib/labels";
import { cn, formatEstimate, PHASE_LABEL, RESULT_LABEL } from "@/lib/utils";
import { compareSchema, type SearchParams } from "@/server/services/filters";
import { getTrialsForCompare, listTrialOptions, type TrialDetail } from "@/server/services/trials";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Compare trials" };

function firstAnalysis(t: TrialDetail, code?: string, primaryOnly = false) {
  for (const e of t.endpoints) {
    if (code && e.code !== code) continue;
    if (primaryOnly && !e.isPrimary) continue;
    for (const o of e.outcomes) {
      const a = o.analyses[0];
      if (a) return { e, o, a };
    }
  }
  return null;
}

function Cell({ r }: { r: ReturnType<typeof firstAnalysis> }) {
  if (!r) return <span className="text-ink-3">Not extracted</span>;
  const est = formatEstimate(r.a.effectMeasure, r.a.effectEstimate, r.a.ciLower, r.a.ciUpper, r.a.ciLevel);
  return (
    <div className="space-y-0.5 tabular">
      <p className="text-xs text-ink-3">{r.e.code} · {r.o.population} · {r.a.analysisLabel}</p>
      {(r.a.experimentalValue || r.a.controlValue) && <p className="text-ink">{r.a.experimentalValue ?? "—"} vs {r.a.controlValue ?? "—"}</p>}
      {est && <p className="text-ink">{est}</p>}
      {r.a.pValue && <p className="text-xs text-ink-2">P {r.a.pValue.startsWith("<") || r.a.pValue.startsWith(">") ? r.a.pValue : `= ${r.a.pValue}`}</p>}
    </div>
  );
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const parsed = compareSchema.safeParse(await searchParams);
  const ids = parsed.success ? [...new Set(parsed.data.ids)] : [];
  const [options, trials] = await Promise.all([listTrialOptions(), getTrialsForCompare(ids)]);

  const warnings = assessComparability(
    trials.map((t) => ({
      acronym: t.acronym, disease: t.cancerType.shortName, setting: t.setting, lineOfTherapy: t.lineOfTherapy, stages: t.stages,
      biomarkers: t.biomarkers.map((b) => b.biomarkerSlug), comparator: t.picoComparator, phase: t.phase,
      randomised: t.design?.randomised, primaryEndpoints: t.endpoints.filter((e) => e.isPrimary).map((e) => e.code), year: t.yearOfPrimaryPublication,
    })),
  );

  const rows: { label: string; render: (t: TrialDetail) => React.ReactNode }[] = [
    { label: "Disease", render: (t) => t.cancerType.shortName },
    { label: "Design", render: (t) => `${PHASE_LABEL[t.phase]}${t.design ? (t.design.randomised ? ", randomised" : ", non-randomised") : ""}${t.design?.blinding ? ` · ${t.design.blinding}` : ""}` },
    { label: "Sample size", render: (t) => (t.design?.sampleSize ? <span className="tabular">{t.design.sampleSize}</span> : <span className="text-ink-3">Not extracted</span>) },
    { label: "Setting / line", render: (t) => `${t.setting}${t.lineOfTherapy ? ` · ${t.lineOfTherapy}` : ""}` },
    { label: "Population", render: (t) => t.picoPopulation },
    { label: "Histology / subtype", render: (t) => t.subtypes.join(" · ") || "—" },
    { label: "Biomarker selection", render: (t) => t.biomarkers.map((b) => b.biomarker?.name ?? b.biomarkerSlug).join(", ") || "Unselected" },
    { label: "Experimental regimen", render: (t) => t.arms.filter((a) => a.role !== "CONTROL").map((a) => a.dosing ? `${a.regimen} (${a.dosing})` : a.regimen).join("; ") },
    { label: "Comparator", render: (t) => t.picoComparator },
    { label: "Primary endpoint(s)", render: (t) => t.endpoints.filter((e) => e.isPrimary).map((e) => labelFor(ENDPOINT_LABEL, e.code)).join(", ") || "Not extracted" },
    { label: "Primary endpoint result", render: (t) => <Cell r={firstAnalysis(t, undefined, true)} /> },
    { label: "Overall survival (first extracted analysis)", render: (t) => <Cell r={firstAnalysis(t, "OS")} /> },
    {
      label: "Grade ≥3 toxicity",
      render: (t) => {
        const s = t.safety.find((x) => x.category === "GRADE3PLUS");
        return s ? <span className="tabular">{s.description}: {s.experimentalValue ?? "—"} vs {s.controlValue ?? "—"}</span> : <span className="text-ink-3">Not extracted</span>;
      },
    },
    {
      label: "Other safety",
      render: (t) => t.safety.filter((x) => x.category !== "GRADE3PLUS").slice(0, 2).map((s) => `${labelFor(SAFETY_LABEL, s.category)}: ${s.experimentalValue ?? "—"} vs ${s.controlValue ?? "—"}`).join("; ") || "—",
    },
    { label: "Result", render: (t) => RESULT_LABEL[t.result] },
    { label: "Publication", render: (t) => { const p = t.publications[0]?.sourceDocument; return p ? `${p.journal} ${p.year}` : "—"; } },
    { label: "Evidence status", render: (t) => <EvidenceStatusBadge status={t.evidenceStatus} /> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Evidence comparison engine"
        title="Compare trials"
        description="Place two to five trials side by side. ONCOATLAS lays out design, population and sourced outcomes, and flags every reason the comparison is indirect or scientifically non-equivalent. It never ranks treatments across unrelated trials."
      />
      <ComparePicker options={options} selected={trials.map((t) => t.slug)} />

      {trials.length < 2 ? (
        <div className="mt-8">
          <EmptyState icon={<Scale className="h-6 w-6" />} title="Select at least two trials to compare">
            Try <Link className="text-accent hover:underline" href="/trials/compare?ids=keynote-024,keynote-189">KEYNOTE-024 vs KEYNOTE-189</Link> — two
            first-line NSCLC immunotherapy trials with different PD-L1 selection and control arms.
          </EmptyState>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-2" role="region" aria-label="Comparability warnings">
            {warnings.map((w, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed",
                  w.level === "critical" ? "border-danger/30 bg-rose-soft text-ink" : w.level === "caution" ? "border-sand/40 bg-sand-soft text-ink-2" : "border-blue/30 bg-blue-soft text-ink-2",
                )}
              >
                {w.level === "info" ? <Info className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
                <p>{w.message}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="w-full text-left text-sm" style={{ minWidth: 220 + trials.length * 240 }}>
              <thead className="border-b border-border bg-surface-2/60">
                <tr>
                  <th scope="col" className="sticky left-0 w-52 bg-surface-2 px-4 py-3 text-xs font-medium text-ink-3">Field</th>
                  {trials.map((t) => (
                    <th key={t.slug} scope="col" className="px-4 py-3 align-bottom">
                      <Link href={`/trials/${t.slug}`} className="font-serif text-lg text-ink hover:text-accent">{t.acronym}</Link>
                      <p className="text-xs font-normal text-ink-3">{t.yearOfPrimaryPublication}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-border/70 align-top last:border-0">
                    <th scope="row" className="sticky left-0 bg-surface px-4 py-3 text-xs font-medium text-ink-3">{r.label}</th>
                    {trials.map((t) => <td key={t.slug} className="px-4 py-3 text-ink-2">{r.render(t)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
