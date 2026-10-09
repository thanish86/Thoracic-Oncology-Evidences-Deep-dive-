import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Scale } from "lucide-react";
import { Badge, Button } from "@/components/ui/primitives";
import { EvidenceStatusBadge } from "@/components/evidence/status-badge";
import { TrialTabs } from "@/components/trials/trial-tabs";
import {
  AppraisalTab, ArmsTab, DesignTab, EfficacyTab, ImplicationsTab, OverviewTab, PicoTab, ReferencesTab, SafetyTab, SubgroupsTab, UpdatesTab,
} from "@/components/trials/trial-sections";
import { BookmarkButton } from "@/components/workspace/bookmark-button";
import { DISEASE_ROUTE, DISEASE_TONE, RESULT_TONE } from "@/lib/labels";
import { PHASE_LABEL, RESULT_LABEL } from "@/lib/utils";
import { getTrial } from "@/server/services/trials";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTrial(slug);
  return t ? { title: t.acronym, description: t.clinicalQuestion } : { title: "Trial not found" };
}

export default async function TrialPage({ params }: Props) {
  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) notFound();
  const t = await getTrial(slug);
  if (!t) notFound();

  const tabs = [
    { id: "overview", label: "Overview", content: <OverviewTab t={t} /> },
    { id: "pico", label: "PICO", content: <PicoTab t={t} /> },
    { id: "design", label: "Design", content: <DesignTab t={t} /> },
    { id: "arms", label: "Treatment arms", content: <ArmsTab t={t} /> },
    { id: "efficacy", label: "Efficacy", content: <EfficacyTab t={t} /> },
    { id: "safety", label: "Safety", content: <SafetyTab t={t} /> },
    { id: "subgroups", label: "Subgroups", content: <SubgroupsTab t={t} /> },
    { id: "updates", label: "Updated analyses", content: <UpdatesTab t={t} /> },
    { id: "appraisal", label: "Critical appraisal", content: <AppraisalTab t={t} /> },
    { id: "implications", label: "Clinical implications", content: <ImplicationsTab t={t} /> },
    { id: "references", label: "References", content: <ReferencesTab t={t} /> },
  ];

  return (
    <article>
      <header className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Link href={DISEASE_ROUTE[t.cancerType.slug] ?? "/trials"}>
            <Badge tone={DISEASE_TONE[t.cancerType.slug]}>{t.cancerType.shortName}</Badge>
          </Link>
          <Badge>{PHASE_LABEL[t.phase]}</Badge>
          <Badge tone={RESULT_TONE[t.result]}>{RESULT_LABEL[t.result]}</Badge>
          {t.landmark && <Badge tone="sand">Landmark</Badge>}
          <EvidenceStatusBadge status={t.evidenceStatus} />
        </div>
        <p className="mb-1 text-sm tabular text-ink-3">{t.yearOfPrimaryPublication} · {t.setting}</p>
        <h1 className="font-serif text-4xl tracking-tight text-ink sm:text-5xl">{t.acronym}</h1>
        <p className="mt-3 max-w-4xl font-serif text-lg leading-relaxed text-ink-2">{t.officialTitle}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <BookmarkButton type="trial" slug={t.slug} title={t.acronym} />
          <Button asChild size="sm" variant="ghost">
            <Link href={`/trials/compare?ids=${t.slug}`}><Scale className="h-3.5 w-3.5" /> Compare</Link>
          </Button>
        </div>
      </header>
      <TrialTabs tabs={tabs} />
    </article>
  );
}
