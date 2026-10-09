/* Validate every curated content file. Exit 1 on any schema or integrity error. */
import { checkTrialIntegrity } from "../src/lib/content/integrity";
import { loadBiomarkers, loadDrugs, loadTrials } from "../src/lib/content/load";

const trials = loadTrials();
const biomarkers = loadBiomarkers();
const drugs = loadDrugs();

const errors = [...trials.errors, ...biomarkers.errors, ...drugs.errors].map((e) => `${e.file}: ${e.message}`);

const slugs = new Map<string, number>();
for (const t of trials.items) {
  slugs.set(t.slug, (slugs.get(t.slug) ?? 0) + 1);
  for (const i of checkTrialIntegrity(t)) errors.push(`${i.trial}: ${i.path}: ${i.message}`);
}
for (const [slug, n] of slugs) if (n > 1) errors.push(`duplicate trial slug ${slug}`);

const outcomes = trials.items.reduce((s, t) => s + t.outcomes.length, 0);
console.log(
  `content: ${trials.items.length} trials (${outcomes} sourced outcome values), ${biomarkers.items.length} biomarkers, ${drugs.items.length} drugs`,
);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n` + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log("all content valid");
