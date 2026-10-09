/** Zod-validated query parameters shared by pages and API routes (no server-only imports). */
import { z } from "zod";
import { DISEASES } from "@/lib/content/schema";

const csv = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((v) => (v === undefined ? [] : (Array.isArray(v) ? v : v.split(",")).map((s) => s.trim()).filter(Boolean)));

const single = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((v) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined);

export const trialFilterSchema = z.object({
  q: single.pipe(z.string().max(120).optional()),
  disease: single.pipe(z.enum(DISEASES).optional().catch(undefined)),
  stage: single,
  biomarker: single,
  cls: single,
  phase: single,
  result: single,
  status: single,
  from: single.pipe(z.coerce.number().int().min(1990).max(2026).optional().catch(undefined)),
  to: single.pipe(z.coerce.number().int().min(1990).max(2026).optional().catch(undefined)),
  sort: single.pipe(z.enum(["year-desc", "year-asc", "acronym"]).optional().catch(undefined)),
});
export type TrialFilters = z.infer<typeof trialFilterSchema>;

export const compareSchema = z.object({ ids: csv.pipe(z.array(z.string().regex(/^[a-z0-9-]+$/)).max(5)) });

export const timelineFilterSchema = z.object({
  disease: single.pipe(z.enum(DISEASES).optional().catch(undefined)),
  type: single,
  biomarker: single,
  cls: single,
  stage: single,
  from: single.pipe(z.coerce.number().int().min(1990).max(2026).optional().catch(undefined)),
  to: single.pipe(z.coerce.number().int().min(1990).max(2026).optional().catch(undefined)),
});
export type TimelineFilters = z.infer<typeof timelineFilterSchema>;

export type SearchParams = Record<string, string | string[] | undefined>;
