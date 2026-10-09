import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/primitives";
import { NotebookView } from "@/components/workspace/notebook-view";
import { listTrialOptions } from "@/server/services/trials";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Notebook" };

export default async function NotebookPage() {
  const trials = await listTrialOptions();
  return (
    <>
      <PageHeader eyebrow="Workspace" title="Research notebook" description="Research notes, journal-club preparation, evidence briefs and unresolved research questions — linked to the evidence." />
      <NotebookView trialOptions={trials.map((t) => ({ slug: t.slug, acronym: t.acronym }))} />
    </>
  );
}
