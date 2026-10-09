/** Reference export formats (pure; unit-tested). */
export interface CitationInput {
  key: string;
  title: string;
  journal?: string | null;
  year?: number | null;
  firstAuthor?: string | null;
  pmid?: string | null;
  doi?: string | null;
}

const clean = (s: string) => s.replace(/[{}]/g, "").replace(/\s+/g, " ").trim();

export function toRis(items: CitationInput[]): string {
  return items
    .map((c) =>
      [
        "TY  - JOUR",
        c.firstAuthor ? `AU  - ${clean(c.firstAuthor)}` : null,
        `TI  - ${clean(c.title)}`,
        c.journal ? `JO  - ${clean(c.journal)}` : null,
        c.year ? `PY  - ${c.year}` : null,
        c.doi ? `DO  - ${c.doi}` : null,
        c.pmid ? `AN  - PMID:${c.pmid}` : null,
        c.pmid ? `UR  - https://pubmed.ncbi.nlm.nih.gov/${c.pmid}/` : null,
        "ER  - ",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");
}

export function toBibtex(items: CitationInput[]): string {
  return items
    .map((c) => {
      const fields = [
        `  title = {${clean(c.title)}}`,
        c.firstAuthor ? `  author = {${clean(c.firstAuthor)} and others}` : null,
        c.journal ? `  journal = {${clean(c.journal)}}` : null,
        c.year ? `  year = {${c.year}}` : null,
        c.doi ? `  doi = {${c.doi}}` : null,
        c.pmid ? `  pmid = {${c.pmid}}` : null,
      ].filter(Boolean);
      return `@article{${c.key.replace(/[^A-Za-z0-9_-]/g, "")},\n${fields.join(",\n")}\n}`;
    })
    .join("\n\n");
}

export function toVancouver(c: CitationInput): string {
  return [c.firstAuthor ? `${c.firstAuthor}, et al.` : null, `${c.title.replace(/\.$/, "")}.`, c.journal ? `${c.journal}.` : null, c.year ? `${c.year}.` : null, c.doi ? `doi:${c.doi}` : null, c.pmid ? `PMID: ${c.pmid}.` : null]
    .filter(Boolean)
    .join(" ");
}
