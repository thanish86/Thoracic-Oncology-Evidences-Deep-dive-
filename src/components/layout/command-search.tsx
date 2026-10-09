"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Dna, FlaskConical, Pill, Search } from "lucide-react";
import { NAV } from "@/lib/navigation";

interface SearchHit {
  type: "trial" | "biomarker" | "drug";
  slug: string;
  title: string;
  subtitle: string;
}

const TYPE_ICON = { trial: FlaskConical, biomarker: Dna, drug: Pill } as const;
const TYPE_HREF = { trial: "/trials/", biomarker: "/biomarkers/", drug: "/drugs/" } as const;

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("oa:open-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("oa:open-search", onOpen);
    };
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      return;
    }
    const t = setTimeout(async () => {
      abort.current?.abort();
      const ctrl = new AbortController();
      abort.current = ctrl;
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        if (res.ok) setHits(((await res.json()) as { hits: SearchHit[] }).hits);
      } catch {
        /* aborted or offline */
      } finally {
        setLoading(false);
      }
    }, 160);
    return () => clearTimeout(t);
  }, [query]);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const pages = NAV.flatMap((s) => s.items).filter((i) => !query || i.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm text-ink-3 transition-colors hover:border-border-strong hover:text-ink-2 sm:w-72"
        aria-label="Search evidence"
      >
        <Search className="h-4 w-4" aria-hidden />
        <span className="hidden truncate whitespace-nowrap sm:inline">Search evidence…</span>
        <kbd className="ml-auto hidden rounded border border-border px-1.5 text-[10px] font-medium sm:inline">⌘K</kbd>
      </button>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global evidence search"
        shouldFilter={false}
        overlayClassName="fixed inset-0 z-50 bg-ink/25 backdrop-blur-[2px]"
        contentClassName="fixed left-1/2 top-[12vh] z-50 w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="h-4 w-4 text-ink-3" aria-hidden />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search KEYNOTE-024, EGFR, osimertinib…"
            className="h-12 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3"
          />
        </div>
        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-8 text-center text-sm text-ink-3">
            {loading ? "Searching…" : query.length < 2 ? "Type at least two characters." : "No matching evidence in the database."}
          </Command.Empty>
          {hits.length > 0 && (
            <Command.Group heading="Evidence" className="text-[11px] font-semibold uppercase tracking-wider text-ink-3 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
              {hits.map((h) => {
                const Icon = TYPE_ICON[h.type];
                return (
                  <Command.Item
                    key={`${h.type}-${h.slug}`}
                    value={`${h.type}-${h.slug}`}
                    onSelect={() => go(TYPE_HREF[h.type] + h.slug)}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm normal-case tracking-normal text-ink data-[selected=true]:bg-surface-2"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-ink-3" aria-hidden />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{h.title}</span>
                      <span className="block truncate text-xs text-ink-3">{h.subtitle}</span>
                    </span>
                  </Command.Item>
                );
              })}
            </Command.Group>
          )}
          {pages.length > 0 && (
            <Command.Group heading="Go to" className="text-[11px] font-semibold uppercase tracking-wider text-ink-3 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
              {pages.slice(0, 8).map((p) => (
                <Command.Item
                  key={p.href}
                  value={`page-${p.href}`}
                  onSelect={() => go(p.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm normal-case tracking-normal text-ink data-[selected=true]:bg-surface-2"
                >
                  <p.icon className="h-4 w-4 text-ink-3" aria-hidden />
                  {p.label}
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </Command.Dialog>
    </>
  );
}
