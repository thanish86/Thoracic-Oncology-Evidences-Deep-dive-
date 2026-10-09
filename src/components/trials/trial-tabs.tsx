"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";

export interface TabDef {
  id: string;
  label: string;
  content: React.ReactNode;
}

/** Hash-synced tabs: /trials/x#efficacy deep-links to a tab. All panels are server-rendered. */
export function TrialTabs({ tabs }: { tabs: TabDef[] }) {
  const [value, setValue] = useState(tabs[0]?.id);
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if (tabs.some((t) => t.id === h)) setValue(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [tabs]);

  return (
    <Tabs.Root
      value={value}
      onValueChange={(v) => {
        setValue(v);
        history.replaceState(null, "", `#${v}`);
      }}
    >
      <Tabs.List
        aria-label="Trial evidence sections"
        className="sticky top-14 z-10 -mx-4 mb-8 flex gap-1 overflow-x-auto border-b border-border bg-bg/90 px-4 backdrop-blur sm:mx-0 sm:px-0"
      >
        {tabs.map((t, i) => (
          <Tabs.Trigger
            key={t.id}
            value={t.id}
            className="relative shrink-0 px-3 py-3 text-[13px] text-ink-3 transition-colors hover:text-ink data-[state=active]:font-medium data-[state=active]:text-ink data-[state=active]:after:absolute data-[state=active]:after:inset-x-2 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:rounded-full data-[state=active]:after:bg-ink"
          >
            <span className="mr-1 text-[10px] tabular text-ink-3">{String(i + 1).padStart(2, "0")}</span>
            {t.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((t) => (
        <Tabs.Content key={t.id} value={t.id} forceMount className="outline-none data-[state=inactive]:hidden">
          {t.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
