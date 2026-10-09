-- CreateEnum
CREATE TYPE "EvidenceStatus" AS ENUM ('VERIFIED', 'PRELIMINARY', 'AWAITING_VERIFICATION', 'UPDATED_ANALYSIS', 'HISTORICAL', 'CORRECTED_RETRACTED');

-- CreateEnum
CREATE TYPE "TrialResult" AS ENUM ('POSITIVE', 'NEGATIVE', 'NON_INFERIOR', 'MIXED', 'PENDING', 'DESCRIPTIVE');

-- CreateEnum
CREATE TYPE "TrialPhase" AS ENUM ('I', 'I_II', 'II', 'II_III', 'III', 'IV', 'META', 'OBS');

-- CreateEnum
CREATE TYPE "ArmRole" AS ENUM ('EXPERIMENTAL', 'CONTROL', 'SINGLE_ARM', 'OTHER');

-- CreateEnum
CREATE TYPE "EffectMeasure" AS ENUM ('HR', 'OR', 'RR', 'DIFF', 'NONE');

-- CreateEnum
CREATE TYPE "PublicationType" AS ENUM ('PRIMARY', 'UPDATE', 'FINAL_OS', 'SUBGROUP', 'SAFETY', 'QOL', 'PROTOCOL', 'META_ANALYSIS', 'OTHER');

-- CreateEnum
CREATE TYPE "SourceKind" AS ENUM ('JOURNAL_ARTICLE', 'CONFERENCE_ABSTRACT', 'REGISTRY_RECORD', 'REGULATORY_LABEL', 'REGULATORY_REVIEW', 'GUIDELINE', 'PROTOCOL', 'OTHER');

-- CreateEnum
CREATE TYPE "SafetyCategory" AS ENUM ('GRADE3PLUS', 'SERIOUS', 'IMMUNE', 'DISCONTINUATION', 'DEATHS', 'SPECIFIC', 'GENERAL');

-- CreateEnum
CREATE TYPE "Jurisdiction" AS ENUM ('FDA', 'EMA', 'MHRA', 'PMDA', 'CDSCO', 'OTHER');

-- CreateEnum
CREATE TYPE "TimelineEventType" AS ENUM ('LANDMARK_TRIAL', 'NEGATIVE_TRIAL', 'PRACTICE_CHANGE', 'MOLECULAR_BREAKTHROUGH', 'RADIATION_MILESTONE', 'SURGERY_MILESTONE', 'GUIDELINE_UPDATE', 'DRUG_APPROVAL');

-- CreateEnum
CREATE TYPE "IngestionStage" AS ENUM ('DISCOVERED', 'REGISTRY_MATCHED', 'METADATA_RETRIEVED', 'SOURCE_RETRIEVED', 'EXTRACTED', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VerificationAction" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED', 'REVALIDATED', 'CORRECTED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('READER', 'EDITOR', 'REVIEWER', 'ADMIN');

-- CreateEnum
CREATE TYPE "QuizFormat" AS ENUM ('SINGLE_BEST_ANSWER', 'TYPE_K', 'VIGNETTE', 'TRIAL_INTERPRETATION', 'BIOMARKER', 'STAGING', 'IMAGE');

-- CreateTable
CREATE TABLE "CancerType" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "organSystem" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CancerType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CancerSubtype" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cancerTypeId" TEXT NOT NULL,

    CONSTRAINT "CancerSubtype_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Histology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "whoCode" TEXT,
    "classification" TEXT,
    "description" TEXT,
    "cancerTypeId" TEXT NOT NULL,

    CONSTRAINT "Histology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StageSystem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cancerTypeId" TEXT NOT NULL,

    CONSTRAINT "StageSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StageVersion" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "effectiveFrom" TIMESTAMP(3),
    "notes" TEXT,
    "stageSystemId" TEXT NOT NULL,

    CONSTRAINT "StageVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MolecularPathway" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "MolecularPathway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Biomarker" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gene" TEXT,
    "category" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "biology" TEXT NOT NULL,
    "alterations" TEXT[],
    "testingMethods" TEXT[],
    "testingSpecimen" TEXT,
    "testingNotes" TEXT,
    "predictiveRelevance" TEXT NOT NULL,
    "resistance" TEXT[],
    "cnsConsiderations" TEXT,
    "status" "EvidenceStatus" NOT NULL DEFAULT 'AWAITING_VERIFICATION',
    "pathwayId" TEXT,
    "curatedBy" TEXT NOT NULL,
    "reviewedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Biomarker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiomarkerOnCancer" (
    "biomarkerId" TEXT NOT NULL,
    "cancerTypeId" TEXT NOT NULL,

    CONSTRAINT "BiomarkerOnCancer_pkey" PRIMARY KEY ("biomarkerId","cancerTypeId")
);

-- CreateTable
CREATE TABLE "Drug" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brandNames" TEXT[],
    "drugClass" TEXT NOT NULL,
    "targets" TEXT[],
    "mechanism" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "keyToxicities" TEXT[],
    "monitoring" TEXT[],
    "interactions" TEXT,
    "resistance" TEXT,
    "diseases" TEXT[],
    "status" "EvidenceStatus" NOT NULL DEFAULT 'AWAITING_VERIFICATION',
    "curatedBy" TEXT NOT NULL,
    "reviewedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiomarkerOnDrug" (
    "biomarkerId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,

    CONSTRAINT "BiomarkerOnDrug_pkey" PRIMARY KEY ("biomarkerId","drugId")
);

-- CreateTable
CREATE TABLE "DrugRegimen" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "DrugRegimen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegimenDrug" (
    "regimenId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "dosing" TEXT,
    "sourceDocumentId" TEXT,

    CONSTRAINT "RegimenDrug_pkey" PRIMARY KEY ("regimenId","drugId")
);

-- CreateTable
CREATE TABLE "RegulatoryIndication" (
    "id" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "jurisdiction" "Jurisdiction" NOT NULL,
    "indicationText" TEXT NOT NULL,
    "labelledDosing" TEXT,
    "sourceDocumentId" TEXT NOT NULL,
    "status" "EvidenceStatus" NOT NULL DEFAULT 'AWAITING_VERIFICATION',

    CONSTRAINT "RegulatoryIndication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegulatoryDecision" (
    "id" TEXT NOT NULL,
    "indicationId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "decisionDate" TIMESTAMP(3) NOT NULL,
    "sourceDocumentId" TEXT NOT NULL,

    CONSTRAINT "RegulatoryDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalTrial" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "acronym" TEXT NOT NULL,
    "officialTitle" TEXT NOT NULL,
    "cancerTypeId" TEXT NOT NULL,
    "subtypes" TEXT[],
    "stages" TEXT[],
    "setting" TEXT NOT NULL,
    "lineOfTherapy" TEXT,
    "treatmentClasses" TEXT[],
    "phase" "TrialPhase" NOT NULL,
    "sponsor" TEXT,
    "registryIds" JSONB NOT NULL,
    "yearOfPrimaryPublication" INTEGER NOT NULL,
    "clinicalQuestion" TEXT NOT NULL,
    "result" "TrialResult" NOT NULL,
    "landmark" BOOLEAN NOT NULL DEFAULT false,
    "picoPopulation" TEXT NOT NULL,
    "picoIntervention" TEXT NOT NULL,
    "picoComparator" TEXT NOT NULL,
    "picoOutcomes" TEXT NOT NULL,
    "strengths" TEXT[],
    "limitations" TEXT[],
    "clinicalImplications" TEXT,
    "tumourBoardPearl" TEXT,
    "evidenceStatus" "EvidenceStatus" NOT NULL DEFAULT 'AWAITING_VERIFICATION',
    "curatedBy" TEXT NOT NULL,
    "curatedAt" TIMESTAMP(3) NOT NULL,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "curationNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalTrial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrialBiomarker" (
    "trialId" TEXT NOT NULL,
    "biomarkerSlug" TEXT NOT NULL,
    "biomarkerId" TEXT,

    CONSTRAINT "TrialBiomarker_pkey" PRIMARY KEY ("trialId","biomarkerSlug")
);

-- CreateTable
CREATE TABLE "TrialDrug" (
    "trialId" TEXT NOT NULL,
    "drugSlug" TEXT NOT NULL,
    "drugId" TEXT,

    CONSTRAINT "TrialDrug_pkey" PRIMARY KEY ("trialId","drugSlug")
);

-- CreateTable
CREATE TABLE "TrialDesign" (
    "id" TEXT NOT NULL,
    "trialId" TEXT NOT NULL,
    "randomised" BOOLEAN NOT NULL,
    "blinding" TEXT,
    "sampleSize" INTEGER,
    "sampleSizeSourceQuote" TEXT,
    "stratification" TEXT,
    "statisticalPower" TEXT,
    "alpha" TEXT,
    "interimAnalyses" TEXT,
    "crossover" TEXT,
    "notes" TEXT,

    CONSTRAINT "TrialDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrialArm" (
    "id" TEXT NOT NULL,
    "trialId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "role" "ArmRole" NOT NULL,
    "regimen" TEXT NOT NULL,
    "dosing" TEXT,
    "doseSourceQuote" TEXT,
    "n" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TrialArm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrialEligibility" (
    "id" TEXT NOT NULL,
    "trialId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "criterion" TEXT NOT NULL,
    "sourceDocumentId" TEXT,

    CONSTRAINT "TrialEligibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrialEndpoint" (
    "id" TEXT NOT NULL,
    "trialId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "hierarchy" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TrialEndpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrialOutcome" (
    "id" TEXT NOT NULL,
    "endpointId" TEXT NOT NULL,
    "population" TEXT NOT NULL DEFAULT 'ITT',

    CONSTRAINT "TrialOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrialOutcomeAnalysis" (
    "id" TEXT NOT NULL,
    "outcomeId" TEXT NOT NULL,
    "analysisLabel" TEXT NOT NULL,
    "experimentalArm" TEXT,
    "controlArm" TEXT,
    "experimentalValue" TEXT,
    "controlValue" TEXT,
    "effectMeasure" "EffectMeasure" NOT NULL DEFAULT 'NONE',
    "effectEstimate" DOUBLE PRECISION,
    "ciLevel" DOUBLE PRECISION NOT NULL DEFAULT 95,
    "ciLower" DOUBLE PRECISION,
    "ciUpper" DOUBLE PRECISION,
    "pValue" TEXT,
    "followUp" TEXT,
    "dataCutoff" TEXT,
    "sourceDocumentId" TEXT NOT NULL,
    "sourceLocation" TEXT NOT NULL,
    "sourceQuote" TEXT NOT NULL,
    "status" "EvidenceStatus" NOT NULL DEFAULT 'AWAITING_VERIFICATION',
    "supersededById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrialOutcomeAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrialSubgroup" (
    "id" TEXT NOT NULL,
    "trialId" TEXT NOT NULL,
    "variable" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "prespecified" BOOLEAN NOT NULL,
    "effectMeasure" "EffectMeasure" NOT NULL DEFAULT 'HR',
    "effectEstimate" DOUBLE PRECISION,
    "ciLower" DOUBLE PRECISION,
    "ciUpper" DOUBLE PRECISION,
    "interactionP" TEXT,
    "sourceDocumentId" TEXT NOT NULL,
    "sourceQuote" TEXT NOT NULL,
    "status" "EvidenceStatus" NOT NULL DEFAULT 'AWAITING_VERIFICATION',

    CONSTRAINT "TrialSubgroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrialSafety" (
    "id" TEXT NOT NULL,
    "trialId" TEXT NOT NULL,
    "category" "SafetyCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "experimentalValue" TEXT,
    "controlValue" TEXT,
    "sourceDocumentId" TEXT NOT NULL,
    "sourceLocation" TEXT NOT NULL,
    "sourceQuote" TEXT NOT NULL,
    "status" "EvidenceStatus" NOT NULL DEFAULT 'AWAITING_VERIFICATION',

    CONSTRAINT "TrialSafety_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrialPublication" (
    "id" TEXT NOT NULL,
    "trialId" TEXT NOT NULL,
    "sourceDocumentId" TEXT NOT NULL,
    "type" "PublicationType" NOT NULL,
    "label" TEXT,

    CONSTRAINT "TrialPublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceDocument" (
    "id" TEXT NOT NULL,
    "kind" "SourceKind" NOT NULL,
    "title" TEXT NOT NULL,
    "journal" TEXT,
    "year" INTEGER,
    "publicationDate" TEXT,
    "firstAuthor" TEXT,
    "pmid" TEXT,
    "doi" TEXT,
    "registryId" TEXT,
    "url" TEXT,
    "retrievedVia" TEXT NOT NULL,
    "retrievedAt" TIMESTAMP(3) NOT NULL,
    "dataCutoff" TEXT,
    "licenceNote" TEXT,
    "status" "EvidenceStatus" NOT NULL DEFAULT 'AWAITING_VERIFICATION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SourceDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceClaim" (
    "id" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "trialId" TEXT,
    "sourceDocumentId" TEXT NOT NULL,
    "sourceQuote" TEXT NOT NULL,
    "status" "EvidenceStatus" NOT NULL DEFAULT 'AWAITING_VERIFICATION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvidenceClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRecord" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" "VerificationAction" NOT NULL,
    "fromStatus" "EvidenceStatus",
    "toStatus" "EvidenceStatus",
    "comment" TEXT,
    "reviewerId" TEXT,
    "claimId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngestionJob" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "externalId" TEXT,
    "stage" "IngestionStage" NOT NULL DEFAULT 'DISCOVERED',
    "payload" JSONB,
    "error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IngestionJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guideline" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "publishedOn" TIMESTAMP(3),
    "url" TEXT,
    "cancerTypeId" TEXT NOT NULL,

    CONSTRAINT "Guideline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuidelineRecommendation" (
    "id" TEXT NOT NULL,
    "guidelineId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "levelOfEvidence" TEXT,
    "grade" TEXT,
    "sourceDocumentId" TEXT NOT NULL,
    "status" "EvidenceStatus" NOT NULL DEFAULT 'AWAITING_VERIFICATION',

    CONSTRAINT "GuidelineRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceTimelineEvent" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "type" "TimelineEventType" NOT NULL,
    "cancerTypeId" TEXT NOT NULL,
    "trialId" TEXT,
    "jurisdiction" "Jurisdiction",
    "biomarkers" TEXT[],
    "treatmentClasses" TEXT[],
    "stages" TEXT[],
    "status" "EvidenceStatus" NOT NULL DEFAULT 'AWAITING_VERIFICATION',

    CONSTRAINT "EvidenceTimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalAlgorithm" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cancerTypeId" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "asOf" TIMESTAMP(3) NOT NULL,
    "graph" JSONB NOT NULL,
    "status" "EvidenceStatus" NOT NULL DEFAULT 'AWAITING_VERIFICATION',

    CONSTRAINT "ClinicalAlgorithm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "format" "QuizFormat" NOT NULL,
    "topic" TEXT NOT NULL,
    "stem" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "answer" JSONB NOT NULL,
    "explanation" TEXT NOT NULL,
    "trialSlugs" TEXT[],
    "status" "EvidenceStatus" NOT NULL DEFAULT 'AWAITING_VERIFICATION',

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'READER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entitySlug" TEXT NOT NULL,
    "collection" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notebook" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'notes',
    "body" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notebook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Annotation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notebookId" TEXT,
    "entityType" TEXT NOT NULL,
    "entitySlug" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Annotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "diff" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CancerType_slug_key" ON "CancerType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CancerSubtype_cancerTypeId_slug_key" ON "CancerSubtype"("cancerTypeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "MolecularPathway_slug_key" ON "MolecularPathway"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Biomarker_slug_key" ON "Biomarker"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Drug_slug_key" ON "Drug"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "DrugRegimen_slug_key" ON "DrugRegimen"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicalTrial_slug_key" ON "ClinicalTrial"("slug");

-- CreateIndex
CREATE INDEX "ClinicalTrial_cancerTypeId_idx" ON "ClinicalTrial"("cancerTypeId");

-- CreateIndex
CREATE INDEX "ClinicalTrial_yearOfPrimaryPublication_idx" ON "ClinicalTrial"("yearOfPrimaryPublication");

-- CreateIndex
CREATE INDEX "ClinicalTrial_evidenceStatus_idx" ON "ClinicalTrial"("evidenceStatus");

-- CreateIndex
CREATE UNIQUE INDEX "TrialDesign_trialId_key" ON "TrialDesign"("trialId");

-- CreateIndex
CREATE UNIQUE INDEX "TrialEndpoint_trialId_code_label_key" ON "TrialEndpoint"("trialId", "code", "label");

-- CreateIndex
CREATE UNIQUE INDEX "TrialOutcome_endpointId_population_key" ON "TrialOutcome"("endpointId", "population");

-- CreateIndex
CREATE INDEX "TrialOutcomeAnalysis_outcomeId_idx" ON "TrialOutcomeAnalysis"("outcomeId");

-- CreateIndex
CREATE UNIQUE INDEX "TrialPublication_trialId_sourceDocumentId_key" ON "TrialPublication"("trialId", "sourceDocumentId");

-- CreateIndex
CREATE UNIQUE INDEX "SourceDocument_pmid_key" ON "SourceDocument"("pmid");

-- CreateIndex
CREATE UNIQUE INDEX "SourceDocument_doi_key" ON "SourceDocument"("doi");

-- CreateIndex
CREATE INDEX "VerificationRecord_entityType_entityId_idx" ON "VerificationRecord"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "IngestionJob_stage_idx" ON "IngestionJob"("stage");

-- CreateIndex
CREATE UNIQUE INDEX "IngestionJob_source_externalId_key" ON "IngestionJob"("source", "externalId");

-- CreateIndex
CREATE INDEX "EvidenceTimelineEvent_year_idx" ON "EvidenceTimelineEvent"("year");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicalAlgorithm_slug_key" ON "ClinicalAlgorithm"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "QuizQuestion_slug_key" ON "QuizQuestion"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_entityType_entitySlug_key" ON "Bookmark"("userId", "entityType", "entitySlug");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "CancerSubtype" ADD CONSTRAINT "CancerSubtype_cancerTypeId_fkey" FOREIGN KEY ("cancerTypeId") REFERENCES "CancerType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Histology" ADD CONSTRAINT "Histology_cancerTypeId_fkey" FOREIGN KEY ("cancerTypeId") REFERENCES "CancerType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageSystem" ADD CONSTRAINT "StageSystem_cancerTypeId_fkey" FOREIGN KEY ("cancerTypeId") REFERENCES "CancerType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageVersion" ADD CONSTRAINT "StageVersion_stageSystemId_fkey" FOREIGN KEY ("stageSystemId") REFERENCES "StageSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biomarker" ADD CONSTRAINT "Biomarker_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES "MolecularPathway"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiomarkerOnCancer" ADD CONSTRAINT "BiomarkerOnCancer_biomarkerId_fkey" FOREIGN KEY ("biomarkerId") REFERENCES "Biomarker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiomarkerOnCancer" ADD CONSTRAINT "BiomarkerOnCancer_cancerTypeId_fkey" FOREIGN KEY ("cancerTypeId") REFERENCES "CancerType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiomarkerOnDrug" ADD CONSTRAINT "BiomarkerOnDrug_biomarkerId_fkey" FOREIGN KEY ("biomarkerId") REFERENCES "Biomarker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiomarkerOnDrug" ADD CONSTRAINT "BiomarkerOnDrug_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegimenDrug" ADD CONSTRAINT "RegimenDrug_regimenId_fkey" FOREIGN KEY ("regimenId") REFERENCES "DrugRegimen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegimenDrug" ADD CONSTRAINT "RegimenDrug_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegulatoryIndication" ADD CONSTRAINT "RegulatoryIndication_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegulatoryIndication" ADD CONSTRAINT "RegulatoryIndication_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegulatoryDecision" ADD CONSTRAINT "RegulatoryDecision_indicationId_fkey" FOREIGN KEY ("indicationId") REFERENCES "RegulatoryIndication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegulatoryDecision" ADD CONSTRAINT "RegulatoryDecision_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalTrial" ADD CONSTRAINT "ClinicalTrial_cancerTypeId_fkey" FOREIGN KEY ("cancerTypeId") REFERENCES "CancerType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialBiomarker" ADD CONSTRAINT "TrialBiomarker_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "ClinicalTrial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialBiomarker" ADD CONSTRAINT "TrialBiomarker_biomarkerId_fkey" FOREIGN KEY ("biomarkerId") REFERENCES "Biomarker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialDrug" ADD CONSTRAINT "TrialDrug_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "ClinicalTrial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialDrug" ADD CONSTRAINT "TrialDrug_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialDesign" ADD CONSTRAINT "TrialDesign_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "ClinicalTrial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialArm" ADD CONSTRAINT "TrialArm_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "ClinicalTrial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialEligibility" ADD CONSTRAINT "TrialEligibility_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "ClinicalTrial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialEndpoint" ADD CONSTRAINT "TrialEndpoint_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "ClinicalTrial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialOutcome" ADD CONSTRAINT "TrialOutcome_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "TrialEndpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialOutcomeAnalysis" ADD CONSTRAINT "TrialOutcomeAnalysis_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "TrialOutcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialOutcomeAnalysis" ADD CONSTRAINT "TrialOutcomeAnalysis_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialSubgroup" ADD CONSTRAINT "TrialSubgroup_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "ClinicalTrial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialSubgroup" ADD CONSTRAINT "TrialSubgroup_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialSafety" ADD CONSTRAINT "TrialSafety_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "ClinicalTrial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialSafety" ADD CONSTRAINT "TrialSafety_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialPublication" ADD CONSTRAINT "TrialPublication_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "ClinicalTrial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialPublication" ADD CONSTRAINT "TrialPublication_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceClaim" ADD CONSTRAINT "EvidenceClaim_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "ClinicalTrial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceClaim" ADD CONSTRAINT "EvidenceClaim_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRecord" ADD CONSTRAINT "VerificationRecord_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRecord" ADD CONSTRAINT "VerificationRecord_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "EvidenceClaim"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guideline" ADD CONSTRAINT "Guideline_cancerTypeId_fkey" FOREIGN KEY ("cancerTypeId") REFERENCES "CancerType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuidelineRecommendation" ADD CONSTRAINT "GuidelineRecommendation_guidelineId_fkey" FOREIGN KEY ("guidelineId") REFERENCES "Guideline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuidelineRecommendation" ADD CONSTRAINT "GuidelineRecommendation_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceTimelineEvent" ADD CONSTRAINT "EvidenceTimelineEvent_cancerTypeId_fkey" FOREIGN KEY ("cancerTypeId") REFERENCES "CancerType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceTimelineEvent" ADD CONSTRAINT "EvidenceTimelineEvent_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "ClinicalTrial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalAlgorithm" ADD CONSTRAINT "ClinicalAlgorithm_cancerTypeId_fkey" FOREIGN KEY ("cancerTypeId") REFERENCES "CancerType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notebook" ADD CONSTRAINT "Notebook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
