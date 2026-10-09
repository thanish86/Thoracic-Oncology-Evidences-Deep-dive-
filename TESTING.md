# Testing

| Layer | Tool | Location | What it covers |
|---|---|---|---|
| Content integrity (CI gate) | Vitest | `src/lib/__tests__/content-integrity.test.ts` | All `/content` files parse; every number appears in its verbatim quote; no unreviewed VERIFIED; unique slugs; no future-dated publications; schema rejects fabricated values, orphan sources and unquoted doses |
| Unit | Vitest | `src/lib/__tests__/compare-citations.test.ts` | Comparability warnings, RIS/BibTeX/Vancouver, estimate formatting, registry URLs, stable analysis keys |
| Statistics maths | Vitest | `src/lib/stats/__tests__/` | Kaplan–Meier (hand-computed example, ties), log-rank, Schoenfeld events (HR 0.75 → 380 events), RMST, non-inferiority, competing risks, PRNG determinism |
| Ingestion / API contracts | Vitest + mocked `fetch` | `src/server/__tests__/ingestion.test.ts` | PubMed XML parsing (synthetic fixture), E-utilities params, retry/backoff and fail-fast on 4xx, ClinicalTrials.gov v2 parsing + 404, drafts never contain outcomes |
| Database integration | Vitest (node) + seeded Postgres | `src/server/__tests__/services.db.test.ts` | Provenance completeness, filters, full-text search, dossier assembly, compare ordering, global search, timeline, biomarker links. Skipped when `DATABASE_URL` is unset |
| End-to-end | Playwright | `e2e/routes.spec.ts`, `e2e/trial.spec.ts` | Every route renders without page errors; 404 for unknown trial; 11 tabs; sourced values and PubMed links; deep-linking and keyboard tab navigation; bookmarks persist; URL filters; compare warnings; ⌘K search; RIS export |
| Accessibility | Playwright + axe-core | `e2e/a11y.spec.ts` | No serious/critical WCAG 2 A/AA violations on 7 key pages; skip link |
| Responsive | Playwright (Pixel 7) | `e2e/responsive.spec.ts` | No horizontal page scroll on mobile; navigation drawer works |
| Migrations | Prisma | CI | `prisma migrate deploy` on a clean Postgres + seed |

## Running

```bash
npm test                         # all Vitest suites (DB suite needs DATABASE_URL + seeded DB)
npm run build && npm run test:e2e
npm run verify                   # validate → typecheck → lint → test → build
```
Playwright uses `next start` on port 3200. In containers without the pinned browser build it falls back to
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (override with `PW_CHROMIUM_PATH`).

## Last recorded results (2026-10-09, build container)

- `npm run content:validate`: 119 trials, 398 outcome values — all valid.
- `tsc --noEmit`: clean. `eslint .`: clean.
- Vitest: **7 files, 72 tests passed**.
- `next build`: succeeded (34 routes).
- Playwright: **48 passed** (43 desktop incl. 7 axe audits, 5 mobile).

## Not yet covered
Visual regression snapshots, React Testing Library component tests for client islands, load testing, and authenticated review flows
(blocked on auth). A security review of the server action and API routes was done manually (see ARCHITECTURE.md › Security); no
automated SAST is configured.
