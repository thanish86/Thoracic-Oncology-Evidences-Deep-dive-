import type { Metadata } from "next";
import Link from "next/link";
import { Waypoints } from "lucide-react";
import { Badge, EmptyState, Notice, PageHeader } from "@/components/ui/primitives";
import { EvidenceStatusBadge } from "@/components/evidence/status-badge";
import { FilterBar } from "@/components/trials/filter-bar";
import { DISEASE_DEFS } from "@/lib/taxonomy";
import { CLASS_LABEL, DISEASE_TONE, STAGE_LABEL, TIMELINE_TYPE_LABEL, labelFor } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { timelineFilterSchema, type SearchParams } from "@/server/services/filters";
import { getTimeline } from "@/server/services/catalog";
import { getTrialFacets } from "@/server/services/trials";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Evidence timeline" };

const TYPE_DOT: Record<string, string> = {
  LANDMARK_TRIAL: "bg-accent", NEGATIVE_TRIAL: "bg-danger", PRACTICE_CHANGE: "bg-success", MOLECULAR_BREAKTHROUGH: "bg-lavender",
  RADIATION_MILESTONE: "bg-sand", SURGERY_MILESTONE: "bg-rose", GUIDELINE_UPDATE: "bg-sage", DRUG_APPROVAL: "bg-blue",
};

const YEARS = Array.from({ length: 27 }, (_, i) => 2000 + i);

export default async function TimelinePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const filters = timelineFilterSchema.parse(await searchParams);
  const [events, facets] = await Promise.all([getTimeline(filters), getTrialFacets()]);
  const byYear = new Map<number, typeof events>();
  for (const e of events) byYear.set(e.year, [...(byYear.get(e.year) ?? []), e]);
  const counts = YEARS.map((y) => byYear.get(y)?.length ?? 0);
  const max = Math.max(1, ...counts);
  const before2000 = events.filter((e) => e.year < 2000).length;

  return (
    <>
      <PageHeader
        eyebrow="2000–2026"
        title="Interactive evidence timeline"
        description="How standards of care evolved, trial by trial. Each event is generated from a curated trial's primary publication date; filter by disease, event type, stage, treatment class and biomarker."
      />
      <FilterBar
        searchKey={null}
        filters={[
          { key: "disease", label: "Disease", options: DISEASE_DEFS.map((d) => ({ value: d.slug, label: d.shortName })) },
          { key: "type", label: "Event", options: Object.entries(TIMELINE_TYPE_LABEL).map(([value, label]) => ({ value, label })) },
          { key: "stage", label: "Stage", options: facets.stages.map((s) => ({ value: s, label: labelFor(STAGE_LABEL, s) })) },
          { key: "cls", label: "Treatment", options: facets.classes.map((c) => ({ value: c, label: labelFor(CLASS_LABEL, c) })) },
          { key: "biomarker", label: "Biomarker", options: facets.biomarkers.map((b) => ({ value: b, label: b.toUpperCase() })) },
          { key: "from", label: "From", options: YEARS.map((y) => ({ value: String(y), label: String(y) })) },
          { key: "to", label: "To", options: YEARS.map((y) => ({ value: String(y), label: String(y) })) },
        ]}
      />

      <div className="mb-8 rounded-2xl border border-border bg-surface p-4">
        <p className="mb-3 text-xs text-ink-3">Events per year in the current view{before2000 ? ` (plus ${before2000} foundational event${before2000 > 1 ? "s" : ""} before 2000)` : ""}</p>
        <div className="flex h-20 items-end gap-[3px]" role="group" aria-label="Histogram of timeline events per year, 2000 to 2026">
          {YEARS.map((y, i) => (
            <a key={y} href={counts[i] ? `#y${y}` : undefined} className="group flex flex-1 flex-col items-center gap-1" title={`${y}: ${counts[i]} event(s)`}>
              <span className={cn("w-full rounded-t-sm transition-colors", counts[i] ? "bg-accent/60 group-hover:bg-accent" : "bg-surface-3")} style={{ height: `${Math.max(3, (counts[i] / max) * 64)}px` }} />
            </a>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[10px] tabular text-ink-3"><span>2000</span><span>2013</span><span>2026</span></div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3 text-xs text-ink-2">
        {Object.entries(TIMELINE_TYPE_LABEL).map(([k, v]) => (
          <span key={k} className="inline-flex items-center gap-1.5"><span className={cn("h-2 w-2 rounded-full", TYPE_DOT[k])} aria-hidden />{v}</span>
        ))}
      </div>

      {events.length === 0 ? (
        <EmptyState icon={<Waypoints className="h-6 w-6" />} title="No events match these filters" />
      ) : (
        <ol className="relative ml-3 border-l border-border">
          {[...byYear.entries()].sort((a, b) => a[0] - b[0]).map(([year, list]) => (
            <li key={year} id={`y${year}`} className="mb-10 scroll-mt-28 pl-8">
              <span className="absolute -left-3 grid h-6 min-w-6 place-items-center rounded-full border border-border bg-bg px-1.5 text-[10px] font-semibold tabular text-ink-2" style={{ marginTop: -2 }}>
                ●
              </span>
              <h2 className="mb-3 font-serif text-2xl tabular text-ink">{year}</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {list.map((e) => (
                  <div key={e.id} className="rounded-xl border border-border bg-surface p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", TYPE_DOT[e.type])} aria-hidden />
                      <span className="text-xs text-ink-3">{TIMELINE_TYPE_LABEL[e.type]} · {e.date.toISOString().slice(0, 7)}</span>
                      <Badge tone={DISEASE_TONE[e.cancerType.slug]} className="ml-auto">{e.cancerType.shortName}</Badge>
                    </div>
                    {e.trial ? (
                      <Link href={`/trials/${e.trial.slug}`} className="font-serif text-lg text-ink hover:text-accent">{e.title}</Link>
                    ) : (
                      <p className="font-serif text-lg text-ink">{e.title}</p>
                    )}
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">{e.summary}</p>
                    <div className="mt-2"><EvidenceStatusBadge status={e.status} /></div>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ol>
      )}
      <Notice title="Coverage note">
        The timeline reflects trials curated so far, not the complete 2000–2026 literature. Drug approvals and guideline updates appear only once
        ingested from official sources with dates; none are entered from memory.
      </Notice>
    </>
  );
}
