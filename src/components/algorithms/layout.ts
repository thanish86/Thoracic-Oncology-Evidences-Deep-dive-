/** Minimal layered (Sugiyama-style) layout for small DAGs. No external dependencies. */

export interface LayoutInput {
  nodes: { id: string }[];
  edges: { source: string; target: string }[];
}

export interface LayoutOptions {
  nodeWidth: number;
  columnGap: number;
  rowHeight: number;
}

export function layeredLayout({ nodes, edges }: LayoutInput, opts: LayoutOptions): Map<string, { x: number; y: number; layer: number }> {
  const ids = nodes.map((n) => n.id);
  const parents = new Map<string, string[]>(ids.map((id) => [id, []]));
  const children = new Map<string, string[]>(ids.map((id) => [id, []]));
  for (const e of edges) {
    if (!parents.has(e.target) || !children.has(e.source)) continue;
    parents.get(e.target)!.push(e.source);
    children.get(e.source)!.push(e.target);
  }

  // Longest-path layering via Kahn topological order (cycles fall back to layer 0).
  const layer = new Map<string, number>(ids.map((id) => [id, 0]));
  const indeg = new Map<string, number>(ids.map((id) => [id, parents.get(id)!.length]));
  const queue = ids.filter((id) => indeg.get(id) === 0);
  while (queue.length) {
    const id = queue.shift()!;
    for (const c of children.get(id)!) {
      layer.set(c, Math.max(layer.get(c)!, layer.get(id)! + 1));
      indeg.set(c, indeg.get(c)! - 1);
      if (indeg.get(c) === 0) queue.push(c);
    }
  }

  const layers: string[][] = [];
  for (const id of ids) {
    const l = layer.get(id)!;
    (layers[l] ??= []).push(id);
  }

  // Order each layer by the barycentre of its parents' positions (one downward sweep).
  const order = new Map<string, number>();
  layers.forEach((row, li) => {
    if (li > 0) {
      const bary = (id: string) => {
        const ps = parents.get(id)!.filter((p) => order.has(p));
        return ps.length ? ps.reduce((s, p) => s + order.get(p)!, 0) / ps.length : Number.MAX_SAFE_INTEGER;
      };
      row.sort((a, b) => bary(a) - bary(b));
    }
    row.forEach((id, i) => order.set(id, i));
  });

  const step = opts.nodeWidth + opts.columnGap;
  const widest = Math.max(...layers.map((r) => r?.length ?? 0));
  const pos = new Map<string, { x: number; y: number; layer: number }>();
  layers.forEach((row, li) => {
    const offset = ((widest - row.length) * step) / 2;
    row.forEach((id, i) => pos.set(id, { x: offset + i * step, y: li * opts.rowHeight, layer: li }));
  });
  return pos;
}
