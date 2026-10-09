import type { Metadata } from "next";
import { Landmark } from "lucide-react";
import { Card, EmptyState, PageHeader, SectionHeading } from "@/components/ui/primitives";
import { prisma } from "@/server/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Regulatory" };

export default async function RegulatoryPage() {
  const decisions = await prisma.regulatoryDecision.findMany({
    include: { indication: { include: { drug: true } }, sourceDocument: true },
    orderBy: { decisionDate: "desc" },
  });
  return (
    <>
      <PageHeader
        eyebrow="Regulatory"
        title="FDA, EMA and regional decisions"
        description="Drug approvals, label expansions and withdrawals by jurisdiction, each linked to the official document it was taken from."
      />
      {decisions.length ? (
        <div className="space-y-3">
          {decisions.map((d) => (
            <Card key={d.id} className="p-5">
              <p className="font-medium text-ink">{d.indication.drug.name} — {d.decision} ({d.indication.jurisdiction})</p>
              <p className="text-sm text-ink-2">{d.indication.indicationText}</p>
              <p className="text-xs text-ink-3">{d.decisionDate.toISOString().slice(0, 10)}</p>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={<Landmark className="h-6 w-6" />} title="No regulatory decisions ingested yet">
          Approval dates and labelled indications are never entered from memory. They will be ingested from official sources (Drugs@FDA, openFDA labels,
          EMA EPARs) with retrieval dates.
        </EmptyState>
      )}
      <section className="mt-10">
        <SectionHeading title="Data model" description="One drug → many indications across jurisdictions → dated decisions, each linked to a source document." />
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Drugs@FDA / openFDA", "US approvals, label text and dosing sections"],
            ["EMA EPAR / Union Register", "EU marketing authorisations and SmPC dosing"],
            ["Regional agencies", "MHRA, PMDA, CDSCO and others, labelled by jurisdiction"],
          ].map(([t, d]) => <Card key={t} className="p-5"><p className="font-serif text-lg text-ink">{t}</p><p className="mt-1 text-sm text-ink-2">{d}</p></Card>)}
        </div>
      </section>
    </>
  );
}
