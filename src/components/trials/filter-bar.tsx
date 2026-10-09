"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}
export interface FilterDef {
  key: string;
  label: string;
  options: FilterOption[];
}

/** URL-driven filter bar: every filter is a query param so views are shareable and server-rendered. */
export function FilterBar({ filters, searchKey = "q", searchPlaceholder = "Search…" }: { filters: FilterDef[]; searchKey?: string | null; searchPlaceholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [text, setText] = useState(params.get(searchKey ?? "") ?? "");

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.replace(`${pathname}${next.toString() ? `?${next}` : ""}`, { scroll: false }));
  };

  useEffect(() => {
    if (!searchKey) return;
    const current = params.get(searchKey) ?? "";
    if (text === current) return;
    const t = setTimeout(() => update(searchKey, text.trim() || null), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const active = filters.some((f) => params.get(f.key)) || (searchKey && params.get(searchKey));

  return (
    <div className={cn("mb-6 flex flex-wrap items-center gap-2 transition-opacity", pending && "opacity-70")} aria-busy={pending}>
      {searchKey && (
        <label className="relative flex min-w-[220px] flex-1 items-center">
          <span className="sr-only">{searchPlaceholder}</span>
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-ink-3" aria-hidden />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 w-full rounded-full border border-border bg-surface pl-9 pr-3 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-accent"
          />
        </label>
      )}
      {filters.map((f) => (
        <label key={f.key} className="relative">
          <span className="sr-only">{f.label}</span>
          <select
            value={params.get(f.key) ?? ""}
            onChange={(e) => update(f.key, e.target.value || null)}
            className={cn(
              "h-9 appearance-none rounded-full border bg-surface pl-3 pr-8 text-sm outline-none focus:border-accent",
              params.get(f.key) ? "border-accent text-ink" : "border-border text-ink-2",
            )}
          >
            <option value="">{f.label}: all</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-ink-3">▾</span>
        </label>
      ))}
      {active && (
        <button
          type="button"
          onClick={() => {
            setText("");
            startTransition(() => router.replace(pathname, { scroll: false }));
          }}
          className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm text-ink-3 hover:bg-surface-2 hover:text-ink"
        >
          <X className="h-3.5 w-3.5" /> Clear
        </button>
      )}
    </div>
  );
}
