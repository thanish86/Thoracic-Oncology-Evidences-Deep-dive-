import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/ui/primitives";
import { FilterBar } from "@/components/trials/filter-bar";
import { TrialTable } from "@/components/trials/trial-table";
import { DISEASE_DEFS } from "@/lib/taxonomy";
import { CLASS_LABEL, STAGE_LABEL, labelFor } from "@/lib/labels";
import { PHASE_LABEL, RESULT_LABEL } from "@/lib/utils";
import { trialFilterSchema, type SearchParams } from "@/server/services/filters";
import { getTrialFacets, listTrials } from "@/server/services/trials";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Trial explorer" };

export default async function TrialsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const filters = trialFilterSchema.parse(await searchParams);
  const [trials, facets] = await Promise.all([listTrials(filters), getTrialFacets()]);

  return (
    <>
      <PageHeader
        eyebrow="Evidence database"
        title="Clinical trial explorer"
        description="Every trial record links its numbers to a cited source and verbatim quote. Filter by disease, stage, biomarker, treatment class, design and outcome; open any trial for its eleven-part evidence dossier."
      />
      <FilterBar
        searchPlaceholder="Search acronym, drug, population…"
        filters={[
          { key: "disease", label: "Disease", options: DISEASE_DEFS.map((d) => ({ value: d.slug, label: d.shortName })) },
          { key: "stage", label: "Stage", options: facets.stages.map((s) => ({ value: s, label: labelFor(STAGE_LABEL, s) })) },
          { key: "biomarker", label: "Biomarker", options: facets.biomarkers.map((b) => ({ value: b, label: b.toUpperCase() })) },
          { key: "cls", label: "Treatment", options: facets.classes.map((c) => ({ value: c, label: labelFor(CLASS_LABEL, c) })) },
          { key: "phase", label: "Design", options: Object.entries(PHASE_LABEL).map(([value, label]) => ({ value, label })) },
          { key: "result", label: "Result", options: Object.entries(RESULT_LABEL).map(([value, label]) => ({ value, label })) },
          { key: "sort", label: "Sort", options: [{ value: "year-desc", label: "Newest first" }, { value: "year-asc", label: "Oldest first" }, { value: "acronym", label: "A–Z" }] },
        ]}
      />
      <p className="mb-3 text-sm text-ink-3" aria-live="polite">
        {trials.length} {trials.length === 1 ? "trial" : "trials"} in the current database
      </p>
      {trials.length ? (
        <TrialTable trials={trials} />
      ) : (
        <EmptyState icon={<FlaskConical className="h-6 w-6" />} title="No trials match these filters">
          Try clearing a filter. If the database is empty, run <code className="rounded bg-surface-2 px-1">npm run db:seed</code>.
        </EmptyState>
      )}
    </>
  );
}
