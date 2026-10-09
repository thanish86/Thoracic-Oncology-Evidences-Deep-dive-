/**
 * PubMed E-utilities client (esearch + efetch).
 * NCBI policy: ≤3 requests/second without an API key, ≤10 with NCBI_API_KEY.
 * https://www.ncbi.nlm.nih.gov/books/NBK25497/
 */
import { z } from "zod";
import { politeFetch, type FetchLike } from "./http";

const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

function baseParams() {
  const p = new URLSearchParams({ tool: "oncoatlas", email: process.env.CONTACT_EMAIL ?? "" });
  if (process.env.NCBI_API_KEY) p.set("api_key", process.env.NCBI_API_KEY);
  return p;
}
const interval = () => (process.env.NCBI_API_KEY ? 110 : 350);

const esearchSchema = z.object({
  esearchresult: z.object({ count: z.string(), idlist: z.array(z.string()) }),
});

export async function searchPubMed(term: string, { retmax = 20, fetchImpl }: { retmax?: number; fetchImpl?: FetchLike } = {}) {
  const p = baseParams();
  p.set("db", "pubmed");
  p.set("term", term);
  p.set("retmode", "json");
  p.set("retmax", String(Math.min(retmax, 200)));
  const res = await politeFetch(`${EUTILS}/esearch.fcgi?${p}`, { minIntervalMs: interval(), fetchImpl });
  const json = esearchSchema.parse(await res.json());
  return { count: Number(json.esearchresult.count), pmids: json.esearchresult.idlist };
}

export interface PubMedRecord {
  pmid: string;
  doi?: string;
  title: string;
  journal: string;
  journalIso?: string;
  year?: number;
  publicationDate?: string;
  firstAuthor?: string;
  abstract: string;
  publicationTypes: string[];
  registryIds: string[];
}

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/g, "&")
    .trim();

function first(xml: string, re: RegExp): string | undefined {
  const m = xml.match(re);
  return m ? decode(m[1]) : undefined;
}

const MONTHS: Record<string, string> = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };

/** Parse a PubmedArticleSet XML document (efetch) into structured records. */
export function parsePubMedXml(xml: string): PubMedRecord[] {
  const articles = xml.split(/<PubmedArticle>/).slice(1);
  return articles.map((a) => {
    const pmid = first(a, /<PMID[^>]*>(\d+)<\/PMID>/) ?? "";
    const doi = first(a, /<ArticleId IdType="doi">([^<]+)<\/ArticleId>/) ?? first(a, /<ELocationID EIdType="doi"[^>]*>([^<]+)<\/ELocationID>/);
    const abstractParts = [...a.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)].map((m) => {
      const label = m[1].match(/Label="([^"]+)"/)?.[1];
      const text = decode(m[2]);
      return label ? `${label}: ${text}` : text;
    });
    const pubDate = a.match(/<PubDate>([\s\S]*?)<\/PubDate>/)?.[1] ?? "";
    const y = first(pubDate, /<Year>(\d{4})<\/Year>/);
    const mRaw = first(pubDate, /<Month>([^<]+)<\/Month>/);
    const d = first(pubDate, /<Day>(\d+)<\/Day>/);
    const m = mRaw ? (MONTHS[mRaw] ?? (/^\d+$/.test(mRaw) ? mRaw.padStart(2, "0") : undefined)) : undefined;
    const lastName = first(a, /<Author[^>]*>[\s\S]*?<LastName>([^<]+)<\/LastName>/);
    const initials = first(a, /<Author[^>]*>[\s\S]*?<Initials>([^<]+)<\/Initials>/);
    const abstract = abstractParts.join("\n\n");
    const registryIds = [...new Set([...(abstract.match(/NCT\d{8}/g) ?? []), ...[...a.matchAll(/<AccessionNumber>(NCT\d{8})<\/AccessionNumber>/g)].map((x) => x[1])])];
    return {
      pmid,
      doi,
      title: first(a, /<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/) ?? "",
      journal: first(a, /<Journal>[\s\S]*?<Title>([\s\S]*?)<\/Title>/) ?? "",
      journalIso: first(a, /<ISOAbbreviation>([^<]+)<\/ISOAbbreviation>/),
      year: y ? Number(y) : undefined,
      publicationDate: y ? [y, m, m && d ? d.padStart(2, "0") : undefined].filter(Boolean).join("-") : undefined,
      firstAuthor: lastName ? `${lastName}${initials ? ` ${initials}` : ""}` : undefined,
      abstract,
      publicationTypes: [...a.matchAll(/<PublicationType[^>]*>([^<]+)<\/PublicationType>/g)].map((x) => decode(x[1])),
      registryIds,
    };
  });
}

export async function fetchPubMedRecords(pmids: string[], { fetchImpl }: { fetchImpl?: FetchLike } = {}): Promise<PubMedRecord[]> {
  const ids = pmids.filter((p) => /^\d{1,9}$/.test(p));
  if (!ids.length) return [];
  const out: PubMedRecord[] = [];
  for (let i = 0; i < ids.length; i += 100) {
    const p = baseParams();
    p.set("db", "pubmed");
    p.set("id", ids.slice(i, i + 100).join(","));
    p.set("retmode", "xml");
    const res = await politeFetch(`${EUTILS}/efetch.fcgi?${p}`, { minIntervalMs: interval(), fetchImpl });
    out.push(...parsePubMedXml(await res.text()));
  }
  return out;
}
