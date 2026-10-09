"use client";

import "@xyflow/react/dist/style.css";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { X } from "lucide-react";
import type { AlgorithmNodeKind } from "@/content/algorithms/types";
import { cn } from "@/lib/utils";
import { KIND_META } from "./kind-meta";
import { layeredLayout } from "./layout";

export type FlowTrialRef = {
  slug: string;
  acronym: string;
};

export type FlowNodeInput = {
  id: string;
  kind: AlgorithmNodeKind;
  label: string;
  detail?: string;
  trials: FlowTrialRef[];
};

export interface FlowEdgeInput {
  source: string;
  target: string;
  label?: string;
}

type AlgoNodeData = FlowNodeInput & { selected: boolean };
type AlgoNode = Node<AlgoNodeData, "algo">;

const NODE_WIDTH = 230;

function AlgoNodeView({ data }: NodeProps<AlgoNode>) {
  const meta = KIND_META[data.kind];
  return (
    <div
      className={cn(
        "rounded-xl border-2 px-3 py-2 text-left shadow-soft transition-shadow",
        meta.className,
        data.selected && "ring-2 ring-accent ring-offset-2 ring-offset-bg",
      )}
      style={{ width: NODE_WIDTH }}
    >
      <Handle type="target" position={Position.Top} className="!h-1.5 !w-1.5 !border-0 !bg-border-strong" isConnectable={false} />
      <p className="mb-0.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-3">
        <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} aria-hidden />
        {meta.label}
        {data.trials.length > 0 && <span className="ml-auto normal-case tracking-normal">{data.trials.length} trial{data.trials.length > 1 ? "s" : ""}</span>}
      </p>
      <p className="text-[12px] font-medium leading-snug text-ink">{data.label}</p>
      <Handle type="source" position={Position.Bottom} className="!h-1.5 !w-1.5 !border-0 !bg-border-strong" isConnectable={false} />
    </div>
  );
}

const nodeTypes = { algo: AlgoNodeView };

export function AlgorithmFlow({ nodes, edges, title }: { nodes: FlowNodeInput[]; edges: FlowEdgeInput[]; title: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const positions = useMemo(() => layeredLayout({ nodes, edges }, { nodeWidth: NODE_WIDTH, columnGap: 40, rowHeight: 150 }), [nodes, edges]);

  const rfNodes = useMemo<AlgoNode[]>(
    () =>
      nodes.map((n) => {
        const p = positions.get(n.id) ?? { x: 0, y: 0 };
        return {
          id: n.id,
          type: "algo",
          position: { x: p.x, y: p.y },
          data: { ...n, selected: n.id === selectedId },
          draggable: false,
          connectable: false,
          ariaLabel: `${KIND_META[n.kind].label}: ${n.label}`,
        };
      }),
    [nodes, positions, selectedId],
  );

  const rfEdges = useMemo<Edge[]>(
    () =>
      edges.map((e, i) => ({
        id: `e${i}-${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        label: e.label,
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: "var(--ink-3)" },
        style: { stroke: "var(--ink-3)", strokeWidth: 1.25 },
        labelStyle: { fill: "var(--ink-2)", fontSize: 10, fontWeight: 500 },
        labelBgStyle: { fill: "var(--surface)" },
        labelBgPadding: [4, 2] as [number, number],
        labelBgBorderRadius: 4,
      })),
    [edges],
  );

  const selected = nodes.find((n) => n.id === selectedId) ?? null;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <div className="h-[640px] overflow-hidden rounded-2xl border border-border bg-surface" role="figure" aria-label={`Interactive flowchart: ${title}. A text outline follows below.`}>
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          nodeTypes={nodeTypes}
          colorMode={resolvedTheme === "dark" ? "dark" : "light"}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.2}
          maxZoom={1.75}
          nodesDraggable={false}
          nodesConnectable={false}
          edgesFocusable={false}
          elementsSelectable
          onNodeClick={(_, node) => setSelectedId(node.id)}
          onPaneClick={() => setSelectedId(null)}
          proOptions={{ hideAttribution: true }}
          style={{ background: "var(--surface)" }}
        >
          <Background color="var(--border)" gap={20} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      <aside className="rounded-2xl border border-border bg-surface p-4 lg:h-[640px] lg:overflow-y-auto" aria-live="polite">
        {selected ? (
          <div>
            <div className="mb-2 flex items-start justify-between gap-2">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-3">
                <span className={cn("h-2 w-2 rounded-full", KIND_META[selected.kind].dot)} aria-hidden />
                {KIND_META[selected.kind].label}
              </p>
              <button type="button" onClick={() => setSelectedId(null)} className="rounded-md p-1 text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Close node details">
                <X className="h-4 w-4" />
              </button>
            </div>
            <h3 className="font-serif text-lg leading-snug text-ink">{selected.label}</h3>
            {selected.detail && <p className="mt-2 text-sm leading-relaxed text-ink-2">{selected.detail}</p>}
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-medium text-ink-3">Supporting curated trials</p>
              {selected.trials.length ? (
                <ul className="flex flex-wrap gap-1.5">
                  {selected.trials.map((t) => (
                    <li key={t.slug}>
                      <Link href={`/trials/${t.slug}`} className="inline-flex rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-ink hover:border-accent hover:text-accent">
                        {t.acronym}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-ink-3">No curated trial linked to this step.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-sm leading-relaxed text-ink-2">
            <p className="font-medium text-ink">Select a step</p>
            <p className="mt-1">Click any node to see its explanation and the curated trials that support it. Use the controls to zoom or refit.</p>
            <ul className="mt-4 space-y-1.5 text-xs">
              {(Object.keys(KIND_META) as AlgorithmNodeKind[]).map((k) => (
                <li key={k} className="flex items-center gap-2">
                  <span className={cn("h-3 w-5 rounded border-2", KIND_META[k].className)} aria-hidden />
                  {KIND_META[k].label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
