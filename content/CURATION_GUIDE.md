# ONCOATLAS content curation guide

This guide is binding for every human or AI curator writing files under `/content`.
The machine-readable contract is `src/lib/content/schema.ts`; integrity rules are in
`src/lib/content/integrity.ts`. Run `npm run content:validate` (or
`npx tsx scripts/validate-content.ts`) after every edit — it must pass.

The reference example is `content/trials/nsclc/keynote-024.json`.

## Zero-fabrication rules

1. **Never write a number from memory.** Every HR, CI, P value, median, rate, percentage,
   sample size and dose must be copied from a retrieved source (PubMed abstract via the
   PubMed tools, ClinicalTrials.gov record, or a regulatory label actually fetched).
2. **Verbatim quotes.** Each outcome/safety record has `sourceQuote`: a verbatim excerpt
   of the source that contains every number in that record. The validator rejects
   numbers that are not in the quote. Copy text exactly; do not paraphrase inside a quote.
3. **Provenance.** Each outcome's `source.pmid` (or `doi`) must refer to an entry in the
   trial's `publications` array. Publications must have been retrieved through the
   PubMed tools (`verifiedVia: "PubMed"`), with the PMID, DOI, title, journal and date
   copied from the metadata response. `retrievedAt` is the retrieval date.
4. **If the abstract does not report a value, omit the field.** Incomplete is fine;
   invented is not. Do not compute HRs, absolute differences or medians yourself.
5. **Status.** Agents may only use `AWAITING_VERIFICATION` (or `PRELIMINARY` for
   conference-only/interim data). `VERIFIED` requires a named human reviewer.
6. **Registry IDs.** Only include an NCT/EudraCT number if it is printed in the PubMed
   abstract/metadata or confirmed via the ClinicalTrials.gov tool.
7. **Preserve history.** Original and updated analyses are separate outcome records with
   distinct `analysisLabel`s and separate publications (`type: "UPDATE"` /
   `"FINAL_OS"`). Never overwrite the original result with the update.
8. **Editorial prose** (`appraisal`, `clinicalImplications`, `tumourBoardPearl`,
   `clinicalQuestion`, `pico`) must be qualitative, conservative and consistent with
   the retrieved abstract. No numbers in editorial prose unless they also appear in a
   sourced outcome. Do not claim regulatory approval dates or guideline category
   levels — those are ingested separately.
9. **Date guard.** Today is 2026-10-09. Do not describe unpublished or future results
   as completed evidence.

## Slugs and vocabulary

- Trial slug: lowercase acronym, hyphenated (`keynote-024`, `flaura2`, `checkmate-816`).
- Biomarker slugs: `egfr`, `alk`, `ros1`, `braf`, `met`, `ret`, `ntrk`, `kras`, `her2`
  (ERBB2, used for both lung and breast), `nrg1`, `pd-l1`, `er`, `pr`, `her2-low`,
  `ki-67`, `brca`, `pik3ca`, `esr1`, `akt1`, `pten`, `palb2`, `dll3`, `bap1`,
  `mtap-cdkn2a`, `tmb`.
- Drug slugs: lowercase generic name, hyphenated (`trastuzumab-deruxtecan`,
  `sacituzumab-govitecan`, `pembrolizumab`).
- `treatmentClasses` vocabulary: `chemotherapy`, `immunotherapy`, `tki`, `adc`,
  `endocrine`, `cdk46`, `her2-directed`, `parp`, `pi3k-akt`, `antiangiogenic`,
  `radiotherapy`, `surgery`, `bispecific`, `screening`, `other`.
