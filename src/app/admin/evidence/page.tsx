import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, Notice, PageHeader, SectionHeading } from "@/components/ui/primitives";
import { EvidenceStatusBadge } from "@/components/evidence/status-badge";
import { ReviewForm } from "@/components/evidence/review-form";
import { SourceQuote } from "@/components/trials/trial-sections";
import { formatEstimate, pubmedUrl } from "@/lib/utils";
import { prisma } from "@/server/db";
import { getVerificationQueue } from "@/server/services/catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Evidence review", robots: { index: false } };

const PIPELINE = [
  "Discovery", "Registry matching", "Bibliographic metadata", "Source retrieval", "Structured extraction", "Verification queue", "Human approval", "Publication", "Revalidation",
];

export default async function AdminEvidencePage() {
  const [queue, jobs] = await Promise.all([
    getVerificationQueue(),
    prisma.ingestionJob.groupBy({ by: ["stage"], _count: true }),
  ]);
  const reviewsEnabled = Boolean(process.env.ADMIN_REVIEW_TOKEN && process.env.ADMIN_REVIEW_TOKEN.length >= 16);

  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="Evidence verification"
        description="Every extracted value enters as “Awaiting verification”. A named reviewer checks it against the cited source and quote; only then is it marked Verified. Decisions are logged and survive re-seeding."
      />

      <section className="mb-10">
        <SectionHeading title="Ingestion pipeline" />
        <ol className="flex flex-wrap items-center gap-2 text-xs">
          {PIPELINE.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-ink-2"><span className="mr-1 tabular text-ink-3">{i + 1}</span>{s}</span>
              {i < PIPELINE.length - 1 && <span className="text-ink-3" aria-hidden>→</span>}
            </li>
          ))}
        </ol>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Card className="p-4">
            <p className="text-xs text-ink-3">Ingestion jobs by stage</p>
            {jobs.length ? (
              <ul className="mt-2 space-y-1 text-sm">{jobs.map((j) => <li key={j.stage} className="flex justify-between"><span className="text-ink-2">{j.stage}</span><span className="tabular text-ink">{j._count}</span></li>)}</ul>
            ) : (
              <p className="mt-2 text-sm text-ink-2">No jobs yet. Run <code className="rounded bg-surface-2 px-1 text-xs">npm run ingest:pubmed -- &quot;query&quot;</code>.</p>
            )}
          </Card>
          <Card className="p-4">
            <p className="text-xs text-ink-3">Trials by evidence status</p>
            <ul className="mt-2 space-y-1 text-sm">{queue.trialStatus.map((s) => <li key={s.evidenceStatus} className="flex justify-between"><EvidenceStatusBadge status={s.evidenceStatus} /><span className="tabular text-ink">{s._count}</span></li>)}</ul>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-ink-3">Safety values awaiting verification</p>
            <p className="mt-2 font-serif text-3xl tabular text-ink">{queue.safetyAwaiting}</p>
          </Card>
        </div>
      </section>

      {!reviewsEnabled && (
        <div className="mb-6">
          <Notice tone="warning" title="Reviews are read-only in this environment">
            Set <code>ADMIN_REVIEW_TOKEN</code> (≥16 characters) on the server to enable review decisions. Full role-based authentication (Supabase) is on
            the roadmap; the token is an interim safeguard.
          </Notice>
        </div>
      )}

      <section className="mb-10">
        <SectionHeading title="Outcome values awaiting verification" description={`Showing the ${queue.analyses.length} oldest items.`} />
        <div className="space-y-3">
          {queue.analyses.map((a) => (
            <Card key={a.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm">
                    <Link href={`/trials/${a.outcome.endpoint.trial.slug}#efficacy`} className="font-medium text-accent hover:underline">{a.outcome.endpoint.trial.acronym}</Link>
                    <span className="text-ink-3"> · {a.outcome.endpoint.label} · {a.outcome.population} · {a.analysisLabel}</span>
                  </p>
                  <p className="mt-1 text-sm tabular text-ink">
                    {[a.experimentalValue && `${a.experimentalValue} vs ${a.controlValue ?? "—"}`, formatEstimate(a.effectMeasure, a.effectEstimate, a.ciLower, a.ciUpper, a.ciLevel), a.pValue && `P ${a.pValue}`].filter(Boolean).join(" · ") || "—"}
                  </p>
                  <SourceQuote quote={a.sourceQuote} />
                </div>
                <div className="flex flex-col items-end gap-1.5 text-xs">
                  <EvidenceStatusBadge status={a.status} />
                  {a.sourceDocument.pmid && <a href={pubmedUrl(a.sourceDocument.pmid)} target="_blank" rel="noreferrer noopener" className="text-accent hover:underline">PMID {a.sourceDocument.pmid}</a>}
                  <Badge>{a.sourceLocation}</Badge>
                </div>
              </div>
              {reviewsEnabled && <ReviewForm analysisId={a.id} />}
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Recent review decisions" />
        {queue.history.length ? (
          <ul className="space-y-2 text-sm">
            {queue.history.map((h) => (
              <li key={h.id} className="rounded-xl border border-border bg-surface px-4 py-2.5">
                <span className="font-medium text-ink">{h.action}</span> <span className="text-ink-3">· {h.entityId} · {h.reviewer?.name ?? "unknown"} · {h.createdAt.toISOString().slice(0, 16).replace("T", " ")}</span>
                {h.comment && <p className="mt-1 text-ink-2">{h.comment}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-3">No review decisions recorded yet.</p>
        )}
      </section>
    </>
  );
}
