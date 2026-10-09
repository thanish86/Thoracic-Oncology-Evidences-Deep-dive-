import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, EmptyState, PageHeader, SectionHeading } from "@/components/ui/primitives";
import { FilterBar } from "@/components/trials/filter-bar";
import { DISEASE_DEFS } from "@/lib/taxonomy";
import { DISEASE_TONE } from "@/lib/labels";
import type { SearchParams } from "@/server/services/filters";
import { listDrugs } from "@/server/services/catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pharmacology atlas" };

export default async function DrugsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const disease = typeof sp.disease === "string" ? sp.disease : undefined;
  const q = typeof sp.q === "string" ? sp.q.toLowerCase().trim() : "";
  const all = await listDrugs();
  const drugs = all.filter(
    (d) => (!disease || d.diseases.includes(disease)) && (!q || `${d.name} ${d.brandNames.join(" ")} ${d.drugClass} ${d.targets.join(" ")}`.toLowerCase().includes(q)),
  );
  const groups = new Map<string, typeof drugs>();
  for (const d of drugs) groups.set(d.drugClass, [...(groups.get(d.drugClass) ?? []), d]);

  return (
    <>
      <PageHeader
        eyebrow="Oncology pharmacology atlas"
        title="Drug monographs"
        description="Mechanism, targets, toxicity, monitoring, resistance and trial connections. Labelled dosing is displayed only after ingestion from FDA/EMA documents, with jurisdiction and retrieval date."
      />
      <FilterBar
        searchPlaceholder="Search drug, brand, class or target…"
        filters={[{ key: "disease", label: "Disease", options: DISEASE_DEFS.map((d) => ({ value: d.slug, label: d.shortName })) }]}
      />
      <p className="mb-6 text-sm text-ink-3">{drugs.length} of {all.length} monographs</p>
      {!drugs.length && <EmptyState title="No drugs match" />}
      {[...groups.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([cls, list]) => (
        <section key={cls} className="mb-8">
          <SectionHeading title={cls} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((d) => (
              <Link key={d.slug} href={`/drugs/${d.slug}`}>
                <Card className="h-full p-4 transition-colors hover:border-border-strong">
                  <p className="font-serif text-lg text-ink">{d.name}</p>
                  {d.brandNames.length > 0 && <p className="text-xs text-ink-3">{d.brandNames.join(", ")}</p>}
                  <p className="mt-2 line-clamp-2 text-sm text-ink-2">{d.targets.join(" · ")}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {d.diseases.map((x) => <Badge key={x} tone={DISEASE_TONE[x]}>{DISEASE_DEFS.find((dd) => dd.slug === x)?.shortName ?? x}</Badge>)}
                    <Badge>{d._count.trials} trials</Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
