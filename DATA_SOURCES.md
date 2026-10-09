# Data sources

| Source | Used for | Access | Limits / licence notes | Status |
|---|---|---|---|---|
| **PubMed / NCBI E-utilities** | Bibliographic metadata, abstracts (verbatim quotes), PMID/DOI | `src/server/ingestion/pubmed.ts` (esearch JSON + efetch XML) | ≤3 req/s without key, ≤10 with `NCBI_API_KEY`; send `tool` and `email`. Abstract text is used for short verbatim quotations with citation. | Client implemented + tested with fixtures. Seed content retrieved via the PubMed MCP connector on 2026-10-09 (direct API egress was blocked in the build container). |
| **ClinicalTrials.gov API v2** | Registry matching, design, enrolment, outcome definitions, eligibility | `src/server/ingestion/clinicaltrials.ts` | Public domain (US NLM); be polite (~4 req/s used). | Client implemented + tested with mocks; registry IDs in content are only those printed in abstracts. |
| **Crossref REST** | DOI metadata, corrections/retractions (`update-to`) | `src/server/ingestion/crossref.ts` | Polite pool via `mailto`. Metadata CC0. | Client implemented; not yet scheduled for revalidation. |
| **FDA (Drugs@FDA, openFDA labels)** | Labelled indications, dosing, approval decisions | Planned | Public domain. | Backlog — no regulatory data shown until ingested. |
| **EMA (EPAR, SmPC)** | EU authorisations and dosing | Planned | Reuse permitted with attribution. | Backlog. |
| **ESMO / ASCO / NCCN guidelines** | Dated recommendations, evidence levels | Planned | NCCN content requires licence; ESMO/ASCO cite with attribution. | Backlog — nothing paraphrased from memory. |
| **IASLC / ITMIG / WHO classifications** | Staging and histology definitions | Editorial references | Cite, do not reproduce tables verbatim beyond fair use. | Qualitative descriptions only. |

## Curated content inventory (as committed)

Run `npm run content:validate` for live counts. At the initial commit the repository contained 119 trial records with 398
source-quoted outcome values (161 source documents), 25 biomarker monographs and 56 drug monographs — all **Awaiting verification**.

## Images

No clinical images are included. Diagrams (pathway maps, schemas, forest plots) are original SVG renderings. Any future image must be
source-licensed (e.g. CC-BY with attribution) and recorded with its licence in `SourceDocument.licenceNote`.
