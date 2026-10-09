# Database schema

Source: `prisma/schema.prisma`. Migrations: `prisma/migrations/` (`init`, `fulltext_search`).

## Entity groups

### Taxonomy
`CancerType` (breast, nsclc, sclc, thymic, mesothelioma; `organSystem` for future areas) → `CancerSubtype`, `Histology`,
`StageSystem` → `StageVersion` (e.g. IASLC 8th / 9th).

### Molecular & pharmacology
`MolecularPathway` → `Biomarker` ↔ `CancerType` (`BiomarkerOnCancer`) ↔ `Drug` (`BiomarkerOnDrug`).
`Drug` → `RegulatoryIndication` (per **jurisdiction**, must cite `SourceDocument`) → `RegulatoryDecision` (dated).
`DrugRegimen` ↔ `Drug` (`RegimenDrug`, dosing must cite a source).

### Clinical trials
```
ClinicalTrial ─┬─ TrialDesign (1:1)
               ├─ TrialArm (n)                dosing only with doseSourceQuote
               ├─ TrialEligibility (n)
               ├─ TrialPublication (n) ──► SourceDocument      one trial, many publications
               ├─ TrialEndpoint (n) ─► TrialOutcome (endpoint × population)
               │                         └─► TrialOutcomeAnalysis (n, append-only) ──► SourceDocument
               ├─ TrialSubgroup (n) ──► SourceDocument
               ├─ TrialSafety (n)   ──► SourceDocument
               ├─ TrialBiomarker / TrialDrug (slug links, nullable FK)
               ├─ EvidenceClaim (n) ──► SourceDocument
               └─ EvidenceTimelineEvent (n)
```
`TrialOutcomeAnalysis` stores: analysis label, arm labels/values (as reported strings), effect measure (HR/OR/RR/DIFF), estimate,
CI level and bounds, P (as printed), follow-up, data cut-off, **source document, location and verbatim quote**, evidence status, and
`supersededById` for history.

### Provenance & governance
`SourceDocument` (kind, PMID/DOI unique, URL, retrievedVia, retrievedAt, cutoff, licence note, status).
`VerificationRecord` (entityType + stable entityId, action, from/to status, reviewer, comment) — **not cleared by the seed**.
`IngestionJob` (source, externalId unique, stage `DISCOVERED → … → PUBLISHED/REJECTED`, payload, error, attempts).
`AuditLog` (user, action, entity, diff).

### Guidelines, timeline, algorithms, education
`Guideline` (body, version, date) → `GuidelineRecommendation` (level/grade, source). `EvidenceTimelineEvent` (date, type, disease,
stages, classes, biomarkers, jurisdiction). `ClinicalAlgorithm` (jurisdiction, asOf, graph JSON). `QuizQuestion`.

### Workspace
`User` (role READER/EDITOR/REVIEWER/ADMIN), `Bookmark`, `Notebook`, `Annotation`. The initial UI stores workspace data locally; these
models support authenticated sync later. No patient-identifiable fields exist.

## Enums
`EvidenceStatus` VERIFIED · PRELIMINARY · AWAITING_VERIFICATION · UPDATED_ANALYSIS · HISTORICAL · CORRECTED_RETRACTED.
`TrialResult`, `TrialPhase`, `ArmRole`, `EffectMeasure`, `PublicationType`, `SourceKind`, `SafetyCategory`, `Jurisdiction`,
`TimelineEventType`, `IngestionStage`, `VerificationAction`, `UserRole`, `QuizFormat`.

## Indexes
B-tree: `ClinicalTrial(cancerTypeId)`, `(yearOfPrimaryPublication)`, `(evidenceStatus)`; `TrialOutcomeAnalysis(outcomeId)`;
`EvidenceTimelineEvent(year)`; `VerificationRecord(entityType, entityId)`; `AuditLog(entityType, entityId)`; `IngestionJob(stage)`.
GIN full-text (weighted `tsvector`): trials (acronym A; title/setting/intervention B; question/population C), biomarkers, drugs —
via the immutable SQL function `oncoatlas_trial_tsv()`.

## Validation rules
Database constraints are complemented by zod at the content boundary (`src/lib/content/schema.ts`) and the integrity checker. `pgvector`
semantic search is planned; the schema leaves room for an embedding table keyed by `SourceDocument`.
