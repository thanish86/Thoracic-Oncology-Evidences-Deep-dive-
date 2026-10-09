"use client";

import Link from "next/link";
import { Bookmark, Download, Trash2 } from "lucide-react";
import { Badge, Button, EmptyState } from "@/components/ui/primitives";
import { useBookmarks } from "./storage";

const HREF = { trial: "/trials/", biomarker: "/biomarkers/", drug: "/drugs/" } as const;

export function BookmarksView() {
  const { items, ready, remove, setCollection } = useBookmarks();
  if (!ready) return <div className="skeleton h-40 rounded-2xl" aria-hidden />;
  if (!items.length)
    return (
      <EmptyState icon={<Bookmark className="h-6 w-6" />} title="No bookmarks yet" action={<Button asChild><Link href="/trials">Browse trials</Link></Button>}>
        Save trials, biomarkers and drugs to build reading collections. Bookmarks are stored only in this browser.
      </EmptyState>
    );
  const trialSlugs = items.filter((i) => i.type === "trial").map((i) => i.slug);
  const collections = [...new Set(items.map((i) => i.collection ?? "Unsorted"))].sort();

  return (
    <div className="space-y-8">
      {trialSlugs.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-ink-3">Export trial references:</span>
          {(["ris", "bibtex", "vancouver"] as const).map((f) => (
            <Button key={f} asChild size="sm">
              <a href={`/api/references?format=${f}&slugs=${trialSlugs.join(",")}`} download><Download className="h-3.5 w-3.5" />{f.toUpperCase()}</a>
            </Button>
          ))}
          <Button asChild size="sm" variant="ghost">
            <Link href={`/trials/compare?ids=${trialSlugs.slice(0, 5).join(",")}`}>Compare (first 5)</Link>
          </Button>
        </div>
      )}
      {collections.map((col) => (
        <section key={col}>
          <h2 className="mb-3 font-serif text-xl text-ink">{col}</h2>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {items.filter((i) => (i.collection ?? "Unsorted") === col).map((b) => (
              <li key={`${b.type}-${b.slug}`} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <Badge tone={b.type === "trial" ? "blue" : b.type === "drug" ? "sage" : "lavender"}>{b.type}</Badge>
                <Link href={HREF[b.type] + b.slug} className="font-medium text-ink hover:text-accent">{b.title}</Link>
                <span className="text-xs text-ink-3">saved {b.savedAt.slice(0, 10)}</span>
                <label className="ml-auto flex items-center gap-2 text-xs text-ink-3">
                  Collection
                  <input
                    defaultValue={b.collection ?? ""}
                    onBlur={(e) => setCollection(b.type, b.slug, e.target.value.trim())}
                    placeholder="e.g. Journal club — EGFR"
                    className="h-8 w-48 rounded-lg border border-border bg-bg px-2 text-sm text-ink"
                  />
                </label>
                <button type="button" onClick={() => remove(b.type, b.slug)} className="grid h-8 w-8 place-items-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-danger" aria-label={`Remove ${b.title}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
