import Link from "next/link";
import { ArrowRight, Dna, FlaskConical, Landmark, Waypoints } from "lucide-react";
import { Badge, Card, SectionHeading } from "@/components/ui/primitives";
import { EvidenceStatusBadge } from "@/components/evidence/status-badge";
import { EvidenceByYear, type YearRow } from "@/components/charts/evidence-by-year";
import { SavedResearch, SearchHeroButton } from "@/components/workspace/home-widgets";
import { DISEASE_DEFS } from "@/lib/taxonomy";
import { DISEASE_ROUTE, DISEASE_TONE } from "@/lib/labels";
import { prisma } from "@/server/db";
import { getDashboardStats } from "@/server/services/catalog";

export const dynamic = "force-dynamic";

const ACCENT_BG: Record<string, string> = {
  rose: "bg-rose-soft", blue: "bg-blue-soft", lavender: "bg-lavender-soft", sand: "bg-sand-soft", sage: "bg-sage-soft",
};

export default async function HomePage() {
  const [stats, landmarks, yearRows, biomarkerCount] = await Promise.all([
    getDashboardStats(),
    prisma.clinicalTrial.findMany({
      where: { landmark: true },
      orderBy: { yearOfPrimaryPublication: "desc" },
      take: 8,
      select: { slug: true, acronym: true, setting: true, yearOfPrimaryPublication: true, evidenceStatus: true, cancerType: { select: { slug: true, shortName: true } } },
    }),
    prisma.clinicalTrial.findMany({ select: { yearOfPrimaryPublication: true, cancerType: { select: { slug: true } } } }),
    prisma.biomarker.count(),
  ]);

  const byYear = new Map<number, YearRow>();
  for (const t of yearRows) {
    const y = t.yearOfPrimaryPublication;
    const row = byYear.get(y) ?? { year: y };
    row[t.cancerType.slug] = (row[t.cancerType.slug] ?? 0) + 1;
    byYear.set(y, row);
  }
  const chart = [...byYear.values()].sort((a, b) => a.year - b.year);
  const perDisease = Object.fromEntries(stats.perDisease.map((d) => [d.slug, d._count.trials]));

  return (
    <div className="space-y-16">
      <section className="pt-6 text-center sm:pt-12">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-3">ONCOATLAS · The Evolution of Cancer Evidence, 2000–2026</p>
        <h1 className="mx-auto max-w-4xl font-serif text-4xl leading-[1.1] tracking-tight text-ink sm:text-6xl">
          Twenty-Six Years of Oncology Evidence. One Intelligent Atlas.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
          Explore the trials, biomarkers, treatments and discoveries that shaped modern cancer management.
        </p>
        <div className="mt-8 flex justify-center">
          <SearchHeroButton />
        </div>
        <p className="mt-4 text-xs text-ink-3">
          Database today: {stats.trials} trials · {stats.analyses} source-quoted outcome values · {stats.sources} source documents · {stats.biomarkers} biomarkers · {stats.drugs} drugs
        </p>
      </section>

      <section aria-labelledby="modules">
        <SectionHeading eyebrow="Disease modules" title="Five clinical worlds" description="Each module combines pathology, staging, biomarkers, management principles and the trials that built them." />
        <div id="modules" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {DISEASE_DEFS.map((d) => (
            <Link key={d.slug} href={DISEASE_ROUTE[d.slug]} className="group">
              <Card className="flex h-full flex-col p-5 transition-all group-hover:-translate-y-0.5 group-hover:border-border-strong">
                <span className={`mb-4 grid h-10 w-10 place-items-center rounded-xl ${ACCENT_BG[d.accent]}`} aria-hidden>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: `var(--${d.accent})` }} />
                </span>
                <h3 className="font-serif text-lg leading-snug text-ink">{d.name}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-2">{d.tagline}</p>
                <p className="mt-4 flex items-center justify-between text-xs text-ink-3">
                  <span className="tabular">{perDisease[d.slug] ?? 0} curated trials</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <SectionHeading
            eyebrow="Landmark trial explorer"
            title="Trials that changed practice"
            action={<Link href="/trials" className="text-sm text-accent hover:underline">All trials →</Link>}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {landmarks.map((t) => (
              <Link key={t.slug} href={`/trials/${t.slug}`}>
                <Card className="h-full p-4 transition-colors hover:border-border-strong">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Badge tone={DISEASE_TONE[t.cancerType.slug]}>{t.cancerType.shortName}</Badge>
                    <span className="text-xs tabular text-ink-3">{t.yearOfPrimaryPublication}</span>
                  </div>
                  <p className="font-serif text-lg text-ink">{t.acronym}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-ink-3">{t.setting}</p>
                  <div className="mt-3"><EvidenceStatusBadge status={t.evidenceStatus} /></div>
                </Card>
              </Link>
            ))}
            {!landmarks.length && <p className="text-sm text-ink-3">No landmark trials in the database yet.</p>}
          </div>
        </div>
        <div>
          <SectionHeading eyebrow="Interactive timeline" title="Evidence through time" action={<Link href="/timeline" className="text-sm text-accent hover:underline">Open timeline →</Link>} />
          <Card className="p-4">
            <EvidenceByYear data={chart} />
            <p className="mt-2 text-[11px] leading-relaxed text-ink-3">
              Curated trials in this database by year of primary publication — a measure of curation coverage, not of the literature.
            </p>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/biomarkers" className="group">
          <Card className="h-full p-5 group-hover:border-border-strong">
            <Dna className="mb-3 h-5 w-5 text-lavender" />
            <h3 className="font-serif text-lg text-ink">Molecular atlas</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">{biomarkerCount} biomarker monographs: biology, testing, predictive value and resistance.</p>
          </Card>
        </Link>
        <Card className="p-5">
          <FlaskConical className="mb-3 h-5 w-5 text-success" />
          <h3 className="font-serif text-lg text-ink">Recent verified updates</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-2">
            {stats.verifiedAnalyses > 0
              ? `${stats.verifiedAnalyses} outcome values have completed human verification.`
              : `No outcome values have completed human review yet; ${stats.awaiting} source-quoted values are awaiting verification.`}
          </p>
          <Link href="/admin/evidence" className="mt-2 inline-block text-xs text-accent hover:underline">Verification queue →</Link>
        </Card>
        <Link href="/regulatory" className="group">
          <Card className="h-full p-5 group-hover:border-border-strong">
            <Landmark className="mb-3 h-5 w-5 text-sand" />
            <h3 className="font-serif text-lg text-ink">Regulatory milestones</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">FDA and EMA decisions appear here once ingested from official documents. None are displayed from memory.</p>
          </Card>
        </Link>
        <Card className="p-5">
          <Waypoints className="mb-3 h-5 w-5 text-accent" />
          <h3 className="font-serif text-lg text-ink">Saved research</h3>
          <div className="mt-2"><SavedResearch /></div>
        </Card>
      </section>
    </div>
  );
}
