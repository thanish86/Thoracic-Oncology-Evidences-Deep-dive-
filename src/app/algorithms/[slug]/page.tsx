import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge, Notice, PageHeader, SectionHeading } from "@/components/ui/primitives";
import { EvidenceStatusBadge } from "@/components/evidence/status-badge";
import { AlgorithmFlow, type FlowNodeInput } from "@/components/algorithms/algorithm-flow";
import { AlgorithmOutline } from "@/components/algorithms/algorithm-outline";
import { algorithmTrialSlugs, getAlgorithm } from "@/content/algorithms";
import { DISEASE_TONE } from "@/lib/labels";
import { trialSlugsExisting } from "@/server/services/trials";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getAlgorithm(slug);
  return a ? { title: a.title, description: a.summary } : { title: "Pathway not found" };
}

export default async function AlgorithmPage({ params }: Props) {
  const { slug } = await params;
  const a = getAlgorithm(slug);
  if (!a) notFound();

  const existing = await trialSlugsExisting(algorithmTrialSlugs(a));
  const nodes: FlowNodeInput[] = a.nodes.map((n) => ({
    id: n.id,
    kind: n.kind,
    label: n.label,
    detail: n.detail,
    trials: (n.trialSlugs ?? []).filter((s) => existing.has(s)).map((s) => ({ slug: s, acronym: existing.get(s)! })),
  }));
  const edges = a.edges.map((e) => ({ source: e.source, target: e.target, label: e.label }));

  return (
    <>
      <Link href="/algorithms" className="mb-4 inline-flex items-center gap-1 text-xs text-ink-3 hover:text-ink">
        <ArrowLeft className="h-3 w-3" aria-hidden /> All pathways
      </Link>
      <PageHeader eyebrow="Treatment algorithm studio" title={a.title} description={a.summary}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={DISEASE_TONE[a.disease]}>{a.disease.toUpperCase()}</Badge>
          <Badge>{a.stage}</Badge>
          <Badge className="capitalize">{a.intent} intent</Badge>
          <EvidenceStatusBadge status={a.status} />
          <span className="text-xs text-ink-3">As of <time dateTime={a.asOf}>{a.asOf}</time></span>
        </div>
      </PageHeader>

      <div className="mb-6">
        <Notice tone="warning" title="Not clinical guidance">
          {a.jurisdiction}. Steps are qualitative and simplified; consult the linked trial pages for sourced results and current guidelines for recommendations.
        </Notice>
      </div>

      <AlgorithmFlow nodes={nodes} edges={edges} title={a.title} />

      <section className="mt-10" aria-labelledby="outline-heading">
        <div id="outline-heading">
          <SectionHeading eyebrow="Accessible view" title="Text outline of this pathway" description="The same pathway as a nested list. Steps reached by more than one branch are described once." />
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <AlgorithmOutline nodes={nodes} edges={edges} />
        </div>
      </section>
    </>
  );
}
