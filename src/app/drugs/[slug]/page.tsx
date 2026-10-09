import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, EmptyState, KeyValue, Notice } from "@/components/ui/primitives";
import { EvidenceStatusBadge } from "@/components/evidence/status-badge";
import { SourceQuote } from "@/components/trials/trial-sections";
import { BookmarkButton } from "@/components/workspace/bookmark-button";
import { DISEASE_TONE, RESULT_TONE } from "@/lib/labels";
import { DISEASE_DEFS } from "@/lib/taxonomy";
import { RESULT_LABEL } from "@/lib/utils";
import { getDrug } from "@/server/services/catalog";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await getDrug((await params).slug);
  return { title: d?.name ?? "Drug not found" };
}

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">{children}</h2>;
}

export default async function DrugPage({ params }: Props) {
  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) notFound();
  const d = await getDrug(slug);
  if (!d) notFound();
  const trials = d.trials.map((t) => t.trial).sort((a, b) => a.yearOfPrimaryPublication - b.yearOfPrimaryPublication);
  const trialDosing = trials.flatMap((t) => t.arms.filter((a) => a.dosing && a.doseSourceQuote && a.regimen.toLowerCase().includes(d.name.toLowerCase().split(" ")[0])).map((a) => ({ t, a })));

  return (
    <article>
      <header className="mb-10 border-b border-border pb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge tone="blue">{d.drugClass}</Badge>
          {d.diseases.map((x) => <Badge key={x} tone={DISEASE_TONE[x]}>{DISEASE_DEFS.find((dd) => dd.slug === x)?.shortName ?? x}</Badge>)}
          <EvidenceStatusBadge status={d.status} />
        </div>
        <h1 className="font-serif text-4xl tracking-tight text-ink">{d.name}</h1>
        {d.brandNames.length > 0 && <p className="mt-1 text-sm text-ink-3">{d.brandNames.join(" · ")}</p>}
        <div className="mt-5"><BookmarkButton type="drug" slug={d.slug} title={d.name} /></div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          <section>
            <H>Mechanism of action</H>
            <p className="font-serif text-lg leading-relaxed text-ink-2">{d.mechanism}</p>
          </section>
          <section>
            <H>Pharmacology profile</H>
            <Card className="px-5">
              <dl>
                <KeyValue label="Targets">{d.targets.length ? d.targets.join(", ") : null}</KeyValue>
                <KeyValue label="Route">{d.route}</KeyValue>
                <KeyValue label="Pharmacokinetics">{null}</KeyValue>
                <KeyValue label="Renal / hepatic">{null}</KeyValue>
                <KeyValue label="Drug interactions">{d.interactions}</KeyValue>
                <KeyValue label="Resistance">{d.resistance}</KeyValue>
              </dl>
            </Card>
          </section>
          <section>
            <H>Key toxicities</H>
            <ul className="grid gap-2 sm:grid-cols-2">
              {d.keyToxicities.map((t) => <li key={t} className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink-2">{t}</li>)}
            </ul>
            <p className="mt-2 text-xs text-ink-3">Qualitative. CTCAE-graded incidence rates are displayed per trial in each trial&rsquo;s Safety tab, with sources.</p>
          </section>
          {d.monitoring.length > 0 && (
            <section>
              <H>Monitoring</H>
              <ul className="space-y-1.5">{d.monitoring.map((m) => <li key={m} className="flex gap-2 text-[15px] text-ink-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden />{m}</li>)}</ul>
            </section>
          )}
          <section>
            <H>Labelled dosing and indications</H>
            {d.indications.length ? (
              <div className="space-y-3">
                {d.indications.map((i) => (
                  <Card key={i.id} className="p-4 text-sm">
                    <Badge>{i.jurisdiction}</Badge>
                    <p className="mt-2 text-ink">{i.indicationText}</p>
                    {i.labelledDosing && <p className="mt-1 text-ink-2">{i.labelledDosing}</p>}
                  </Card>
                ))}
              </div>
            ) : (
              <Notice tone="warning" title="Not yet ingested">
                FDA/EMA labelled indications and doses have not been ingested for this drug. ONCOATLAS does not display labelled doses from memory —
                consult the current label of your jurisdiction.
              </Notice>
            )}
          </section>
          <section>
            <H>Trial dosing (verbatim from cited trial publications)</H>
            {trialDosing.length ? (
              <div className="space-y-3">
                {trialDosing.map(({ t, a }) => (
                  <Card key={`${t.slug}-${a.label}`} className="p-4 text-sm">
                    <p><Link href={`/trials/${t.slug}`} className="font-medium text-accent hover:underline">{t.acronym}</Link> <span className="text-ink-3">· {a.label}</span></p>
                    <p className="mt-1 text-ink">{a.dosing}</p>
                    {a.doseSourceQuote && <SourceQuote quote={a.doseSourceQuote} />}
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-3">No source-quoted trial doses extracted for this agent yet.</p>
            )}
          </section>
          <section>
            <H>Clinical trial connections</H>
            {trials.length ? (
              <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
                {trials.map((t) => (
                  <Link key={t.slug} href={`/trials/${t.slug}`} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 hover:bg-surface-2/60">
                    <span><span className="font-medium text-ink">{t.acronym}</span><span className="ml-2 text-xs text-ink-3">{t.cancerType.shortName} · {t.setting} · {t.yearOfPrimaryPublication}</span></span>
                    <Badge tone={RESULT_TONE[t.result]}>{RESULT_LABEL[t.result]}</Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState title="No curated trials linked yet" />
            )}
          </section>
        </div>
        <aside className="space-y-4">
          <Card className="p-5">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Predictive biomarkers</p>
            {d.biomarkers.length ? (
              <ul className="flex flex-wrap gap-1.5">{d.biomarkers.map((b) => <li key={b.biomarker.slug}><Link href={`/biomarkers/${b.biomarker.slug}`}><Badge tone="lavender">{b.biomarker.name.split(" (")[0]}</Badge></Link></li>)}</ul>
            ) : <p className="text-sm text-ink-3">None linked.</p>}
          </Card>
          <Notice>Curated by {d.curatedBy}. Editorial monograph awaiting expert review. FDA, EMA and regional labels differ; jurisdiction is shown with every ingested indication.</Notice>
        </aside>
      </div>
    </article>
  );
}
