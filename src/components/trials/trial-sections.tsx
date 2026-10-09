import Link from "next/link";
import { ExternalLink, FileText, Quote } from "lucide-react";
import { Badge, Card, EmptyState, KeyValue, Notice } from "@/components/ui/primitives";
import { EvidenceStatusBadge } from "@/components/evidence/status-badge";
import { ForestPlot, type ForestRow } from "@/components/charts/forest-plot";
import { CLASS_LABEL, ENDPOINT_LABEL, PUBLICATION_TYPE_LABEL, SAFETY_LABEL, STAGE_LABEL, labelFor } from "@/lib/labels";
import { cn, doiUrl, formatEstimate, PHASE_LABEL, pubmedUrl, registryUrl, RESULT_LABEL } from "@/lib/utils";
import type { TrialDetail } from "@/server/services/trials";

type Source = TrialDetail["publications"][number]["sourceDocument"];

export function SourceLink({ source, location }: { source: Source; location?: string }) {
  const href = source.pmid ? pubmedUrl(source.pmid) : source.doi ? doiUrl(source.doi) : source.url ?? undefined;
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-xs text-accent hover:underline">
      {source.pmid ? `PMID ${source.pmid}` : source.doi}
      {location && <span className="text-ink-3">· {location}</span>}
      <ExternalLink className="h-3 w-3" aria-hidden />
    </a>
  );
}

export function SourceQuote({ quote }: { quote: string }) {
  return (
    <details className="group mt-1.5">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-[11px] text-ink-3 hover:text-ink">
        <Quote className="h-3 w-3" aria-hidden /> Source quote
      </summary>
      <blockquote className="mt-1.5 rounded-lg border-l-2 border-accent/50 bg-surface-2 px-3 py-2 font-serif text-[13px] italic leading-relaxed text-ink-2">
        “{quote}”
      </blockquote>
    </details>
  );
}

function Prose({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">{title}</h3>
      {children}
    </section>
  );
}

function Editorial({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="prose-atlas font-serif text-[16px]">{children}</div>
      <p className="mt-3 text-[11px] text-ink-3">Editorial synthesis — awaiting expert review. Not a substitute for the primary source.</p>
    </div>
  );
}

// ───────────────────────── Tab 1: Overview ─────────────────────────
export function OverviewTab({ t }: { t: TrialDetail }) {
  const registries = t.registryIds as { registry: string; id: string }[];
  const primary = t.publications.find((p) => p.type === "PRIMARY") ?? t.publications[0];
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <Prose title="Historical clinical question">
          <p className="font-serif text-xl leading-relaxed text-ink">{t.clinicalQuestion}</p>
        </Prose>
        <Prose title="Study identification">
          <dl>
            <KeyValue label="Official title">{t.officialTitle}</KeyValue>
            <KeyValue label="Acronym">{t.acronym}</KeyValue>
            <KeyValue label="Phase">{PHASE_LABEL[t.phase]}</KeyValue>
            <KeyValue label="Sponsor">{t.sponsor}</KeyValue>
            <KeyValue label="Registration">
              {registries.length ? (
                <span className="flex flex-wrap gap-2">
                  {registries.map((r) => {
                    const href = registryUrl(r.registry, r.id);
                    return href ? (
                      <a key={r.id} href={href} target="_blank" rel="noreferrer noopener" className="text-accent hover:underline">{r.id}</a>
                    ) : (
                      <span key={r.id}>{r.registry} {r.id}</span>
                    );
                  })}
                </span>
              ) : null}
            </KeyValue>
            <KeyValue label="Primary publication">
              {primary && (
                <span>
                  {primary.sourceDocument.firstAuthor ? `${primary.sourceDocument.firstAuthor} et al. ` : ""}
                  <em>{primary.sourceDocument.journal}</em> {primary.sourceDocument.year}. <SourceLink source={primary.sourceDocument} />
                </span>
              )}
            </KeyValue>
            <KeyValue label="Disease setting">{t.setting}{t.lineOfTherapy ? ` · ${t.lineOfTherapy}` : ""}</KeyValue>
            <KeyValue label="Stage">{t.stages.map((s) => labelFor(STAGE_LABEL, s)).join(", ")}</KeyValue>
            <KeyValue label="Subtype / biomarker">{t.subtypes.length ? t.subtypes.join(" · ") : null}</KeyValue>
            <KeyValue label="Primary endpoint result">{RESULT_LABEL[t.result]}</KeyValue>
          </dl>
        </Prose>
      </div>
      <aside className="space-y-4">
        <Card className="p-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Evidence provenance</p>
          <EvidenceStatusBadge status={t.evidenceStatus} />
          <dl className="mt-4 space-y-2 text-xs text-ink-2">
            <div><dt className="inline text-ink-3">Curated by: </dt><dd className="inline">{t.curatedBy}</dd></div>
            <div><dt className="inline text-ink-3">Curated: </dt><dd className="inline">{t.curatedAt.toISOString().slice(0, 10)}</dd></div>
            <div><dt className="inline text-ink-3">Human review: </dt><dd className="inline">{t.reviewedBy ?? "Not yet reviewed"}</dd></div>
            <div><dt className="inline text-ink-3">Publications linked: </dt><dd className="inline">{t.publications.length}</dd></div>
          </dl>
          {t.curationNotes && <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-ink-3">{t.curationNotes}</p>}
        </Card>
        <Card className="p-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Linked entities</p>
          <div className="flex flex-wrap gap-1.5">
            {t.biomarkers.map((b) =>
              b.biomarker ? (
                <Link key={b.biomarkerSlug} href={`/biomarkers/${b.biomarkerSlug}`}><Badge tone="lavender">{b.biomarker.name}</Badge></Link>
              ) : (
                <Badge key={b.biomarkerSlug}>{b.biomarkerSlug}</Badge>
              ),
            )}
            {t.drugs.map((d) =>
              d.drug ? (
                <Link key={d.drugSlug} href={`/drugs/${d.drugSlug}`}><Badge tone="blue">{d.drug.name}</Badge></Link>
              ) : (
                <Badge key={d.drugSlug}>{d.drugSlug}</Badge>
              ),
            )}
            {t.treatmentClasses.map((c) => <Badge key={c}>{labelFor(CLASS_LABEL, c)}</Badge>)}
          </div>
        </Card>
      </aside>
    </div>
  );
}

// ───────────────────────── Tab 2: PICO ─────────────────────────────
export function PicoTab({ t }: { t: TrialDetail }) {
  const items = [
    { k: "P", label: "Population", text: t.picoPopulation, tone: "bg-blue-soft" },
    { k: "I", label: "Intervention", text: t.picoIntervention, tone: "bg-sage-soft" },
    { k: "C", label: "Comparator", text: t.picoComparator, tone: "bg-lavender-soft" },
    { k: "O", label: "Outcomes", text: t.picoOutcomes, tone: "bg-rose-soft" },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((i) => (
        <Card key={i.k} className="p-6">
          <div className="mb-3 flex items-center gap-3">
            <span className={cn("grid h-9 w-9 place-items-center rounded-xl font-serif text-lg text-ink", i.tone)}>{i.k}</span>
            <span className="text-sm font-medium text-ink">{i.label}</span>
          </div>
          <p className="text-[15px] leading-relaxed text-ink-2">{i.text}</p>
        </Card>
      ))}
    </div>
  );
}

// ───────────────────────── Tab 3: Design ───────────────────────────
export function DesignTab({ t }: { t: TrialDetail }) {
  const d = t.design;
  const endpoints = t.endpoints;
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <Prose title="Trial schema">
          <TrialSchema t={t} />
        </Prose>
        <Prose title="Design parameters">
          <dl>
            <KeyValue label="Randomised">{d ? (d.randomised ? "Yes" : "No (single-arm or non-randomised)") : null}</KeyValue>
            <KeyValue label="Blinding">{d?.blinding}</KeyValue>
            <KeyValue label="Sample size">
              {d?.sampleSize ? (
                <span>
                  <span className="tabular">{d.sampleSize}</span>
                  {d.sampleSizeSourceQuote && <SourceQuote quote={d.sampleSizeSourceQuote} />}
                </span>
              ) : null}
            </KeyValue>
            <KeyValue label="Stratification">{d?.stratification}</KeyValue>
            <KeyValue label="Power / alpha">{d?.statisticalPower || d?.alpha ? [d?.statisticalPower, d?.alpha].filter(Boolean).join(" · ") : null}</KeyValue>
            <KeyValue label="Interim analyses">{d?.interimAnalyses}</KeyValue>
            <KeyValue label="Crossover">{d?.crossover}</KeyValue>
            <KeyValue label="Notes">{d?.notes}</KeyValue>
          </dl>
        </Prose>
      </div>
      <div>
        <Prose title="Endpoint hierarchy (as extracted)">
          {endpoints.length ? (
            <ol className="space-y-2">
              {endpoints.map((e) => (
                <li key={e.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm">
                  <Badge tone={e.isPrimary ? "blue" : "neutral"}>{e.isPrimary ? "Primary" : "Secondary"}</Badge>
                  <span className="text-ink">{e.label === e.code ? labelFor(ENDPOINT_LABEL, e.code) : e.label}</span>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState title="No endpoint values extracted yet" />
          )}
        </Prose>
        <Notice title="Eligibility criteria, power calculation and alpha-spending">
          These fields are populated only from the protocol, statistical analysis plan or registry record once retrieved. Blank fields mean “not yet
          extracted”, not “not reported”.
        </Notice>
      </div>
    </div>
  );
}

export function TrialSchema({ t }: { t: TrialDetail }) {
  const randomised = t.design?.randomised ?? t.arms.length > 1;
  return (
    <div className="rounded-2xl border border-border bg-surface p-5" role="img" aria-label={`Schema: ${t.picoPopulation} ${randomised ? "randomised to" : "treated with"} ${t.arms.map((a) => a.label).join(" or ")}`}>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="rounded-xl bg-blue-soft px-4 py-3 text-sm text-ink sm:w-48">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-3">Population</p>
          <p className="mt-1 line-clamp-4 text-[13px] leading-snug">{t.picoPopulation}</p>
        </div>
        <div className="flex items-center justify-center">
          {randomised ? (
            <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink font-serif text-lg text-ink" title="Randomisation">R</span>
          ) : (
            <span className="text-ink-3">→</span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {t.arms.map((a) => (
            <div key={a.id} className={cn("rounded-xl border px-4 py-2.5 text-sm", a.role === "CONTROL" ? "border-border bg-surface-2" : "border-accent/30 bg-accent-soft")}>
              <p className="font-medium text-ink">{a.label}</p>
              <p className="text-xs text-ink-2">{a.dosing ?? a.regimen}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 border-t border-border pt-3 text-xs text-ink-3">Outcomes: {t.picoOutcomes}</p>
    </div>
  );
}

// ───────────────────────── Tab 4: Arms ─────────────────────────────
export function ArmsTab({ t }: { t: TrialDetail }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {t.arms.map((a) => (
          <Card key={a.id} className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-lg text-ink">{a.label}</h3>
              <Badge tone={a.role === "EXPERIMENTAL" ? "blue" : a.role === "CONTROL" ? "neutral" : "lavender"}>{a.role.replace("_", " ").toLowerCase()}</Badge>
            </div>
            <dl>
              <KeyValue label="Regimen">{a.regimen}</KeyValue>
              <KeyValue label="Dose / schedule">
                {a.dosing ? (
                  <span>
                    {a.dosing}
                    {a.doseSourceQuote && <SourceQuote quote={a.doseSourceQuote} />}
                  </span>
                ) : (
                  <span className="text-ink-3">Not extracted — consult protocol / publication</span>
                )}
              </KeyValue>
              <KeyValue label="Patients randomised">{a.n ? <span className="tabular">{a.n}</span> : null}</KeyValue>
            </dl>
          </Card>
        ))}
      </div>
      <Notice tone="warning" title="Dosing provenance">
        Doses are displayed only when copied verbatim from a cited source. ONCOATLAS does not reconstruct doses from memory; verify against the protocol
        and current product labelling before any clinical use.
      </Notice>
    </div>
  );
}

// ───────────────────────── Tab 5: Efficacy ─────────────────────────
export function EfficacyTab({ t }: { t: TrialDetail }) {
  const rows = t.endpoints.flatMap((e) =>
    e.outcomes.flatMap((o) => o.analyses.map((a) => ({ endpoint: e, outcome: o, analysis: a }))),
  );
  if (!rows.length)
    return (
      <EmptyState icon={<FileText className="h-6 w-6" />} title="No efficacy values have been extracted for this trial yet">
        Values appear here only after transcription from a cited source with a verbatim quote.
      </EmptyState>
    );

  const forest: ForestRow[] = rows
    .filter((r) => ["HR", "OR", "RR"].includes(r.analysis.effectMeasure) && r.analysis.effectEstimate != null && r.analysis.ciLower != null && r.analysis.ciUpper != null)
    .map((r) => ({
      label: `${r.endpoint.code} — ${r.outcome.population}`,
      sublabel: `${r.analysis.analysisLabel} · ${r.analysis.sourceDocument.year ?? ""}`,
      estimate: r.analysis.effectEstimate!,
      lower: r.analysis.ciLower!,
      upper: r.analysis.ciUpper!,
      measure: r.analysis.effectMeasure,
    }));

  const [h1, h2] = armHeadings(t);
  return (
    <div className="space-y-8">
      {t.endpoints.map((e) => (
        <section key={e.id}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-xl text-ink">{e.label === e.code ? labelFor(ENDPOINT_LABEL, e.code) : e.label}</h3>
            <Badge tone={e.isPrimary ? "blue" : "neutral"}>{e.isPrimary ? "Primary endpoint" : "Secondary / exploratory"}</Badge>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="w-full min-w-[820px] text-left text-sm">
              <caption className="sr-only">{e.label} results by analysis</caption>
              <thead className="border-b border-border bg-surface-2/60 text-xs text-ink-3">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">Analysis</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Population</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">{h1}</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">{h2}</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Effect (CI)</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">P</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {e.outcomes.flatMap((o) =>
                  o.analyses.map((a) => (
                    <tr key={a.id} className="border-b border-border/70 align-top last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{a.analysisLabel}</p>
                        {(a.followUp || a.dataCutoff) && <p className="text-xs text-ink-3">{[a.followUp && `Follow-up ${a.followUp}`, a.dataCutoff && `Cut-off ${a.dataCutoff}`].filter(Boolean).join(" · ")}</p>}
                        <div className="mt-1.5"><EvidenceStatusBadge status={a.status} /></div>
                      </td>
                      <td className="px-4 py-3 text-ink-2">{o.population}</td>
                      <td className="px-4 py-3 tabular text-ink">
                        {a.experimentalValue ?? "—"}
                        {a.experimentalArm && <p className="text-xs text-ink-3">{a.experimentalArm}</p>}
                      </td>
                      <td className="px-4 py-3 tabular text-ink">
                        {a.controlValue ?? "—"}
                        {a.controlArm && <p className="text-xs text-ink-3">{a.controlArm}</p>}
                      </td>
                      <td className="px-4 py-3 tabular text-ink">{formatEstimate(a.effectMeasure, a.effectEstimate, a.ciLower, a.ciUpper, a.ciLevel) ?? "—"}</td>
                      <td className="px-4 py-3 tabular text-ink-2">{a.pValue ?? "—"}</td>
                      <td className="max-w-[280px] px-4 py-3">
                        <SourceLink source={a.sourceDocument} location={a.sourceLocation} />
                        <SourceQuote quote={a.sourceQuote} />
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      {forest.length > 0 && <ForestPlot rows={forest} title="Reported effect estimates (ratio measures, log scale)" />}
      <Notice title="Kaplan–Meier curves">
        Survival curves are not displayed: ONCOATLAS shows KM figures only when licensed or reconstructable from legitimate individual-patient or
        published numbers-at-risk data. Curves are never reverse-engineered from medians.
      </Notice>
    </div>
  );
}

// ───────────────────────── Tab 6: Safety ───────────────────────────
/** Column headings: "Experimental/Control" only when a control arm exists (e.g. dose-cohort studies use arm labels). */
function armHeadings(t: TrialDetail): [string, string] {
  if (t.arms.some((a) => a.role === "CONTROL")) return ["Experimental", "Control"];
  return [t.arms[0]?.label ?? "Arm 1", t.arms[1]?.label ?? "Arm 2"];
}

export function SafetyTab({ t }: { t: TrialDetail }) {
  if (!t.safety.length)
    return <EmptyState title="No safety values extracted yet">Adverse-event rates are shown only when transcribed from a cited source.</EmptyState>;
  const [h1, h2] = armHeadings(t);
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-border bg-surface-2/60 text-xs text-ink-3">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-medium">Category</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Description</th>
            <th scope="col" className="px-4 py-2.5 font-medium">{h1}</th>
            <th scope="col" className="px-4 py-2.5 font-medium">{h2}</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Source</th>
          </tr>
        </thead>
        <tbody>
          {t.safety.map((s) => (
            <tr key={s.id} className="border-b border-border/70 align-top last:border-0">
              <td className="px-4 py-3"><Badge tone={s.category === "GRADE3PLUS" || s.category === "DEATHS" ? "rose" : "neutral"}>{labelFor(SAFETY_LABEL, s.category)}</Badge></td>
              <td className="px-4 py-3 text-ink">{s.description}<div className="mt-1.5"><EvidenceStatusBadge status={s.status} /></div></td>
              <td className="px-4 py-3 tabular text-ink">{s.experimentalValue ?? "—"}</td>
              <td className="px-4 py-3 tabular text-ink">{s.controlValue ?? "—"}</td>
              <td className="max-w-[280px] px-4 py-3"><SourceLink source={s.sourceDocument} location={s.sourceLocation} /><SourceQuote quote={s.sourceQuote} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ───────────────────────── Tab 7: Subgroups ────────────────────────
export function SubgroupsTab({ t }: { t: TrialDetail }) {
  const rows = t.subgroups.filter((s) => s.effectEstimate != null && s.ciLower != null && s.ciUpper != null);
  return (
    <div className="space-y-4">
      {rows.length ? (
        <ForestPlot
          title="Subgroup estimates (as reported)"
          rows={rows.map((s) => ({ label: `${s.variable}: ${s.level}`, sublabel: s.prespecified ? "Prespecified" : "Exploratory", estimate: s.effectEstimate!, lower: s.ciLower!, upper: s.ciUpper!, measure: s.effectMeasure }))}
        />
      ) : (
        <EmptyState title="No subgroup estimates extracted">
          Subgroup HRs are entered only from tables or text of the cited source. ONCOATLAS never digitises or estimates subgroup values from forest-plot images.
        </EmptyState>
      )}
      <Notice title="Interpreting subgroups">
        Subgroup analyses are typically underpowered and vulnerable to multiplicity. Look for a prespecified hypothesis, a biologically plausible
        rationale, a significant interaction test and replication across trials before acting on an apparent subgroup effect. See the{" "}
        <Link href="/statistics#subgroups" className="text-accent hover:underline">Statistics academy</Link>.
      </Notice>
    </div>
  );
}

// ───────────────────────── Tab 8: Updated analyses ─────────────────
export function UpdatesTab({ t }: { t: TrialDetail }) {
  const pubs = [...t.publications].sort((a, b) => (a.sourceDocument.year ?? 0) - (b.sourceDocument.year ?? 0));
  const multi = t.endpoints.flatMap((e) => e.outcomes.filter((o) => o.analyses.length > 1).map((o) => ({ e, o })));
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <Prose title="Publication history">
        <ol className="relative space-y-5 border-l border-border pl-6">
          {pubs.map((p) => (
            <li key={p.id} className="relative">
              <span className={cn("absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-bg", p.type === "PRIMARY" ? "bg-ink" : "bg-accent")} aria-hidden />
              <p className="text-xs tabular text-ink-3">{p.sourceDocument.publicationDate ?? p.sourceDocument.year}</p>
              <p className="font-medium text-ink">{p.label ?? labelFor(PUBLICATION_TYPE_LABEL, p.type)}</p>
              <p className="text-sm text-ink-2">{p.sourceDocument.title}</p>
              <p className="mt-0.5 text-xs text-ink-3"><em>{p.sourceDocument.journal}</em> · <SourceLink source={p.sourceDocument} /></p>
            </li>
          ))}
        </ol>
      </Prose>
      <Prose title="How results evolved">
        {multi.length ? (
          <div className="space-y-4">
            {multi.map(({ e, o }) => (
              <Card key={o.id} className="p-4">
                <p className="mb-2 text-sm font-medium text-ink">{e.label} · {o.population}</p>
                <ul className="space-y-1.5 text-sm">
                  {o.analyses.map((a) => (
                    <li key={a.id} className="flex flex-wrap justify-between gap-2 tabular">
                      <span className="text-ink-2">{a.analysisLabel} ({a.sourceDocument.year})</span>
                      <span className="text-ink">{formatEstimate(a.effectMeasure, a.effectEstimate, a.ciLower, a.ciUpper) ?? `${a.experimentalValue ?? "—"} vs ${a.controlValue ?? "—"}`}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
            <p className="text-xs text-ink-3">Original analyses are preserved alongside later ones; nothing is overwritten.</p>
          </div>
        ) : (
          <EmptyState title="Only one analysis per endpoint has been extracted">
            Later follow-up publications will appear here as separate, date-specific records when ingested.
          </EmptyState>
        )}
      </Prose>
    </div>
  );
}

// ───────────────────────── Tab 9: Appraisal ────────────────────────
export function AppraisalTab({ t }: { t: TrialDetail }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-3 font-serif text-lg text-ink">Strengths</h3>
          {t.strengths.length ? <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-ink-2">{t.strengths.map((s) => <li key={s}>{s}</li>)}</ul> : <p className="text-sm text-ink-3">Not yet appraised.</p>}
        </Card>
        <Card className="p-6">
          <h3 className="mb-3 font-serif text-lg text-ink">Limitations & risk of bias</h3>
          {t.limitations.length ? <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-ink-2">{t.limitations.map((s) => <li key={s}>{s}</li>)}</ul> : <p className="text-sm text-ink-3">Not yet appraised.</p>}
        </Card>
      </div>
      <Card className="p-6">
        <h3 className="mb-3 font-serif text-lg text-ink">Appraisal checklist</h3>
        <ul className="grid gap-2 text-sm text-ink-2 md:grid-cols-2">
          {[
            "Was the control arm the contemporary standard of care?",
            "Was crossover permitted, and how might it affect OS?",
            "Is the primary endpoint a validated surrogate in this setting?",
            "Were outcomes assessed by blinded independent review?",
            "Is OS mature, or is the benefit inferred from an immature analysis?",
            "Were subgroup claims prespecified with interaction testing?",
            "How generalisable is the population (PS, CNS disease, region)?",
            "Was the analysis ITT, and was multiplicity controlled?",
          ].map((q) => (
            <li key={q} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />{q}</li>
          ))}
        </ul>
      </Card>
      <p className="text-[11px] text-ink-3">Appraisal statements are editorial and awaiting expert review.</p>
    </div>
  );
}

// ───────────────────────── Tab 10: Implications ────────────────────
export function ImplicationsTab({ t }: { t: TrialDetail }) {
  return (
    <div className="space-y-6">
      {t.clinicalImplications ? (
        <Prose title="Practice impact and current place in therapy"><Editorial><p>{t.clinicalImplications}</p></Editorial></Prose>
      ) : (
        <EmptyState title="Clinical implications not yet written" />
      )}
      {t.tumourBoardPearl && (
        <Prose title="Tumour board pearl">
          <div className="rounded-xl border border-sand/40 bg-sand-soft p-5 font-serif text-[16px] leading-relaxed text-ink">{t.tumourBoardPearl}</div>
        </Prose>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <Notice title="FDA / EMA status">
          Regulatory decisions are not displayed until ingested from FDA or EMA documents with dates and source links. See{" "}
          <Link href="/regulatory" className="text-accent hover:underline">Regulatory</Link>.
        </Notice>
        <Notice title="ESMO / NCCN / ASCO status">
          Guideline recommendations and evidence levels are shown only when ingested from the guideline itself, with its version date. See{" "}
          <Link href="/guidelines" className="text-accent hover:underline">Guidelines</Link>.
        </Notice>
      </div>
    </div>
  );
}

// ───────────────────────── Tab 11: References ──────────────────────
export function ReferencesTab({ t }: { t: TrialDetail }) {
  const registries = t.registryIds as { registry: string; id: string }[];
  return (
    <div className="space-y-6">
      <ol className="space-y-4">
        {t.publications.map((p, i) => (
          <li key={p.id} className="flex gap-4 rounded-xl border border-border bg-surface p-4">
            <span className="tabular text-sm text-ink-3">{i + 1}.</span>
            <div className="min-w-0 text-sm">
              <p className="text-ink">
                {p.sourceDocument.firstAuthor ? `${p.sourceDocument.firstAuthor} et al. ` : ""}
                {p.sourceDocument.title} <em>{p.sourceDocument.journal}</em>. {p.sourceDocument.year}.
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs">
                <Badge>{labelFor(PUBLICATION_TYPE_LABEL, p.type)}</Badge>
                {p.sourceDocument.pmid && <a className="text-accent hover:underline" href={pubmedUrl(p.sourceDocument.pmid)} target="_blank" rel="noreferrer noopener">PubMed {p.sourceDocument.pmid}</a>}
                {p.sourceDocument.doi && <a className="text-accent hover:underline" href={doiUrl(p.sourceDocument.doi)} target="_blank" rel="noreferrer noopener">doi:{p.sourceDocument.doi}</a>}
                <span className="text-ink-3">Retrieved via {p.sourceDocument.retrievedVia} on {p.sourceDocument.retrievedAt.toISOString().slice(0, 10)}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
      {registries.length > 0 && (
        <div className="text-sm text-ink-2">
          Registry:{" "}
          {registries.map((r) => {
            const href = registryUrl(r.registry, r.id);
            return href ? <a key={r.id} href={href} target="_blank" rel="noreferrer noopener" className="mr-3 text-accent hover:underline">{r.registry} {r.id}</a> : <span key={r.id} className="mr-3">{r.registry} {r.id}</span>;
          })}
        </div>
      )}
      <Notice>Supplementary appendices, protocols and statistical analysis plans are linked when retrieved under their licence terms.</Notice>
    </div>
  );
}
