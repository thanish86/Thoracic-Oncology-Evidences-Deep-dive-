# CLAUDE.md — ONCOATLAS long-term instructions

ONCOATLAS (Oncology Evidence Intelligence, "The Evolution of Cancer Evidence, 2000–2026") is an educational, consultant-level evidence
platform for breast cancer, NSCLC, SCLC, thymic epithelial tumours and mesothelioma. Read this file before every change.

## Non-negotiable clinical accuracy rules

1. **Zero fabrication.** Never write an efficacy number, HR, CI, P value, median, rate, percentage, sample size, dose, approval date or
   guideline evidence level from memory — not in content, UI copy, tests, seeds, quiz questions or docs.
2. **Every number has a source and a verbatim quote.** Outcome/safety values live in `content/trials/**.json` with `sourceQuote`
   copied exactly from the retrieved source (usually the PubMed abstract). `npm run content:validate` rejects any number not in its quote.
3. **Nothing is "Verified" without a named human reviewer.** Agents and scripts may only use `AWAITING_VERIFICATION` or `PRELIMINARY`.
   Human approvals happen in `/admin/evidence` and are stored in `VerificationRecord` keyed by `analysisKey()`.
4. **Preserve history.** Updated analyses are new outcome records with their own `analysisLabel` and publication — never overwrite the original.
5. **Incomplete ≠ wrong.** Leave fields empty when the source does not report them; the UI says "Not yet extracted".
6. **No reconstructed figures.** No Kaplan–Meier curves from medians, no subgroup estimates digitised from forest plots, no copied clinical images.
7. **Indirect comparisons are labelled.** Never rank treatments across separate trials; use `assessComparability()` warnings.
8. **Date guard.** The project date context is 2026-10-09. Do not present future or unpublished results as completed evidence.
9. **Editorial prose** (appraisal, implications, pearls, module text) is qualitative and labelled "awaiting expert review".
10. **No patient data.** The workspace stores nothing identifiable; keep it that way.

Curator rules in detail: `content/CURATION_GUIDE.md`. Policy: `EVIDENCE_STANDARDS.md`.

## Architecture constraints

- Next.js 15 App Router, React 19, TypeScript strict, Tailwind v4 (tokens in `src/app/globals.css`), Prisma 6 + PostgreSQL.
- **Source of truth for evidence = version-controlled JSON in `/content`**, validated by Zod (`src/lib/content/schema.ts`) and
  integrity checks (`src/lib/content/integrity.ts`), seeded into Postgres by `prisma/seed.ts`. Do not hand-edit evidence in the DB.
- Server data access only through `src/server/services/*` (marked `server-only`). Never import Prisma into client components.
- Validate all query params / API input with Zod (`src/server/services/filters.ts`).
- Secrets only in server env vars; nothing secret in `NEXT_PUBLIC_*`, client code or this file.
- New disease areas: add to `DISEASES` in `schema.ts` and `DISEASE_DEFS` in `src/lib/taxonomy.ts`, plus a module page — do not fork components.

## Workflow expectations

- Before claiming anything works, run: `npm run content:validate && npm run typecheck && npm run lint && npm test && npm run build`
  and, with the app built, `npm run test:e2e`. Report real results only.
- Adding a trial: follow `content/CURATION_GUIDE.md`, retrieve via PubMed (MCP tools or `npm run ingest:pubmed`), write
  `content/trials/<disease>/<slug>.json`, validate, then `npm run db:seed`.
- Schema changes: edit `prisma/schema.prisma`, create a migration (`npx prisma migrate dev --name <name>`), update `DATABASE_SCHEMA.md`.
- Keep `IMPLEMENTATION_PLAN.md` status tables honest: implemented / partial / demo data / source-verified / backlog.
- Never claim clinical comprehensiveness or production readiness without an audit demonstrating it.

## Useful commands

```bash
npm run dev                 # http://localhost:3000
npm run content:validate    # schema + anti-fabrication integrity checks
npm run db:migrate && npm run db:seed
npm test                    # Vitest (unit + DB integration when DATABASE_URL set)
npm run test:e2e            # Playwright (requires `npm run build`)
npm run ingest:pubmed -- "KEYNOTE-189[Title]" --max 5   # discovery → drafts (needs network)
```
