import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { toBibtex, toRis, toVancouver, type CitationInput } from "@/lib/citations";
import { prisma } from "@/server/db";

export const dynamic = "force-dynamic";

const schema = z.object({
  slugs: z.string().max(4000).transform((s) => s.split(",").map((x) => x.trim()).filter((x) => /^[a-z0-9-]+$/.test(x)).slice(0, 100)),
  format: z.enum(["ris", "bibtex", "vancouver"]).default("ris"),
});

/** GET /api/references?slugs=a,b&format=ris|bibtex|vancouver — export citations for trials. */
export async function GET(req: NextRequest) {
  const parsed = schema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "invalid_query" }, { status: 400 });
  const pubs = await prisma.trialPublication.findMany({
    where: { trial: { slug: { in: parsed.data.slugs } } },
    include: { sourceDocument: true, trial: { select: { slug: true, acronym: true } } },
    orderBy: [{ trial: { acronym: "asc" } }, { sourceDocument: { year: "asc" } }],
  });
  const items: CitationInput[] = pubs.map((p) => ({
    key: `${p.trial.acronym}_${p.sourceDocument.year ?? ""}_${p.sourceDocument.pmid ?? ""}`,
    title: p.sourceDocument.title,
    journal: p.sourceDocument.journal,
    year: p.sourceDocument.year,
    firstAuthor: p.sourceDocument.firstAuthor,
    pmid: p.sourceDocument.pmid,
    doi: p.sourceDocument.doi,
  }));
  const { format } = parsed.data;
  const body = format === "ris" ? toRis(items) : format === "bibtex" ? toBibtex(items) : items.map((c, i) => `${i + 1}. ${toVancouver(c)}`).join("\n");
  const ext = format === "ris" ? "ris" : format === "bibtex" ? "bib" : "txt";
  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Content-Disposition": `attachment; filename="oncoatlas-references.${ext}"` },
  });
}
