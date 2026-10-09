import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, EmptyState, PageHeader, SectionHeading } from "@/components/ui/primitives";
import { PathwayMaps } from "@/components/atlas/pathway-maps";
import { DISEASE_TONE } from "@/lib/labels";
import { listBiomarkers } from "@/server/services/catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Molecular atlas" };

const CATEGORY_LABEL: Record<string, string> = {
  driver: "Oncogenic drivers", receptor: "Hormone & growth-factor receptors", immune: "Immune biomarkers", "dna-repair": "DNA damage repair",
  pathway: "Pathway alterations", "diagnostic-ihc": "Diagnostic IHC", prognostic: "Prognostic markers",
};

export default async function BiomarkersPage() {
  const biomarkers = await listBiomarkers();
  const groups = new Map<string, typeof biomarkers>();
  for (const b of biomarkers) groups.set(b.category, [...(groups.get(b.category) ?? []), b]);

  return (
    <>
      <PageHeader
        eyebrow="Molecular oncology atlas"
        title="Biomarkers, pathways and predictive biology"
        description="Biology, testing algorithms, predictive relevance, resistance and linked trials for each biomarker across breast and thoracic cancers."
      />
      <section className="mb-12">
        <SectionHeading title="Signalling maps" description="Explore the pathways; click a highlighted node to open its monograph." />
        <PathwayMaps availableSlugs={biomarkers.map((b) => b.slug)} />
      </section>
      {biomarkers.length === 0 && <EmptyState title="No biomarker monographs in the database" />}
      {[...groups.entries()].map(([cat, list]) => (
        <section key={cat} className="mb-10">
          <SectionHeading title={CATEGORY_LABEL[cat] ?? cat} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((b) => (
              <Link key={b.slug} href={`/biomarkers/${b.slug}`}>
                <Card className="h-full p-5 transition-colors hover:border-border-strong">
                  <div className="mb-2 flex flex-wrap gap-1">
                    {b.cancers.map((c) => <Badge key={c.cancerType.slug} tone={DISEASE_TONE[c.cancerType.slug]}>{c.cancerType.shortName}</Badge>)}
                  </div>
                  <h3 className="font-serif text-lg leading-snug text-ink">{b.name}</h3>
                  <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ink-2">{b.summary}</p>
                  <p className="mt-3 text-xs text-ink-3">{b._count.trials} linked trials · {b._count.drugs} linked drugs{b.pathway ? ` · ${b.pathway.name}` : ""}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
