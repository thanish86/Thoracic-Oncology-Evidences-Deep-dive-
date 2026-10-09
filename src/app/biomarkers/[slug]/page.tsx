import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, EmptyState, Notice } from "@/components/ui/primitives";
import { EvidenceStatusBadge } from "@/components/evidence/status-badge";
import { BookmarkButton } from "@/components/workspace/bookmark-button";
import { DISEASE_TONE, RESULT_TONE } from "@/lib/labels";
import { RESULT_LABEL } from "@/lib/utils";
import { getBiomarker } from "@/server/services/catalog";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = await getBiomarker((await params).slug);
  return { title: b?.name ?? "Biomarker not found" };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">{title}</h2>
      {children}
    </section>
  );
}

export default async function BiomarkerPage({ params }: Props) {
  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) notFound();
  const b = await getBiomarker(slug);
  if (!b) notFound();
  const trials = b.trials.map((t) => t.trial).sort((x, y) => x.yearOfPrimaryPublication - y.yearOfPrimaryPublication);

  return (
    <article>
      <header className="mb-10 border-b border-border pb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {b.cancers.map((c) => <Badge key={c.cancerType.slug} tone={DISEASE_TONE[c.cancerType.slug]}>{c.cancerType.shortName}</Badge>)}
          {b.pathway && <Badge tone="lavender">{b.pathway.name}</Badge>}
          <EvidenceStatusBadge status={b.status} />
        </div>
        <h1 className="font-serif text-4xl tracking-tight text-ink">{b.name}</h1>
        {b.gene && <p className="mt-1 font-mono text-sm text-ink-3">{b.gene}</p>}
        <p className="mt-4 max-w-3xl font-serif text-lg leading-relaxed text-ink-2">{b.summary}</p>
        <div className="mt-5"><BookmarkButton type="biomarker" slug={b.slug} title={b.name} /></div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <Section title="Molecular biology"><p className="text-[15px] leading-relaxed text-ink-2">{b.biology}</p></Section>
          {b.alterations.length > 0 && (
            <Section title="Alteration types">
              <ul className="space-y-1.5">{b.alterations.map((a) => <li key={a} className="flex gap-2 text-[15px] text-ink-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lavender" aria-hidden />{a}</li>)}</ul>
            </Section>
          )}
          <Section title="Diagnostic assays and testing algorithm">
            <Card className="p-5">
              <ul className="mb-3 flex flex-wrap gap-1.5">{b.testingMethods.map((m) => <li key={m}><Badge tone="blue">{m}</Badge></li>)}</ul>
              {b.testingSpecimen && <p className="text-sm text-ink-2"><span className="text-ink-3">Specimen: </span>{b.testingSpecimen}</p>}
              {b.testingNotes && <p className="mt-2 text-sm leading-relaxed text-ink-2">{b.testingNotes}</p>}
            </Card>
          </Section>
          <Section title="Predictive relevance and treatment"><p className="text-[15px] leading-relaxed text-ink-2">{b.predictiveRelevance}</p></Section>
          {b.resistance.length > 0 && (
            <Section title="Resistance mechanisms">
              <ul className="space-y-1.5">{b.resistance.map((a) => <li key={a} className="flex gap-2 text-[15px] text-ink-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose" aria-hidden />{a}</li>)}</ul>
            </Section>
          )}
          {b.cnsConsiderations && <Section title="CNS considerations"><p className="text-[15px] leading-relaxed text-ink-2">{b.cnsConsiderations}</p></Section>}
          <Section title="Linked trials">
            {trials.length ? (
              <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
                {trials.map((t) => (
                  <Link key={t.slug} href={`/trials/${t.slug}`} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 hover:bg-surface-2/60">
                    <span>
                      <span className="font-medium text-ink">{t.acronym}</span>
                      <span className="ml-2 text-xs text-ink-3">{t.cancerType.shortName} · {t.setting} · {t.yearOfPrimaryPublication}</span>
                    </span>
                    <Badge tone={RESULT_TONE[t.result]}>{RESULT_LABEL[t.result]}</Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState title="No curated trials linked yet" />
            )}
          </Section>
        </div>
        <aside className="space-y-4">
          <Card className="p-5">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Targeted agents</p>
            {b.drugs.length ? (
              <ul className="space-y-1.5">
                {b.drugs.map((d) => (
                  <li key={d.drug.slug}><Link href={`/drugs/${d.drug.slug}`} className="text-sm text-accent hover:underline">{d.drug.name}</Link> <span className="text-xs text-ink-3">· {d.drug.drugClass}</span></li>
                ))}
              </ul>
            ) : <p className="text-sm text-ink-3">None linked.</p>}
          </Card>
          <Notice>
            Curated by {b.curatedBy}. Editorial monograph awaiting expert review; regulatory indications are shown on drug pages only once ingested from labels.
          </Notice>
        </aside>
      </div>
    </article>
  );
}
