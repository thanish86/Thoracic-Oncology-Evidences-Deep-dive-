import Link from "next/link";
import { KIND_META } from "./kind-meta";
import type { FlowEdgeInput, FlowNodeInput } from "./algorithm-flow";

/** Accessible nested-list rendering of the same pathway graph (server component). */
export function AlgorithmOutline({ nodes, edges }: { nodes: FlowNodeInput[]; edges: FlowEdgeInput[] }) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const out = new Map<string, FlowEdgeInput[]>();
  const hasParent = new Set<string>();
  for (const e of edges) {
    if (!byId.has(e.source) || !byId.has(e.target)) continue;
    (out.get(e.source) ?? out.set(e.source, []).get(e.source)!).push(e);
    hasParent.add(e.target);
  }
  const roots = nodes.filter((n) => !hasParent.has(n.id));
  const seen = new Set<string>();

  const renderNode = (id: string, viaLabel?: string): React.ReactNode => {
    const n = byId.get(id)!;
    const repeat = seen.has(id);
    seen.add(id);
    const kids = repeat ? [] : out.get(id) ?? [];
    return (
      <li key={`${id}-${viaLabel ?? "root"}`} className="mt-2">
        <div className="text-sm leading-relaxed">
          {viaLabel && <span className="mr-1.5 rounded bg-surface-2 px-1.5 py-0.5 text-[11px] font-medium text-ink-2">If {viaLabel}</span>}
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">{KIND_META[n.kind].label}:</span>{" "}
          <span className="font-medium text-ink">{n.label}</span>
          {repeat ? (
            <span className="text-ink-3"> (described above)</span>
          ) : (
            <>
              {n.detail && <p className="text-ink-2">{n.detail}</p>}
              {n.trials.length > 0 && (
                <p className="text-xs text-ink-3">
                  Supporting trials:{" "}
                  {n.trials.map((t, i) => (
                    <span key={t.slug}>
                      {i > 0 && ", "}
                      <Link href={`/trials/${t.slug}`} className="text-accent hover:underline">{t.acronym}</Link>
                    </span>
                  ))}
                </p>
              )}
            </>
          )}
        </div>
        {kids.length > 0 && <ul className="ml-4 border-l border-border pl-4">{kids.map((e) => renderNode(e.target, e.label))}</ul>}
      </li>
    );
  };

  return <ul className="-mt-2">{roots.map((r) => renderNode(r.id))}</ul>;
}
