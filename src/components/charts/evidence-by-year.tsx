"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const SERIES = [
  { key: "breast", label: "Breast", color: "var(--rose)" },
  { key: "nsclc", label: "NSCLC", color: "var(--blue)" },
  { key: "sclc", label: "SCLC", color: "var(--lavender)" },
  { key: "thymic", label: "Thymic", color: "var(--sand)" },
  { key: "mesothelioma", label: "Mesothelioma", color: "var(--sage)" },
];

export interface YearRow {
  year: number;
  [disease: string]: number;
}

/** Count of curated trials by year of primary publication (database counts, not literature totals). */
export function EvidenceByYear({ data }: { data: YearRow[] }) {
  return (
    <div className="h-64 w-full" role="img" aria-label="Stacked bar chart of curated trials by year of primary publication and disease">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: "var(--ink-3)" }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--ink-3)" }} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "var(--surface-2)" }}
            contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12, color: "var(--ink)" }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {SERIES.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.label} stackId="a" fill={s.color} radius={0} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
