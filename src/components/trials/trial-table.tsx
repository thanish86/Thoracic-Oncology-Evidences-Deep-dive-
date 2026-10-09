"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Star } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { EvidenceStatusBadge } from "@/components/evidence/status-badge";
import { DISEASE_TONE, RESULT_TONE } from "@/lib/labels";
import { PHASE_LABEL, RESULT_LABEL } from "@/lib/utils";

export interface TrialRow {
  slug: string;
  acronym: string;
  officialTitle: string;
  setting: string;
  phase: string;
  result: string;
  landmark: boolean;
  yearOfPrimaryPublication: number;
  evidenceStatus: string;
  cancerType: { slug: string; shortName: string };
  biomarkers: { biomarkerSlug: string }[];
}

export function TrialTable({ trials, showDisease = true }: { trials: TrialRow[]; showDisease?: boolean }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo<ColumnDef<TrialRow>[]>(
    () => [
      {
        id: "acronym",
        header: "Trial",
        accessorKey: "acronym",
        cell: ({ row }) => (
          <div className="min-w-[220px]">
            <Link href={`/trials/${row.original.slug}`} className="font-medium text-ink hover:text-accent">
              {row.original.acronym}
              {row.original.landmark && <Star className="ml-1 inline h-3 w-3 fill-sand text-sand" aria-label="Landmark trial" />}
            </Link>
            <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-ink-3">{row.original.officialTitle}</p>
          </div>
        ),
      },
      ...(showDisease
        ? [{
            id: "disease",
            header: "Disease",
            accessorFn: (r: TrialRow) => r.cancerType.shortName,
            cell: ({ row }: { row: { original: TrialRow } }) => <Badge tone={DISEASE_TONE[row.original.cancerType.slug]}>{row.original.cancerType.shortName}</Badge>,
          } satisfies ColumnDef<TrialRow>]
        : []),
      { id: "setting", header: "Setting", accessorKey: "setting", cell: ({ getValue }) => <span className="text-ink-2">{getValue<string>()}</span> },
      { id: "phase", header: "Design", accessorKey: "phase", cell: ({ getValue }) => <span className="whitespace-nowrap text-ink-2">{PHASE_LABEL[getValue<string>()]}</span> },
      {
        id: "result",
        header: "Primary endpoint",
        accessorKey: "result",
        cell: ({ getValue }) => <Badge tone={RESULT_TONE[getValue<string>()]}>{RESULT_LABEL[getValue<string>()]}</Badge>,
      },
      { id: "year", header: "Year", accessorKey: "yearOfPrimaryPublication", cell: ({ getValue }) => <span className="tabular text-ink-2">{getValue<number>()}</span> },
      { id: "status", header: "Evidence", accessorKey: "evidenceStatus", enableSorting: false, cell: ({ getValue }) => <EvidenceStatusBadge status={getValue<string>()} /> },
    ],
    [showDisease],
  );
  const table = useReactTable({ data: trials, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel() });

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-border bg-surface-2/60 text-xs text-ink-3">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => {
                const sorted = h.column.getIsSorted();
                return (
                  <th key={h.id} scope="col" className="px-4 py-2.5 font-medium" aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}>
                    {h.column.getCanSort() ? (
                      <button type="button" onClick={h.column.getToggleSortingHandler()} className="inline-flex items-center gap-1 hover:text-ink">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {sorted === "asc" ? <ArrowUp className="h-3 w-3" /> : sorted === "desc" ? <ArrowDown className="h-3 w-3" /> : <ArrowUpDown className="h-3 w-3 opacity-40" />}
                      </button>
                    ) : (
                      flexRender(h.column.columnDef.header, h.getContext())
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-border/70 align-top transition-colors last:border-0 hover:bg-surface-2/50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
