"use client";

import Link from "next/link";
import { Bookmark, Search } from "lucide-react";
import { useBookmarks } from "./storage";

export function SearchHeroButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("oa:open-search"))}
      className="flex h-14 w-full max-w-2xl items-center gap-3 rounded-full border border-border-strong bg-surface px-6 text-left text-ink-3 shadow-soft transition-colors hover:border-accent"
    >
      <Search className="h-5 w-5" aria-hidden />
      <span className="flex-1">Search trials, biomarkers, drugs…</span>
      <kbd className="rounded-md border border-border px-2 py-0.5 text-xs">⌘K</kbd>
    </button>
  );
}

export function SavedResearch() {
  const { items, ready } = useBookmarks();
  if (!ready) return <div className="skeleton h-24 rounded-xl" aria-hidden />;
  if (!items.length)
    return (
      <p className="text-sm leading-relaxed text-ink-3">
        Nothing saved yet. Use <span className="inline-flex items-center gap-1 text-ink-2"><Bookmark className="h-3 w-3" /> Save</span> on any trial,
        biomarker or drug. Saved items stay in this browser.
      </p>
    );
  const recent = [...items].sort((a, b) => b.savedAt.localeCompare(a.savedAt)).slice(0, 6);
  const collections = [...new Set(items.map((i) => i.collection).filter(Boolean))];
  return (
    <div>
      <ul className="space-y-1.5">
        {recent.map((b) => (
          <li key={`${b.type}-${b.slug}`}>
            <Link href={`/${b.type === "trial" ? "trials" : b.type === "drug" ? "drugs" : "biomarkers"}/${b.slug}`} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-surface-2">
              <span className="text-ink">{b.title}</span>
              <span className="text-xs capitalize text-ink-3">{b.type}</span>
            </Link>
          </li>
        ))}
      </ul>
      {collections.length > 0 && <p className="mt-3 text-xs text-ink-3">Collections: {collections.join(", ")}</p>}
    </div>
  );
}
