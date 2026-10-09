/** Crossref REST client for DOI metadata (polite pool via mailto). https://api.crossref.org */
import { z } from "zod";
import { politeFetch, type FetchLike } from "./http";

const workSchema = z.object({
  message: z.object({
    DOI: z.string(),
    title: z.array(z.string()).default([]),
    "container-title": z.array(z.string()).default([]),
    issued: z.object({ "date-parts": z.array(z.array(z.number())) }).optional(),
    author: z.array(z.object({ family: z.string().optional(), given: z.string().optional() })).optional(),
    "update-to": z.array(z.object({ type: z.string(), DOI: z.string() })).optional(),
    relation: z.record(z.unknown()).optional(),
  }),
});

export async function getCrossrefWork(doi: string, { fetchImpl }: { fetchImpl?: FetchLike } = {}) {
  if (!/^10\.\d{4,9}\/\S+$/.test(doi)) throw new Error(`invalid DOI: ${doi}`);
  const mailto = process.env.CONTACT_EMAIL ? `?mailto=${encodeURIComponent(process.env.CONTACT_EMAIL)}` : "";
  const res = await politeFetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}${mailto}`, { minIntervalMs: 200, fetchImpl });
  const m = workSchema.parse(await res.json()).message;
  const parts = m.issued?.["date-parts"]?.[0] ?? [];
  return {
    doi: m.DOI,
    title: m.title[0] ?? "",
    journal: m["container-title"][0] ?? "",
    year: parts[0],
    firstAuthor: m.author?.[0]?.family,
    /** Crossref "update-to" lists corrections/retractions this record updates. */
    updates: m["update-to"] ?? [],
  };
}
