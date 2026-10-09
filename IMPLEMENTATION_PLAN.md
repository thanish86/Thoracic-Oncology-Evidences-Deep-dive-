# Implementation plan & status

Status legend: **Implemented** (works end-to-end, tested) · **Partial** (works, with stated gaps) · **Demo data** (synthetic/illustrative) ·
**Source-verified** (human-approved evidence) · **Backlog**.

## Milestones (initial build, 2026-10-09)

| # | Step | Status | Notes |
|---|---|---|---|
| 1 | Inspect repository, architecture | Implemented | Empty repo → greenfield; see ARCHITECTURE.md |
| 2 | Next.js + TypeScript foundation | Implemented | Next 15.5, React 19, strict TS |
| 3 | Design system, sidebar, ⌘K search, responsive shell | Implemented | Light/dark tokens, WCAG AA contrast (axe-tested) |
| 4 | Dashboard | Implemented | Live DB counts only |
| 5 | Prisma schema, migrations, typed services | Implemented | 40+ models, FTS migration |
| 6 | Trial explorer + 11-tab dossier | Implemented | |
| 7 | Five disease modules | Implemented | Editorial content awaiting expert review |
| 8 | Timeline + comparison | Implemented | |
| 9 | Molecular & drug reference pages | Implemented / Partial | Labelled dosing not ingested |
| 10 | Ingestion + verification workflow | Partial | Clients + drafts + review queue; no scheduler, no auth |
| 11 | Statistics, exams, workspace | Implemented | Stats on demo (synthetic) data; workspace browser-local |
| 12 | Tests, optimisation, documentation | Implemented | 72 unit/integration, 48 e2e |

## Data classification

| Data | Classification |
|---|---|
| 119 trial records, 398 outcome values, 161 sources | Source-quoted from PubMed abstracts; **Awaiting verification** (0 human-verified) |
| Trial appraisal / implications / pearls | Editorial, awaiting expert review |
| 25 biomarker + 56 drug monographs | Editorial, qualitative, awaiting expert review |
| Disease-module text, algorithms, pathology/RT/surgery pages | Editorial, awaiting expert review |
| 22 exam questions | Original, awaiting expert review (some cited DOIs entered from memory — verify) |
| Statistics academy charts | **Demo data** (seeded synthetic simulations, labelled) |
| Timeline events | Derived from curated trial publication dates |
| Guidelines, regulatory decisions, labelled dosing | **None ingested** (empty states by design) |

## Coverage audit: not complete
The 2000–2026 claim is the platform's scope, not its current coverage. Known gaps include: many updated/long-term analyses (e.g.,
5-year KEYNOTE-024/189/407, EMILIA final OS, PALOMA-2 OS, ALTA-1L final), MONALEESA-3, MONARCH 2, DESTINY-Lung02, GEOMETRY mono-1,
ARROW, CheckMate 331, aTTom (no primary paper in PubMed), DREAM3R (protocol only), and the whole subgroup, eligibility, stratification
and power fields (registry/protocol extraction pending).

## Items flagged for expert review (from curation)
- PubMed abstract artefacts (stripped gene names, garbled P values/medians) noted per file in `curation.notes`.
- PEARLS/KEYNOTE-091 labelled POSITIVE (PD-L1 ≥50% co-primary not significant at interim) — alternative: MIXED.
- DeLLphi-301 dose cohorts stored as two single-arm groups (UI columns use arm labels).
- MARS 2 restricted-mean difference stored as text (negative value).
- Statistics academy O'Brien–Fleming/Pocock constants; disease-module statements listed in agent reports (KEYNOTE-604 OS,
  CREST, MARS 2, DLL3 testing, IASLC 9th edition details).

## Next steps (backlog, prioritised)
1. Human verification sprint for landmark trials (reviewer accounts via Supabase Auth; replace token guard).
2. Regulatory ingestion (openFDA labels, Drugs@FDA, EMA EPAR) → `RegulatoryIndication` / `RegulatoryDecision`; labelled dosing.
3. Registry enrichment via ClinicalTrials.gov v2 (eligibility, stratification, enrolment) for all trials with NCT IDs.
4. Scheduled revalidation job (Crossref `update-to` for corrections/retractions; new follow-up publications).
5. Subgroup extraction from text/tables (never from figures); guideline versions (ESMO/ASCO) with dated recommendations.
6. pgvector semantic search; authenticated workspace sync (`Bookmark`, `Notebook`, `Annotation` models exist).
7. Component tests (RTL) and visual regression; performance budget for `/statistics` (largest bundle).
8. Future disease areas (GI, GU, gynae, H&N, CNS, haematology, sarcoma, skin, supportive care) — architecture ready.
