/**
 * Discovery CLI: npm run ingest:pubmed -- "<PubMed query>" [--max 10]
 * Writes draft records to content/drafts/ for a curator to complete and submit for review,
 * and IngestionJob rows to the database. Never writes outcome values.
 */
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { runDiscovery } from "../src/server/ingestion/pipeline";

const args = process.argv.slice(2);
const maxIdx = args.indexOf("--max");
const retmax = maxIdx >= 0 ? Number(args[maxIdx + 1]) : 10;
const query = args.filter((_, i) => i !== maxIdx && i !== maxIdx + 1).join(" ").trim();
if (!query) {
  console.error('usage: npm run ingest:pubmed -- "<query>" [--max N]');
  process.exit(1);
}

const prisma = new PrismaClient();
runDiscovery(prisma, { query, retmax, log: console.log })
  .then((drafts) => {
    const dir = path.join(process.cwd(), "content", "drafts");
    fs.mkdirSync(dir, { recursive: true });
    for (const d of drafts) fs.writeFileSync(path.join(dir, `${d.slug || d.publications[0].pmid}.draft.json`), JSON.stringify(d, null, 2) + "\n");
    console.log(`wrote ${drafts.length} draft(s) to content/drafts/`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
