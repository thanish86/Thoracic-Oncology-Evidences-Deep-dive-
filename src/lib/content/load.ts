/**
 * Filesystem loader for curated content. Server-only (Node fs).
 * Used by the seed script, the validator CLI and integrity tests.
 */
import fs from "node:fs";
import path from "node:path";
import { biomarkerSchema, drugSchema, trialSchema, type BiomarkerSeed, type DrugSeed, type TrialSeed } from "./schema";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

function readJsonFiles(dir: string): { file: string; data: unknown }[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return readJsonFiles(full);
      if (!entry.name.endsWith(".json")) return [];
      return [{ file: full, data: JSON.parse(fs.readFileSync(full, "utf8")) as unknown }];
    })
    .sort((a, b) => a.file.localeCompare(b.file));
}

export interface LoadError {
  file: string;
  message: string;
}

function parseAll<T>(dir: string, parse: (d: unknown) => { success: true; data: T } | { success: false; error: { issues: { path: PropertyKey[]; message: string }[] } }) {
  const items: T[] = [];
  const errors: LoadError[] = [];
  for (const { file, data } of readJsonFiles(dir)) {
    const res = parse(data);
    if (res.success) items.push(res.data);
    else
      errors.push(
        ...res.error.issues.map((i) => ({ file: path.relative(process.cwd(), file), message: `${i.path.join(".")}: ${i.message}` })),
      );
  }
  return { items, errors };
}

export function loadTrials() {
  return parseAll<TrialSeed>(path.join(CONTENT_ROOT, "trials"), (d) => trialSchema.safeParse(d));
}
export function loadBiomarkers() {
  return parseAll<BiomarkerSeed>(path.join(CONTENT_ROOT, "biomarkers"), (d) => biomarkerSchema.safeParse(d));
}
export function loadDrugs() {
  return parseAll<DrugSeed>(path.join(CONTENT_ROOT, "drugs"), (d) => drugSchema.safeParse(d));
}
