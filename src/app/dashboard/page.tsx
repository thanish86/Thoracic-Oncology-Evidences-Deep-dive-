import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, PageHeader, SectionHeading } from "@/components/ui/primitives";
import { EvidenceStatusBadge } from "@/components/evidence/status-badge";
import { SavedResearch } from "@/components/workspace/home-widgets";
import { DISEASE_ROUTE, DISEASE_TONE } from "@/lib/labels";
import { getDashboardStats, getLatestPublications } from "@/server/services/catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs text-ink-3">{label}</p>
      <p className="mt-1 font-serif text-3xl tabular text-ink">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-ink-3">{hint}</p>}
    </Card>
  );
}

export default async function DashboardPage() {
  const [stats, latest] = await Promise.all([getDashboardStats(), getLatestPublications(8)]);
  const pct = stats.analyses ? Math.round((stats.verifiedAnalyses / stats.analyses) * 100) : 0;

  return (
    <>
      <PageHeader eyebrow="Workspace" title="Evidence dashboard" description="Live counts from the database. Coverage figures describe what has been curated, not the size of the literature." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Curated trials" value={stats.trials} />
        <Stat label="Source-quoted outcome values" value={stats.analyses} />
        <Stat label="Source documents" value={stats.sources} />
        <Stat label="Biomarker monographs" value={stats.biomarkers} />
        <Stat label="Drug monographs" value={stats.drugs} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section>
          <SectionHeading title="Verification progress" description="Values move to Verified only after a named human reviewer approves them against the source." />
          <Card className="p-6">
            <div className="mb-2 flex justify-between text-sm"><span className="text-ink-2">Human-verified outcome values</span><span className="tabular text-ink">{stats.verifiedAnalyses} / {stats.analyses}</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-3" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Verification progress">
              <div className="h-full rounded-full bg-success" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-3 text-xs text-ink-3">{stats.awaiting} values awaiting verification. <Link href="/admin/evidence" className="text-accent hover:underline">Open review queue →</Link></p>
          </Card>
          <SectionHeading title="Coverage by disease" />
          <div className="grid gap-3 sm:grid-cols-5">
            {stats.perDisease.map((d) => (
              <Link key={d.slug} href={DISEASE_ROUTE[d.slug]}>
                <Card className="p-4 text-center hover:border-border-strong">
                  <Badge tone={DISEASE_TONE[d.slug]}>{d.shortName}</Badge>
                  <p className="mt-2 font-serif text-2xl tabular text-ink">{d._count.trials}</p>
                  <p className="text-[11px] text-ink-3">trials</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        <section>
          <SectionHeading title="Most recent evidence" />
          <Card className="divide-y divide-border">
            {latest.map((t) => (
              <Link key={t.slug} href={`/trials/${t.slug}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-surface-2/60">
                <span className="min-w-0">
                  <span className="block font-medium text-ink">{t.acronym}</span>
                  <span className="block truncate text-xs text-ink-3">{t.cancerType.shortName} · {t.setting}</span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-xs tabular text-ink-3">{t.yearOfPrimaryPublication}</span>
                  <EvidenceStatusBadge status={t.evidenceStatus} />
                </span>
              </Link>
            ))}
          </Card>
          <SectionHeading title="Continue reading" />
          <Card className="p-5"><SavedResearch /></Card>
        </section>
      </div>
    </>
  );
}
