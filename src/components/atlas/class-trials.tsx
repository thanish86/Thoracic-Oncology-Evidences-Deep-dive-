import { EmptyState } from "@/components/ui/primitives";
import { TrialTable } from "@/components/trials/trial-table";
import { listTrialsByClass } from "@/server/services/catalog";

/** Server component: curated trials tagged with a treatment class, rendered with the shared TrialTable. */
export async function ClassTrials({ cls, emptyLabel }: { cls: string; emptyLabel: string }) {
  const trials = await listTrialsByClass(cls);
  if (!trials.length) return <EmptyState title={emptyLabel}>No curated trials carry this treatment class yet.</EmptyState>;
  return (
    <>
      <p className="mb-3 text-xs text-ink-3">{trials.length} curated trial{trials.length === 1 ? "" : "s"}, ordered by year of primary publication. Results and numbers live on each trial page with their sources.</p>
      <TrialTable trials={trials} />
    </>
  );
}
