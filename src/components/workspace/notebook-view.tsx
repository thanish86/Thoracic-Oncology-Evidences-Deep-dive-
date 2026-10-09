"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, Circle, Download, NotebookPen, Plus, Trash2 } from "lucide-react";
import { Badge, Button, EmptyState } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { newId, useNotes, type NoteItem } from "./storage";

const KINDS: { value: NoteItem["kind"]; label: string }[] = [
  { value: "notes", label: "Research note" },
  { value: "journal-club", label: "Journal club" },
  { value: "brief", label: "Evidence brief" },
  { value: "research-question", label: "Open research question" },
];

const TEMPLATES: Record<NoteItem["kind"], string> = {
  notes: "",
  "journal-club": "## Clinical question\n\n## PICO\n\n## Design & risk of bias\n\n## Key results (cite source)\n\n## Applicability\n\n## Discussion points\n",
  brief: "## Question\n\n## Evidence summary\n\n## Uncertainties\n\n## Bottom line\n",
  "research-question": "## Question\n\n## Why it matters\n\n## Existing evidence\n\n## Proposed design\n",
};

export function NotebookView({ trialOptions }: { trialOptions: { slug: string; acronym: string }[] }) {
  const { items, upsert, remove, ready } = useNotes();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = items.find((n) => n.id === activeId) ?? null;
  const [filter, setFilter] = useState<NoteItem["kind"] | "all">("all");
  const list = useMemo(() => items.filter((n) => filter === "all" || n.kind === filter), [items, filter]);

  const create = (kind: NoteItem["kind"]) => {
    const n: NoteItem = { id: newId(), title: KINDS.find((k) => k.value === kind)!.label, kind, body: TEMPLATES[kind], links: [], updatedAt: new Date().toISOString() };
    upsert(n);
    setActiveId(n.id);
  };

  const exportMd = () => {
    const md = items.map((n) => `# ${n.title}\n\n_${n.kind} · ${n.updatedAt.slice(0, 10)}${n.links.length ? ` · trials: ${n.links.join(", ")}` : ""}_\n\n${n.body}`).join("\n\n---\n\n");
    const url = URL.createObjectURL(new Blob([md], { type: "text/markdown" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "oncoatlas-notebook.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!ready) return <div className="skeleton h-64 rounded-2xl" aria-hidden />;

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {KINDS.map((k) => (
            <Button key={k.value} size="sm" onClick={() => create(k.value)}><Plus className="h-3 w-3" />{k.label}</Button>
          ))}
        </div>
        <label className="block text-xs text-ink-3">
          Show
          <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="mt-1 h-8 w-full rounded-lg border border-border bg-surface px-2 text-sm text-ink">
            <option value="all">All entries</option>
            {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
          </select>
        </label>
        <ul className="space-y-1">
          {list.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => setActiveId(n.id)}
                className={cn("flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm", n.id === activeId ? "bg-surface-3 text-ink" : "text-ink-2 hover:bg-surface-2")}
              >
                {n.kind === "research-question" && (n.resolved ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <Circle className="h-3.5 w-3.5 text-warning" />)}
                <span className="truncate">{n.title}</span>
              </button>
            </li>
          ))}
        </ul>
        {items.length > 0 && <Button size="sm" variant="ghost" onClick={exportMd}><Download className="h-3.5 w-3.5" /> Export Markdown</Button>}
        <p className="text-[11px] leading-relaxed text-ink-3">Stored only in this browser. Do not enter identifiable patient information.</p>
      </aside>

      {active ? (
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge tone="lavender">{KINDS.find((k) => k.value === active.kind)?.label}</Badge>
            {active.kind === "research-question" && (
              <Button size="sm" variant="ghost" onClick={() => upsert({ ...active, resolved: !active.resolved })}>
                {active.resolved ? "Mark unresolved" : "Mark resolved"}
              </Button>
            )}
            <button type="button" onClick={() => { remove(active.id); setActiveId(null); }} className="ml-auto inline-flex items-center gap-1 text-xs text-ink-3 hover:text-danger">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
          <label className="sr-only" htmlFor="note-title">Title</label>
          <input id="note-title" value={active.title} onChange={(e) => upsert({ ...active, title: e.target.value })} className="w-full bg-transparent font-serif text-2xl text-ink outline-none" />
          <label className="sr-only" htmlFor="note-body">Body</label>
          <textarea
            id="note-body"
            value={active.body}
            onChange={(e) => upsert({ ...active, body: e.target.value })}
            rows={16}
            className="mt-3 w-full resize-y rounded-xl border border-border bg-bg p-4 font-mono text-[13px] leading-relaxed text-ink outline-none focus:border-accent"
          />
          <div className="mt-3">
            <label className="text-xs text-ink-3" htmlFor="link-trial">Link a trial</label>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <select
                id="link-trial"
                value=""
                onChange={(e) => e.target.value && !active.links.includes(e.target.value) && upsert({ ...active, links: [...active.links, e.target.value] })}
                className="h-8 rounded-lg border border-border bg-surface px-2 text-sm text-ink"
              >
                <option value="">Select…</option>
                {trialOptions.map((t) => <option key={t.slug} value={t.slug}>{t.acronym}</option>)}
              </select>
              {active.links.map((s) => (
                <span key={s} className="inline-flex items-center gap-1">
                  <Link href={`/trials/${s}`}><Badge tone="blue">{trialOptions.find((t) => t.slug === s)?.acronym ?? s}</Badge></Link>
                  <button type="button" onClick={() => upsert({ ...active, links: active.links.filter((x) => x !== s) })} className="text-xs text-ink-3 hover:text-danger" aria-label={`Unlink ${s}`}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState icon={<NotebookPen className="h-6 w-6" />} title={items.length ? "Select an entry" : "Start your research notebook"}>
          Create research notes, journal-club worksheets, evidence briefs and open research questions, each linkable to curated trials.
        </EmptyState>
      )}
    </div>
  );
}
