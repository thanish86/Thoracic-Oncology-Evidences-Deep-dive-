"use client";

import { useEffect, useState } from "react";
import { Copy, Download, FileText, Plus, X } from "lucide-react";
import { Badge, Button, EmptyState } from "@/components/ui/primitives";
import { useBoardSelection } from "./storage";

export function TumourBoardView({ trialOptions }: { trialOptions: { slug: string; acronym: string; disease: string }[] }) {
  const { items, setItems, ready } = useBoardSelection();
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("Tumour board evidence brief");
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => setBrief(""), [items]);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/briefs?slugs=${items.join(",")}&title=${encodeURIComponent(title)}`);
      setBrief(res.ok ? await res.text() : "Could not generate the brief.");
    } finally {
      setLoading(false);
    }
  };
  const matches = trialOptions.filter((t) => !items.includes(t.slug) && query.length > 0 && `${t.acronym} ${t.disease}`.toLowerCase().includes(query.toLowerCase())).slice(0, 10);

  if (!ready) return <div className="skeleton h-64 rounded-2xl" aria-hidden />;

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="space-y-4">
        <label className="block text-xs text-ink-3">
          Brief title (topic, not patient identifiers)
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink" />
        </label>
        <label className="block text-xs text-ink-3">
          Add trials
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type an acronym…" className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink" />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {matches.map((t) => (
            <button key={t.slug} type="button" onClick={() => { setItems([...items, t.slug]); setQuery(""); }} className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-ink-2 hover:border-accent">
              <Plus className="h-3 w-3" />{t.acronym}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {items.map((s) => (
            <Badge key={s} tone="blue" className="text-xs">
              {trialOptions.find((t) => t.slug === s)?.acronym ?? s}
              <button type="button" onClick={() => setItems(items.filter((x) => x !== s))} aria-label={`Remove ${s}`}><X className="h-3 w-3" /></button>
            </Badge>
          ))}
        </div>
        <Button variant="primary" disabled={!items.length || loading} onClick={generate}><FileText className="h-4 w-4" />{loading ? "Generating…" : "Generate evidence brief"}</Button>
        <p className="text-[11px] leading-relaxed text-ink-3">
          Briefs assemble only stored, source-linked values and flag indirect comparisons. They are educational and contain no patient data — never enter
          identifiable patient information.
        </p>
      </div>
      <div>
        {brief ? (
          <div className="rounded-2xl border border-border bg-surface">
            <div className="flex flex-wrap gap-2 border-b border-border p-3">
              <Button size="sm" onClick={async () => { await navigator.clipboard.writeText(brief); setCopied(true); setTimeout(() => setCopied(false), 1500); }}><Copy className="h-3.5 w-3.5" />{copied ? "Copied" : "Copy Markdown"}</Button>
              <Button size="sm" onClick={() => { const u = URL.createObjectURL(new Blob([brief], { type: "text/markdown" })); const a = document.createElement("a"); a.href = u; a.download = "evidence-brief.md"; a.click(); URL.revokeObjectURL(u); }}><Download className="h-3.5 w-3.5" />Download</Button>
              <Button size="sm" asChild><a href={`/api/references?format=ris&slugs=${items.join(",")}`} download>References (RIS)</a></Button>
            </div>
            <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap p-5 font-mono text-[12.5px] leading-relaxed text-ink-2">{brief}</pre>
          </div>
        ) : (
          <EmptyState icon={<FileText className="h-6 w-6" />} title="Assemble trials for a structured brief">
            Add the trials relevant to the case discussion topic, then generate a Markdown brief with sourced outcomes, comparability warnings and references.
          </EmptyState>
        )}
      </div>
    </div>
  );
}
