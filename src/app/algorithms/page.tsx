import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GitBranch } from "lucide-react";
import { Badge, Card, Notice, PageHeader } from "@/components/ui/primitives";
import { EvidenceStatusBadge } from "@/components/evidence/status-badge";
import { ALGORITHMS, JURISDICTION_LABEL, algorithmTrialSlugs } from "@/content/algorithms";
import { DISEASE_TONE } from "@/lib/labels";
import { trialSlugsExisting } from "@/server/services/trials";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Treatment algorithm studio",
  description: "Interactive, educational treatment pathways linked to curated trial evidence.",
};

const DISEASE_NAME: Record<string, string> = { nsclc: "NSCLC", sclc: "SCLC", breast: "Breast", mesothelioma: "Mesothelioma", thymic: "Thymic" };

export default async function AlgorithmsPage() {
  const existing = await trialSlugsExisting([...new Set(ALGORITHMS.flatMap(algorithmTrialSlugs))]);

  return (
    <>
      <PageHeader
        eyebrow="Clinical reasoning"
        title="Treatment algorithm studio"
        description="Interactive decision pathways that connect each branch to the curated trials behind it. Branches are qualitative by design — efficacy numbers live on the trial pages, where every value is source-linked."
      />
      <div className="mb-6">
        <Notice tone="warning" title="Educational synthesis">
          {JURISDICTION_LABEL}. Pathways simplify real-world decisions, omit many eligibility nuances, and do not reflect regulatory approval or reimbursement in any country.
        </Notice>
      </div>
      <ul className="grid gap-4 md:grid-cols-2">
        {ALGORITHMS.map((a) => {
          const linked = algorithmTrialSlugs(a).filter((s) => existing.has(s)).length;
          return (
            <li key={a.slug}>
              <Card className="group relative flex h-full flex-col p-5 transition-colors hover:border-border-strong">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge tone={DISEASE_TONE[a.disease]}>{DISEASE_NAME[a.disease]}</Badge>
                  <Badge>{a.stage}</Badge>
                  <Badge tone="neutral" className="capitalize">{a.intent} intent</Badge>
                </div>
                <h2 className="font-serif text-xl leading-snug text-ink">
                  <Link href={`/algorithms/${a.slug}`} className="after:absolute after:inset-0 hover:text-accent">{a.title}</Link>
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-2">{a.summary}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-3 text-xs text-ink-3">
                  <EvidenceStatusBadge status={a.status} />
                  <span>As of <time dateTime={a.asOf}>{a.asOf}</time></span>
                  <span className="inline-flex items-center gap-1"><GitBranch className="h-3 w-3" aria-hidden />{a.nodes.length} steps · {linked} linked trials</span>
                  <span className="ml-auto inline-flex items-center gap-1 font-medium text-accent">Open <ArrowRight className="h-3 w-3" aria-hidden /></span>
                </div>
                <p className="mt-2 text-[11px] leading-snug text-ink-3">{a.jurisdiction}</p>
              </Card>
            </li>
          );
        })}
      </ul>
    </>
  );
}
