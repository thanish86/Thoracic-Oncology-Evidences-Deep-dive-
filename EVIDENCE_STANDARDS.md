# Evidence standards

ONCOATLAS is an educational evidence resource. Its value depends entirely on provenance, so the following standards are enforced by
code, not just by convention.

## 1. Evidence statuses

| Status | Meaning | Who can set it |
|---|---|---|
| **Verified** | A named human reviewer approved the value against the cited source and quote. | Human reviewer via `/admin/evidence` (logged in `VerificationRecord` + `AuditLog`) |
| **Preliminary** | Interim, conference-only or otherwise immature data that may change. | Curator |
| **Awaiting verification** | Transcribed from the cited source with a verbatim quote; not yet human-approved. | Curator / AI agent (default) |
| **Updated analysis** | A later analysis of a previously reported endpoint. | Curator |
| **Historical** | Superseded; retained for history. | Curator / reviewer |
| **Corrected / retracted** | Source corrected or retracted (e.g. Crossref `update-to`). | Reviewer |

The Zod schema rejects `VERIFIED` on any trial without `curation.reviewedBy` and `reviewedAt`.

## 2. Zero-fabrication rules (enforced)

| Rule | Enforcement |
|---|---|
| Every numeric outcome has a verbatim `sourceQuote` | Schema requires it; `checkTrialIntegrity()` fails if any number in the value fields (estimate, CI bounds, arm values, P) is absent from the quote |
| Every outcome cites a publication in the trial record | Schema `superRefine` cross-checks PMID/DOI |
| Doses require a dose quote; sample size requires a quote | Schema `superRefine` |
| Estimate lies within its CI; CI has both bounds | Integrity checker |
| Labelled dosing requires an official source URL | Drug schema; empty until ingested |
| Content is valid before it can reach the DB | `prisma/seed.ts` refuses to seed on any error; CI runs the validator and the content-integrity test suite |

## 3. What is never done

- Numbers from memory; derived statistics (computing HRs, absolute differences, NNT) presented as reported values.
- Kaplan–Meier curves reverse-engineered from medians; subgroup values digitised from images.
- Copying copyrighted figures or paywalled full text; presenting inaccessible text as retrieved.
- Ranking treatments across separate trials; ESMO-MCBS/NCCN categories or approval dates without the source document.
- Replacing an original analysis with an update (both are retained, each with its own date and source).

## 4. Known source-text artefacts

PubMed's plain-text abstracts sometimes drop italic gene names ("withmutation"), garble superscripts ("P=3.29×10") or medians.
Curators keep quotes exactly as retrieved, omit garbled values rather than repairing them, and note the artefact in
`curation.notes`. Reviewers should confirm such records against the publisher's version.

## 5. Editorial content

Appraisals, clinical implications, tumour-board pearls, disease-module text, algorithms and quiz explanations are authored, qualitative
syntheses. They carry no unsourced numbers and are labelled "awaiting expert review" until approved.

## 6. Human review workflow

1. Reviewer opens `/admin/evidence`, compares value ↔ quote ↔ source link.
2. Approve (→ Verified), request changes or reject (comment required).
3. The decision is stored against a stable `analysisKey` (`trial|endpoint|label|population|analysis`) so it survives re-seeding.
4. Revalidation: when a source is corrected or a newer analysis appears, the older value moves to Historical/Corrected and the new
   analysis enters as Awaiting verification.
