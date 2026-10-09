-- PostgreSQL full-text search over trials, biomarkers and drugs.
-- Expression indexes keep Prisma models free of Unsupported() columns.
CREATE OR REPLACE FUNCTION oncoatlas_trial_tsv(acronym text, title text, setting text, question text, pop text, intervention text)
RETURNS tsvector LANGUAGE sql IMMUTABLE AS $$
  SELECT setweight(to_tsvector('english', coalesce(acronym, '')), 'A')
      || setweight(to_tsvector('english', coalesce(title, '')), 'B')
      || setweight(to_tsvector('english', coalesce(setting, '') || ' ' || coalesce(intervention, '')), 'B')
      || setweight(to_tsvector('english', coalesce(question, '') || ' ' || coalesce(pop, '')), 'C')
$$;

CREATE INDEX "ClinicalTrial_fts_idx" ON "ClinicalTrial" USING GIN (
  oncoatlas_trial_tsv("acronym", "officialTitle", "setting", "clinicalQuestion", "picoPopulation", "picoIntervention")
);

CREATE INDEX "Biomarker_fts_idx" ON "Biomarker" USING GIN (
  (setweight(to_tsvector('english', coalesce("name", '') || ' ' || coalesce("gene", '')), 'A') || setweight(to_tsvector('english', coalesce("summary", '')), 'B'))
);

CREATE INDEX "Drug_fts_idx" ON "Drug" USING GIN (
  (setweight(to_tsvector('english', coalesce("name", '') || ' ' || coalesce("drugClass", '')), 'A') || setweight(to_tsvector('english', coalesce("mechanism", '')), 'B'))
);
