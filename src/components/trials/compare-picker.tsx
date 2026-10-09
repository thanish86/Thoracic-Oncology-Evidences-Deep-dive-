"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/primitives";

export interface TrialOption {
  slug: string;
  acronym: string;
  yearOfPrimaryPublication: number;
  cancerType: { shortName: string };
}

export function ComparePicker({ options, selected }: { options: TrialOption[]; selected: string[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const push = (ids: string[]) => router.push(ids.length ? `/trials/compare?ids=${ids.join(",")}` : "/trials/compare", { scroll: false });
  const matches = useMemo(
    () => options.filter((o) => !selected.includes(o.slug) && (query.length < 1 || `${o.acronym} ${o.cancerType.shortName}`.toLowerCase().includes(query.toLowerCase()))).slice(0, 12),
    [options, selected, query],
  );
  const full = selected.length >= 5;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-ink-3">Comparing ({selected.length}/5):</span>
        {selected.map((s) => {
          const o = options.find((x) => x.slug === s);
          return (
            <button key={s} type="button" onClick={() => push(selected.filter((x) => x !== s))} className="group" aria-label={`Remove ${o?.acronym ?? s}`}>
              <Badge tone="blue" className="text-xs">
                {o?.acronym ?? s} <X className="h-3 w-3 opacity-60 group-hover:opacity-100" />
              </Badge>
            </button>
          );
        })}
      </div>
      <label className="sr-only" htmlFor="compare-search">Add a trial</label>
      <input
        id="compare-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={full}
        placeholder={full ? "Maximum of five trials" : "Add a trial: type an acronym…"}
        className="h-9 w-full rounded-full border border-border bg-bg px-4 text-sm outline-none placeholder:text-ink-3 focus:border-accent disabled:opacity-60"
      />
      {!full && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {matches.map((o) => (
            <button
              key={o.slug}
              type="button"
              onClick={() => {
                setQuery("");
                push([...selected, o.slug]);
              }}
              className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-ink-2 hover:border-accent hover:text-ink"
            >
              <Plus className="h-3 w-3" /> {o.acronym} <span className="text-ink-3">· {o.cancerType.shortName} {o.yearOfPrimaryPublication}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
