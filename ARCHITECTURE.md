# Architecture

## Overview

```
content/ (JSON, version-controlled, PR-reviewed)          ← curators / AI agents via PubMed
   │  zod schema + anti-fabrication integrity checks       (src/lib/content)
   ▼
prisma/seed.ts ──► PostgreSQL (Prisma 6)                  ← VerificationRecord (human approvals, never cleared)
                     │  full-text GIN indexes (migration 2)
                     ▼
src/server/services/* (server-only, typed queries) ──► App Router server components (pages)
                     │                                 └─► Route handlers /api/* (JSON, RIS/BibTeX, Markdown briefs)
                     ▼
Client islands: command search, filters, tabs, charts (Recharts), React Flow algorithms, workspace (localStorage)

src/server/ingestion/*  PubMed E-utilities · ClinicalTrials.gov v2 · Crossref  ──► IngestionJob + content/drafts/
/admin/evidence         human review (server action, token-guarded) ──► VerificationRecord + AuditLog
```

## Key decisions

| Decision | Rationale |
|---|---|
| **Evidence as code** (`/content` JSON → DB) | Every value is diff-reviewable, CI-validated and reproducible; the DB is a query/index layer, rebuilt by `db:seed`. |
| **Append-only analyses** (`TrialEndpoint → TrialOutcome → TrialOutcomeAnalysis`) | Original and updated results coexist with their own source, label and cutoff. |
| **Every numeric row references `SourceDocument`** | Provenance is structural, not optional. |
| **Stable analysis keys for verification** | Human approvals survive re-seeding because DB ids are regenerated. |
| **Server components + `force-dynamic`** for evidence pages | Always reflects the current DB; no stale static numbers. |
| **URL-driven filters** | Shareable, server-rendered views; zod-validated params with safe fallbacks. |
| **Local-first workspace** (localStorage) | No accounts and no PHI in the first release; DB models (`User`, `Bookmark`, `Notebook`, `Annotation`) are ready for authenticated sync. |
| **No external fonts/CDNs** | System font stack; works offline and avoids third-party requests. |

## Directory map

| Path | Purpose |
|---|---|
| `src/app/` | Routes (see README route table), `api/` route handlers, `admin/evidence/actions.ts` server action |
| `src/components/ui` | Design-system primitives (Button, Badge, Card, PageHeader, EmptyState, Notice, Skeleton) |
| `src/components/layout` | App shell: collapsible sidebar, sticky top bar, breadcrumbs, ⌘K command search, reading progress, theme toggle |
| `src/components/trials` | Trial table (TanStack), filter bar, 11-tab dossier sections, compare picker |
| `src/components/charts` | Forest plot (SVG, log scale), evidence-by-year (Recharts) |
| `src/components/atlas` | Pathway maps, pathology diagrams, shared atlas UI |
| `src/components/algorithms` | React Flow pathway renderer + accessible outline |
| `src/components/statistics`, `src/lib/stats` | Statistics academy UI + pure, tested maths (KM, log-rank, Schoenfeld, RMST, competing risks) |
| `src/components/exams`, `src/lib/exams` | Exam studio player + original question bank |
| `src/components/disease`, `src/content/modules` | Disease module renderer + editorial module content |
| `src/content/algorithms` | Typed educational pathway graphs |
| `src/components/workspace` | Bookmarks, notebook, tumour board (localStorage) |
| `src/lib/content` | Content schema, loader, integrity checks, stable keys |
| `src/server/services` | All DB access (trials, catalog, search, filters) |
| `src/server/ingestion` | Polite HTTP, PubMed, ClinicalTrials.gov, Crossref clients, pipeline |
| `prisma/` | Schema, migrations, seed |
| `content/` | Curated trials, biomarkers, drugs; `CURATION_GUIDE.md` |
| `e2e/` | Playwright suites (routes, trial flows, a11y, responsive) |

## Security

- Prisma parameterised queries; `$queryRaw` uses tagged templates only (no string interpolation).
- All route params and query strings validated with zod; slugs restricted to `^[a-z0-9-]+$`.
- Review writes require `ADMIN_REVIEW_TOKEN` (≥16 chars, timing-safe comparison); disabled when unset.
- Security headers (`nosniff`, `DENY` framing, referrer policy, permissions policy) in `next.config.ts`; `poweredByHeader` off.
- No secrets in client bundles; `server-only` guards DB modules.
- No patient data stored.

## Extensibility

Adding a disease area (GI, GU, gynae, head & neck, CNS, haematology, sarcoma, skin, supportive care): extend `DISEASES`
(`src/lib/content/schema.ts`), add a `DISEASE_DEFS` entry (`src/lib/taxonomy.ts`), labels/tones (`src/lib/labels.ts`), a navigation
item, a module content file and page. `CancerType.organSystem` already distinguishes organ systems; no schema change is required.
