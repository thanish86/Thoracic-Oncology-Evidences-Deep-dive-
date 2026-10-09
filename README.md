# ONCOATLAS — Oncology Evidence Intelligence

**The Evolution of Cancer Evidence, 2000–2026.** A source-linked clinical evidence atlas for breast cancer, NSCLC, SCLC, thymic
epithelial tumours and pleural/peritoneal mesothelioma — trials, biomarkers, drugs, timelines, algorithms and teaching tools for
consultant oncologists, fellows, researchers and tumour boards.

> **Educational resource, not a medical device.** Every numeric value is linked to its source with a verbatim quote. All curated
> values are currently **Awaiting verification** — none has yet been approved by a human reviewer. The database is **not**
> comprehensive for 2000–2026 (see coverage below).

## Simple version (no coding needed)

[`simple-site/`](simple-site/) is a plain HTML/CSS/JavaScript version focused on thoracic oncology (78 trials).
Double-click `simple-site/index.html` to open it. No install, server or database is needed. See [simple-site/README.md](simple-site/README.md).

## What is in this release

| Area | Status |
|---|---|
| App shell: collapsible sidebar, sticky top bar, breadcrumbs, ⌘K global search (PostgreSQL FTS), dark mode, reading progress, skeletons, empty states | ✅ Implemented |
| Trial explorer (filters: disease, stage, biomarker, class, design, result, year; sortable table) | ✅ Implemented |
| **Trial dossier with 11 tabs** (overview, PICO, design + schema, arms, efficacy, safety, subgroups, updated analyses, appraisal, implications, references) | ✅ Implemented; tabs show "not yet extracted" where data are absent |
| Comparison engine (2–5 trials, indirect-comparison warnings) | ✅ Implemented |
| Evidence timeline (filters, year histogram) | ✅ Implemented (events derived from curated trial publications) |
| Disease modules ×5 (curriculum sections, pearls, classification, biomarkers, trials) | ✅ Implemented — editorial text awaiting expert review |
| Molecular atlas (interactive pathway maps, 25 monographs) | ✅ Implemented — qualitative, awaiting review |
| Pharmacology atlas (56 monographs, source-quoted trial dosing) | ⚠️ Partial — labelled FDA/EMA dosing & indications not yet ingested |
| Treatment algorithm studio (7 React Flow pathways + text outlines) | ✅ Implemented — educational, not jurisdiction-specific |
| Pathology & imaging atlas, radiation, surgery pages | ✅ Implemented — original diagrams only |
| Statistics academy (KM simulator, log-rank, Schoenfeld, RMST, NI, interaction, competing risks) | ✅ Implemented on labelled synthetic data |
| Exam studio (22 original SBA/Type K/vignette questions) | ✅ Implemented — questions awaiting expert review |
| Workspace: bookmarks/collections, notebook, tumour-board briefs, RIS/BibTeX/Vancouver export | ✅ Implemented (browser-local, no accounts, no patient data) |
| Evidence review queue with token-guarded approvals that persist across re-seeds | ✅ Implemented (interim auth) |
| Ingestion: PubMed E-utilities, ClinicalTrials.gov v2, Crossref clients → drafts | ⚠️ Partial — clients tested with fixtures; no scheduler; network egress was unavailable during build |
| Guidelines & regulatory pages | ⚠️ Shell only — data models ready, no data ingested (by design, nothing from memory) |
| Supabase auth, pgvector semantic search, background jobs | ⏳ Backlog |

### Evidence coverage (as committed)

`npm run content:validate` → **119 trials · 398 source-quoted outcome values · 161 source documents · 25 biomarkers · 56 drugs**.
Breast 41 · NSCLC 49 · SCLC 15 · Thymic 5 · Mesothelioma 9. All bibliographic metadata and quoted numbers were retrieved from PubMed
on 2026-10-09. Status: **Awaiting verification** (machine-curated, quote-checked, not human-approved).

## Quick start

```bash
cp .env.example .env               # set DATABASE_URL (PostgreSQL ≥14)
npm ci
npm run db:migrate                 # prisma migrate deploy
npm run db:seed                    # validates /content then loads it
npm run dev                        # http://localhost:3000
```

## Verify

```bash
npm run verify       # content:validate → typecheck → lint → vitest → next build
npm run test:e2e     # Playwright: routes, trial flows, axe a11y, mobile (needs a build)
```
Last run in the build environment: 72/72 Vitest tests, 48/48 Playwright tests, typecheck/lint clean, production build OK
(see `TESTING.md`).

## Routes

`/` · `/dashboard` · `/breast` · `/nsclc` · `/sclc` · `/thymoma` · `/mesothelioma` · `/trials` · `/trials/[slug]` · `/trials/compare` ·
`/timeline` · `/biomarkers` · `/biomarkers/[slug]` · `/drugs` · `/drugs/[slug]` · `/algorithms` · `/algorithms/[slug]` · `/pathology` ·
`/radiation` · `/surgery` · `/guidelines` · `/regulatory` · `/statistics` · `/exams` · `/tumour-board` · `/notebook` · `/bookmarks` ·
`/admin/evidence`. API: `/api/search`, `/api/trials`, `/api/trials/[slug]`, `/api/references`, `/api/briefs`.

## Documentation

[CLAUDE.md](CLAUDE.md) · [ARCHITECTURE.md](ARCHITECTURE.md) · [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) ·
[EVIDENCE_STANDARDS.md](EVIDENCE_STANDARDS.md) · [DATA_SOURCES.md](DATA_SOURCES.md) · [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) ·
[TESTING.md](TESTING.md) · [DEPLOYMENT.md](DEPLOYMENT.md) · [content/CURATION_GUIDE.md](content/CURATION_GUIDE.md)

## Stack

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · Radix UI · cmdk · lucide · Recharts · React Flow ·
TanStack Table · Prisma 6 · PostgreSQL (FTS) · Zod · Vitest · Testing Library · Playwright + axe-core.
