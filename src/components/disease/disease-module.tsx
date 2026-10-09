import Link from "next/link";
import { BookOpenCheck, ChevronDown, FlaskConical, Lightbulb, ListTree } from "lucide-react";
import { Badge, Card, EmptyState, Notice, PageHeader, SectionHeading, type BadgeTone } from "@/components/ui/primitives";
import { TrialTable, type TrialRow } from "@/components/trials/trial-table";
import { DISEASE_TONE, STAGE_LABEL, labelFor } from "@/lib/labels";
import { DISEASE_DEFS } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import { getDisease } from "@/server/services/catalog";
import { trialSlugsExisting } from "@/server/services/trials";
import type { DiseaseModuleContent, EvidenceType, ModuleGroup, ModuleSection } from "@/content/modules/types";

const EVIDENCE_TONE: Record<EvidenceType, BadgeTone> = {
  prospective: "sage",
  retrospective: "sand",
  consensus: "lavender",
  mixed: "blue",
};
const EVIDENCE_LABEL: Record<EvidenceType, string> = {
  prospective: "Prospective evidence",
  retrospective: "Retrospective evidence",
  consensus: "Consensus",
  mixed: "Mixed evidence",
};

const BIOMARKER_CATEGORY_LABEL: Record<string, string> = {
  "diagnostic-ihc": "Diagnostic IHC", "dna-repair": "DNA repair", driver: "Oncogenic driver", immune: "Immune",
  pathway: "Pathway", prognostic: "Prognostic", receptor: "Receptor",
};

/** Order in which a trial's stage tags decide its display group (first match wins). */
const STAGE_PRIORITY = [
  "screening", "dcis", "early", "resectable", "limited-stage", "extensive-stage", "metastatic", "locally-advanced", "unresectable", "recurrent",
];

/** Display order of the stage groups (clinical pathway order). */
const STAGE_DISPLAY_ORDER = [
  "screening", "dcis", "early", "resectable", "limited-stage", "locally-advanced", "unresectable", "extensive-stage", "metastatic", "recurrent",
];

type ModuleTrial = TrialRow & { stages: string[] };

function groupTrialsByStage(trials: ModuleTrial[]) {
  const groups = new Map<string, ModuleTrial[]>();
  for (const t of trials) {
    const key = STAGE_PRIORITY.find((s) => t.stages.includes(s)) ?? t.stages[0] ?? "any";
    const list = groups.get(key) ?? [];
    list.push(t);
    groups.set(key, list);
  }
  return [...groups.entries()].sort(
    ([a], [b]) => (STAGE_DISPLAY_ORDER.indexOf(a) + 1 || 99) - (STAGE_DISPLAY_ORDER.indexOf(b) + 1 || 99),
  );
}

async function loadDisease(slug: string) {
  try {
    return await getDisease(slug);
  } catch {
    return null;
  }
}

async function loadAcronyms(slugs: string[]) {
  if (!slugs.length) return new Map<string, string>();
  try {
    return await trialSlugsExisting(slugs);
  } catch {
    return new Map<string, string>();
  }
}

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

function NavLinks({ groups }: { groups: ModuleGroup[] }) {
  const linkCls = "block rounded-md px-2 py-1 text-[13px] leading-snug text-ink-2 hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-ring";
  return (
    <ol className="space-y-4">
      {groups.map((g) => (
        <li key={g.id}>
          <a href={`#${g.id}`} className="mb-1 block px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3 hover:text-ink">
            {g.title}
          </a>
          <ol className="space-y-0.5">
            {g.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={linkCls}>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </li>
      ))}
      <li>
        <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Reference</p>
        <ol className="space-y-0.5">
          <li><a href="#classification" className={linkCls}>Classification</a></li>
          <li><a href="#biomarkers" className={linkCls}>Biomarkers</a></li>
          <li><a href="#trials" className={linkCls}>Curated trials</a></li>
        </ol>
      </li>
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function TrialChips({ slugs, acronyms }: { slugs: string[]; acronyms: Map<string, string> }) {
  const present = slugs.filter((s) => acronyms.has(s));
  if (!present.length) return null;
  return (
    <div className="mt-5">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Linked trials</p>
      <ul className="flex flex-wrap gap-2">
        {present.map((slug) => (
          <li key={slug}>
            <Link
              href={`/trials/${slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2/70 px-3 py-1 text-xs font-medium text-ink-2 transition-colors hover:border-border-strong hover:bg-surface-3 hover:text-ink focus-visible:outline-2 focus-visible:outline-ring"
            >
              <FlaskConical className="h-3 w-3" aria-hidden />
              {acronyms.get(slug)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ModuleSectionView({ section, acronyms }: { section: ModuleSection; acronyms: Map<string, string> }) {
  const headingId = `${section.id}-heading`;
  return (
    <section id={section.id} aria-labelledby={headingId} className="scroll-mt-20">
      <details open className="group rounded-2xl border border-border bg-surface shadow-soft">
        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-2xl px-5 py-4 focus-visible:outline-2 focus-visible:outline-ring sm:px-6 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <h3 id={headingId} className="font-serif text-xl leading-snug tracking-tight text-ink">
              {section.title}
            </h3>
            {section.evidenceType && (
              <Badge tone={EVIDENCE_TONE[section.evidenceType]} className="mt-2">
                {EVIDENCE_LABEL[section.evidenceType]}
              </Badge>
            )}
          </div>
          <ChevronDown aria-hidden className="mt-1.5 h-4 w-4 shrink-0 text-ink-3 transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-border/70 px-5 pb-6 pt-4 sm:px-6">
          <p className="max-w-3xl text-[15px] leading-relaxed text-ink-2">{section.summary}</p>
          <ul className="mt-4 max-w-3xl space-y-2">
            {section.keyPoints.map((p, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          {section.pearls?.length ? (
            <aside role="note" aria-label="Pearls and exam traps" className="mt-5 max-w-3xl rounded-xl border border-sand/40 bg-sand-soft px-4 py-3">
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-sand">
                <Lightbulb className="h-3.5 w-3.5" aria-hidden />
                Pearls &amp; traps
              </p>
              <ul className="space-y-1.5">
                {section.pearls.map((p, i) => (
                  <li key={i} className="text-sm leading-relaxed text-ink-2">{p}</li>
                ))}
              </ul>
            </aside>
          ) : null}
          {section.trialSlugs?.length ? <TrialChips slugs={section.trialSlugs} acronyms={acronyms} /> : null}
        </div>
      </details>
    </section>
  );
}

function ModuleGroupView({ group, acronyms }: { group: ModuleGroup; acronyms: Map<string, string> }) {
  const headingId = `${group.id}-heading`;
  return (
    <section
      id={group.id}
      aria-labelledby={headingId}
      className={cn("scroll-mt-20", group.submodule && "rounded-3xl border border-border bg-surface-2/50 p-4 sm:p-6")}
    >
      <div className="mb-5 max-w-3xl">
        {group.submodule && <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">Submodule</p>}
        <h2 id={headingId} className="font-serif text-2xl tracking-tight text-ink">
          {group.title}
        </h2>
        {group.description && <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{group.description}</p>}
      </div>
      <div className="space-y-4">
        {group.sections.map((s) => (
          <ModuleSectionView key={s.id} section={s} acronyms={acronyms} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export async function DiseaseModule({ content }: { content: DiseaseModuleContent }) {
  const def = DISEASE_DEFS.find((d) => d.slug === content.diseaseSlug);
  const allSlugs = [...new Set(content.groups.flatMap((g) => g.sections.flatMap((s) => s.trialSlugs ?? [])))];
  const [disease, acronyms] = await Promise.all([loadDisease(content.diseaseSlug), loadAcronyms(allSlugs)]);

  const name = disease?.name ?? def?.name ?? content.diseaseSlug;
  const trials: ModuleTrial[] = disease?.trials ?? [];
  const trialGroups = groupTrialsByStage(trials);
  const sectionCount = content.groups.reduce((n, g) => n + g.sections.length, 0);

  return (
    <>
      <PageHeader
        eyebrow="Disease module"
        title={name}
        description={
          <>
            {def?.tagline && <p className="font-serif text-lg italic text-ink">{def.tagline}</p>}
            <p className={cn(def?.tagline && "mt-2")}>{disease?.description ?? def?.description}</p>
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={DISEASE_TONE[content.diseaseSlug]}>{def?.shortName ?? name}</Badge>
          <Badge>{sectionCount} sections</Badge>
          {disease && <Badge>{trials.length} curated {trials.length === 1 ? "trial" : "trials"}</Badge>}
          <Badge tone="warning">Awaiting expert review</Badge>
          <span className="text-xs text-ink-3">
            Editorial content as of <time dateTime={content.asOf}>{formatDate(content.asOf)}</time>
          </span>
        </div>
      </PageHeader>

      <div className="mb-8">
        <Notice tone="warning" title="Editorial status">
          {content.status}
        </Notice>
      </div>

      {/* Mobile / tablet section navigation */}
      <details className="mb-8 rounded-2xl border border-border bg-surface lg:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-ink focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
          <ListTree className="h-4 w-4 text-ink-3" aria-hidden />
          On this page
          <ChevronDown className="ml-auto h-4 w-4 text-ink-3" aria-hidden />
        </summary>
        <nav aria-label={`${name} module sections`} className="border-t border-border px-2 py-3">
          <NavLinks groups={content.groups} />
        </nav>
      </details>

      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <nav
            aria-label={`${name} module contents`}
            className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-6 pr-1"
          >
            <p className="mb-3 flex items-center gap-1.5 px-2 text-xs font-medium text-ink-3">
              <ListTree className="h-3.5 w-3.5" aria-hidden />
              On this page
            </p>
            <NavLinks groups={content.groups} />
          </nav>
        </aside>

        <div className="min-w-0 space-y-14">
          {content.groups.map((g) => (
            <ModuleGroupView key={g.id} group={g} acronyms={acronyms} />
          ))}

          {/* Classification */}
          <section id="classification" aria-label="Classification" className="scroll-mt-20">
            <SectionHeading eyebrow="Reference" title="Classification" description="Subtypes, histologies and staging systems held in the ONCOATLAS taxonomy." />
            {disease ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-5">
                  <h3 className="mb-3 text-sm font-semibold text-ink">Subtypes</h3>
                  {disease.subtypes.length ? (
                    <ul className="space-y-2.5">
                      {disease.subtypes.map((s) => (
                        <li key={s.id} className="text-sm">
                          <span className="font-medium text-ink">{s.name}</span>
                          {s.description && <span className="block text-xs leading-relaxed text-ink-3">{s.description}</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-ink-3">No subtypes recorded.</p>
                  )}
                </Card>
                <Card className="p-5">
                  <h3 className="mb-3 text-sm font-semibold text-ink">Histologies</h3>
                  {disease.histologies.length ? (
                    <ul className="space-y-2.5">
                      {disease.histologies.map((h) => (
                        <li key={h.id} className="text-sm">
                          <span className="font-medium text-ink">{h.name}</span>
                          {(h.classification || h.description) && (
                            <span className="block text-xs leading-relaxed text-ink-3">
                              {[h.classification, h.description].filter(Boolean).join(" · ")}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-ink-3">No histologies recorded.</p>
                  )}
                </Card>
                <Card className="p-5 md:col-span-2">
                  <h3 className="mb-3 text-sm font-semibold text-ink">Stage systems &amp; versions</h3>
                  {disease.stageSystems.length ? (
                    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                      {disease.stageSystems.map((s) => (
                        <div key={s.id}>
                          <dt className="text-sm font-medium text-ink">{s.name}</dt>
                          <dd className="mt-1 flex flex-wrap gap-1.5">
                            {s.versions.map((v) => (
                              <Badge key={v.id} title={v.notes ?? undefined}>{v.label}</Badge>
                            ))}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="text-sm text-ink-3">No stage systems recorded.</p>
                  )}
                </Card>
              </div>
            ) : (
              <EmptyState title="Classification unavailable">The database could not be reached. Editorial content above is unaffected.</EmptyState>
            )}
          </section>

          {/* Biomarkers */}
          <section id="biomarkers" aria-label="Biomarkers" className="scroll-mt-20">
            <SectionHeading eyebrow="Reference" title="Biomarkers" description="Open a biomarker for its biology, assays, linked drugs and trials." />
            {disease?.biomarkers.length ? (
              <ul className="flex flex-wrap gap-2">
                {[...disease.biomarkers]
                  .sort((a, b) => a.biomarker.name.localeCompare(b.biomarker.name))
                  .map(({ biomarker }) => (
                    <li key={biomarker.slug}>
                      <Link
                        href={`/biomarkers/${biomarker.slug}`}
                        className="inline-flex flex-col rounded-xl border border-border bg-surface px-3.5 py-2 transition-colors hover:border-border-strong hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        <span className="text-sm font-medium text-ink">{biomarker.name}</span>
                        <span className="text-[11px] text-ink-3">{labelFor(BIOMARKER_CATEGORY_LABEL, biomarker.category)}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            ) : (
              <EmptyState title="No biomarkers linked">Biomarker links appear here once the taxonomy is seeded.</EmptyState>
            )}
          </section>

          {/* Trials */}
          <section id="trials" aria-label="Curated trials" className="scroll-mt-20">
            <SectionHeading
              eyebrow="Evidence"
              title="Curated trials"
              description="Every source-linked trial in this module, grouped by disease setting. Numbers live in each trial's evidence dossier."
              action={
                <Link href={`/trials?disease=${content.diseaseSlug}`} className="text-sm font-medium text-accent hover:underline">
                  Open in trial explorer
                </Link>
              }
            />
            {trialGroups.length ? (
              <div className="space-y-8">
                {trialGroups.map(([stage, rows]) => (
                  <div key={stage}>
                    <h3 className="mb-3 flex items-baseline gap-2 text-sm font-semibold text-ink">
                      {labelFor(STAGE_LABEL, stage)}
                      <span className="text-xs font-normal text-ink-3">{rows.length} {rows.length === 1 ? "trial" : "trials"}</span>
                    </h3>
                    <TrialTable trials={rows} showDisease={false} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={<BookOpenCheck className="h-6 w-6" />} title="No curated trials yet">
                {disease ? "Trials for this disease have not been curated yet." : "The database could not be reached."}
              </EmptyState>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
