import type { Metadata } from "next";
import { ScrollText } from "lucide-react";
import { Card, EmptyState, PageHeader, SectionHeading } from "@/components/ui/primitives";
import { prisma } from "@/server/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Guidelines" };

const BODIES = [
  { name: "ESMO", note: "Clinical Practice Guidelines and Living Guidelines; ESMO-MCBS scores for magnitude of benefit." },
  { name: "NCCN", note: "Ingested only where licence terms permit; version number and date recorded with each recommendation." },
  { name: "ASCO", note: "Guidelines and rapid recommendation updates with evidence ratings." },
  { name: "IASLC / ITMIG / ESTRO / ASTRO", note: "Staging, pathology and radiotherapy consensus statements." },
];

export default async function GuidelinesPage() {
  const guidelines = await prisma.guideline.findMany({ include: { cancerType: true, _count: { select: { recommendations: true } } }, orderBy: { publishedOn: "desc" } });
  return (
    <>
      <PageHeader
        eyebrow="Guidelines"
        title="Guideline evolution"
        description="Each guideline version is stored as its own dated record, so recommendations can be traced through time. Recommendations carry their evidence level and a link to the source document."
      />
      {guidelines.length ? (
        <div className="space-y-3">
          {guidelines.map((g) => (
            <Card key={g.id} className="p-5">
              <p className="font-medium text-ink">{g.body}: {g.title}</p>
              <p className="text-sm text-ink-3">{g.cancerType.shortName} · version {g.version} · {g._count.recommendations} recommendations</p>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={<ScrollText className="h-6 w-6" />} title="No guideline recommendations ingested yet">
          ONCOATLAS does not paraphrase guideline recommendations or evidence levels from memory. They will appear here once ingested from the guideline
          documents with version and date.
        </EmptyState>
      )}
      <section className="mt-10">
        <SectionHeading title="Planned sources" />
        <div className="grid gap-3 md:grid-cols-2">
          {BODIES.map((b) => (
            <Card key={b.name} className="p-5"><p className="font-serif text-lg text-ink">{b.name}</p><p className="mt-1 text-sm text-ink-2">{b.note}</p></Card>
          ))}
        </div>
      </section>
    </>
  );
}
