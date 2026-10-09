import "server-only";
import { prisma } from "@/server/db";

export interface SearchHit {
  type: "trial" | "biomarker" | "drug";
  slug: string;
  title: string;
  subtitle: string;
  rank: number;
}

/** Global search across trials, biomarkers and drugs using PostgreSQL FTS plus prefix/ILIKE fallback. */
export async function globalSearch(q: string, limit = 12): Promise<SearchHit[]> {
  const term = q.trim().slice(0, 120);
  if (term.length < 2) return [];
  const like = `%${term}%`;
  const [trials, biomarkers, drugs] = await Promise.all([
    prisma.$queryRaw<{ slug: string; acronym: string; setting: string; year: number; rank: number }[]>`
      SELECT slug, acronym, setting, "yearOfPrimaryPublication" AS year,
        (ts_rank(oncoatlas_trial_tsv("acronym", "officialTitle", "setting", "clinicalQuestion", "picoPopulation", "picoIntervention"),
                 websearch_to_tsquery('english', ${term})) + CASE WHEN acronym ILIKE ${like} THEN 1 ELSE 0 END)::float AS rank
      FROM "ClinicalTrial"
      WHERE oncoatlas_trial_tsv("acronym", "officialTitle", "setting", "clinicalQuestion", "picoPopulation", "picoIntervention")
              @@ websearch_to_tsquery('english', ${term})
         OR acronym ILIKE ${like} OR "officialTitle" ILIKE ${like}
      ORDER BY rank DESC LIMIT ${limit}`,
    prisma.$queryRaw<{ slug: string; name: string; category: string; rank: number }[]>`
      SELECT slug, name, category,
        (ts_rank(setweight(to_tsvector('english', coalesce("name", '') || ' ' || coalesce("gene", '')), 'A') || setweight(to_tsvector('english', coalesce("summary", '')), 'B'),
                 websearch_to_tsquery('english', ${term})) + CASE WHEN name ILIKE ${like} OR gene ILIKE ${like} THEN 1 ELSE 0 END)::float AS rank
      FROM "Biomarker"
      WHERE (setweight(to_tsvector('english', coalesce("name", '') || ' ' || coalesce("gene", '')), 'A') || setweight(to_tsvector('english', coalesce("summary", '')), 'B'))
              @@ websearch_to_tsquery('english', ${term})
         OR name ILIKE ${like} OR gene ILIKE ${like}
      ORDER BY rank DESC LIMIT ${limit}`,
    prisma.$queryRaw<{ slug: string; name: string; drugClass: string; rank: number }[]>`
      SELECT slug, name, "drugClass",
        (ts_rank(setweight(to_tsvector('english', coalesce("name", '') || ' ' || coalesce("drugClass", '')), 'A') || setweight(to_tsvector('english', coalesce("mechanism", '')), 'B'),
                 websearch_to_tsquery('english', ${term})) + CASE WHEN name ILIKE ${like} THEN 1 ELSE 0 END)::float AS rank
      FROM "Drug"
      WHERE (setweight(to_tsvector('english', coalesce("name", '') || ' ' || coalesce("drugClass", '')), 'A') || setweight(to_tsvector('english', coalesce("mechanism", '')), 'B'))
              @@ websearch_to_tsquery('english', ${term})
         OR name ILIKE ${like} OR array_to_string("brandNames", ' ') ILIKE ${like}
      ORDER BY rank DESC LIMIT ${limit}`,
  ]);
  const hits: SearchHit[] = [
    ...trials.map((t) => ({ type: "trial" as const, slug: t.slug, title: t.acronym, subtitle: `${t.setting} · ${t.year}`, rank: t.rank + 0.05 })),
    ...biomarkers.map((b) => ({ type: "biomarker" as const, slug: b.slug, title: b.name, subtitle: `Biomarker · ${b.category}`, rank: b.rank })),
    ...drugs.map((d) => ({ type: "drug" as const, slug: d.slug, title: d.name, subtitle: d.drugClass, rank: d.rank })),
  ];
  return hits.sort((a, b) => b.rank - a.rank).slice(0, limit);
}
