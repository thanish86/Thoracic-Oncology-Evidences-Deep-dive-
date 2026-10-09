import type { Metadata } from "next";
import { Notice, PageHeader } from "@/components/ui/primitives";
import { TumourBoardView } from "@/components/workspace/tumour-board-view";
import { listTrialOptions } from "@/server/services/trials";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tumour board" };

export default async function TumourBoardPage() {
  const trials = await listTrialOptions();
  return (
    <>
      <PageHeader eyebrow="Workspace" title="Tumour board evidence studio" description="Assemble the trials behind a multidisciplinary discussion and generate a structured, source-linked evidence brief." />
      <div className="mb-6">
        <Notice tone="warning" title="No patient data">This initial release stores nothing identifiable. Frame briefs by clinical question (e.g. “EGFR-mutant stage III after chemoradiation”), not by patient.</Notice>
      </div>
      <TumourBoardView trialOptions={trials.map((t) => ({ slug: t.slug, acronym: t.acronym, disease: t.cancerType.shortName }))} />
    </>
  );
}
