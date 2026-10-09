"use client";

/**
 * Original explanatory signalling diagrams (inline SVG). Schematic, not to scale.
 * Nodes link to biomarker monographs when they exist in the database.
 */
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  w?: number;
  slug?: string; // biomarker slug
  kind: "receptor" | "transducer" | "effector" | "suppressor" | "immune" | "drug" | "process";
  note?: string;
}
interface MapEdge {
  from: string;
  to: string;
  inhibit?: boolean;
}
interface MapDef {
  id: string;
  title: string;
  caption: string;
  height: number;
  nodes: MapNode[];
  edges: MapEdge[];
}

const KIND_STYLE: Record<MapNode["kind"], { fill: string; stroke: string }> = {
  receptor: { fill: "var(--blue-soft)", stroke: "var(--blue)" },
  transducer: { fill: "var(--lavender-soft)", stroke: "var(--lavender)" },
  effector: { fill: "var(--sage-soft)", stroke: "var(--sage)" },
  suppressor: { fill: "var(--rose-soft)", stroke: "var(--rose)" },
  immune: { fill: "var(--sand-soft)", stroke: "var(--sand)" },
  drug: { fill: "var(--surface)", stroke: "var(--ink-3)" },
  process: { fill: "var(--surface-2)", stroke: "var(--border-strong)" },
};

const MAPS: MapDef[] = [
  {
    id: "rtk",
    title: "Receptor tyrosine kinases → MAPK and PI3K–AKT–mTOR",
    caption:
      "Oncogenic drivers converge on two main cascades. Mutations or fusions (EGFR, ALK, ROS1, RET, MET, HER2, NTRK, NRG1) activate RAS–RAF–MEK–ERK and PI3K–AKT–mTOR; PTEN loss and PIK3CA/AKT1 mutations activate the latter directly.",
    height: 380,
    nodes: [
      { id: "egfr", label: "EGFR", x: 20, y: 30, slug: "egfr", kind: "receptor" },
      { id: "her2", label: "HER2", x: 110, y: 30, slug: "her2", kind: "receptor" },
      { id: "met", label: "MET", x: 200, y: 30, slug: "met", kind: "receptor" },
      { id: "alk", label: "ALK", x: 290, y: 30, slug: "alk", kind: "receptor", note: "fusion" },
      { id: "ros1", label: "ROS1", x: 380, y: 30, slug: "ros1", kind: "receptor", note: "fusion" },
      { id: "ret", label: "RET", x: 470, y: 30, slug: "ret", kind: "receptor", note: "fusion" },
      { id: "ntrk", label: "NTRK", x: 560, y: 30, slug: "ntrk", kind: "receptor", note: "fusion" },
      { id: "nrg1", label: "NRG1", x: 110, y: -4, w: 70, slug: "nrg1", kind: "receptor", note: "ligand fusion" },
      { id: "ras", label: "KRAS", x: 150, y: 130, slug: "kras", kind: "transducer" },
      { id: "raf", label: "BRAF", x: 150, y: 210, slug: "braf", kind: "transducer" },
      { id: "mek", label: "MEK", x: 150, y: 290, kind: "transducer" },
      { id: "pi3k", label: "PI3K (PIK3CA)", x: 420, y: 130, w: 120, slug: "pik3ca", kind: "transducer" },
      { id: "pten", label: "PTEN", x: 570, y: 130, slug: "pten", kind: "suppressor" },
      { id: "akt", label: "AKT1", x: 440, y: 210, slug: "akt1", kind: "transducer" },
      { id: "mtor", label: "mTOR", x: 440, y: 290, kind: "transducer" },
      { id: "out", label: "Proliferation · survival · growth", x: 250, y: 340, w: 200, kind: "process" },
    ],
    edges: [
      { from: "egfr", to: "ras" }, { from: "her2", to: "ras" }, { from: "met", to: "ras" }, { from: "alk", to: "ras" },
      { from: "ros1", to: "pi3k" }, { from: "ret", to: "pi3k" }, { from: "ntrk", to: "pi3k" }, { from: "her2", to: "pi3k" },
      { from: "ras", to: "raf" }, { from: "raf", to: "mek" }, { from: "pi3k", to: "akt" }, { from: "akt", to: "mtor" },
      { from: "pten", to: "pi3k", inhibit: true }, { from: "mek", to: "out" }, { from: "mtor", to: "out" }, { from: "ras", to: "pi3k" },
    ],
  },
  {
    id: "checkpoint",
    title: "Immune checkpoints: CTLA-4 (priming) and PD-1/PD-L1 (effector phase)",
    caption:
      "CTLA-4 competes with CD28 for B7 ligands on antigen-presenting cells during priming in lymphoid tissue; PD-1 on activated T cells engages PD-L1 on tumour and immune cells within the tumour microenvironment. Antibodies block these brakes.",
    height: 300,
    nodes: [
      { id: "apc", label: "APC: B7 (CD80/86)", x: 20, y: 40, w: 160, kind: "immune" },
      { id: "ctla4", label: "CTLA-4", x: 230, y: 40, kind: "suppressor" },
      { id: "cd28", label: "CD28", x: 230, y: 110, kind: "effector" },
      { id: "tcell", label: "T cell", x: 360, y: 75, kind: "effector" },
      { id: "pd1", label: "PD-1", x: 480, y: 160, kind: "suppressor" },
      { id: "pdl1", label: "PD-L1 (tumour)", x: 450, y: 240, w: 130, slug: "pd-l1", kind: "immune" },
      { id: "aCTLA4", label: "anti-CTLA-4", x: 230, y: 0, w: 100, kind: "drug" },
      { id: "aPD1", label: "anti-PD-1 / PD-L1", x: 300, y: 200, w: 130, kind: "drug" },
    ],
    edges: [
      { from: "apc", to: "ctla4", inhibit: true }, { from: "apc", to: "cd28" }, { from: "cd28", to: "tcell" }, { from: "ctla4", to: "tcell", inhibit: true },
      { from: "pdl1", to: "pd1" }, { from: "pd1", to: "tcell", inhibit: true }, { from: "aCTLA4", to: "ctla4", inhibit: true }, { from: "aPD1", to: "pd1", inhibit: true },
    ],
  },
  {
    id: "ddr",
    title: "DNA damage repair and PARP synthetic lethality",
    caption:
      "Homologous recombination (BRCA1, BRCA2, PALB2) repairs double-strand breaks. PARP inhibition traps PARP on single-strand breaks, which become double-strand breaks at replication; HR-deficient cells cannot repair them — synthetic lethality.",
    height: 280,
    nodes: [
      { id: "ssb", label: "Single-strand break", x: 20, y: 40, w: 150, kind: "process" },
      { id: "parp", label: "PARP", x: 220, y: 40, kind: "transducer" },
      { id: "parpi", label: "PARP inhibitor (trapping)", x: 190, y: 120, w: 170, kind: "drug" },
      { id: "dsb", label: "Replication-associated DSB", x: 400, y: 40, w: 190, kind: "process" },
      { id: "hr", label: "HR: BRCA1/2 · PALB2", x: 400, y: 130, w: 170, slug: "brca", kind: "effector" },
      { id: "death", label: "HR-deficient: cell death", x: 400, y: 220, w: 190, kind: "suppressor" },
    ],
    edges: [
      { from: "ssb", to: "parp" }, { from: "parpi", to: "parp", inhibit: true }, { from: "parp", to: "dsb" }, { from: "dsb", to: "hr" }, { from: "hr", to: "death", inhibit: true },
    ],
  },
  {
    id: "adc",
    title: "Antibody–drug conjugate mechanism",
    caption:
      "An antibody targets a surface antigen (e.g., HER2, TROP2), the conjugate is internalised and trafficked to lysosomes, the linker is cleaved and the payload (topoisomerase-I inhibitor or microtubule inhibitor) kills the cell; membrane-permeable payloads can diffuse to neighbouring cells (bystander effect).",
    height: 220,
    nodes: [
      { id: "bind", label: "1 · Antigen binding", x: 10, y: 60, w: 140, slug: "her2", kind: "receptor" },
      { id: "intern", label: "2 · Internalisation", x: 170, y: 60, w: 140, kind: "process" },
      { id: "lyso", label: "3 · Lysosomal release", x: 330, y: 60, w: 150, kind: "transducer" },
      { id: "payload", label: "4 · Payload: DNA / microtubule damage", x: 500, y: 60, w: 110, kind: "suppressor" },
      { id: "bystander", label: "Bystander killing", x: 400, y: 160, w: 140, kind: "effector" },
    ],
    edges: [{ from: "bind", to: "intern" }, { from: "intern", to: "lyso" }, { from: "lyso", to: "payload" }, { from: "lyso", to: "bystander" }],
  },
];

function nodeWidth(n: MapNode) {
  return n.w ?? 76;
}

function MapSvg({ map, available, active, setActive }: { map: MapDef; available: Set<string>; active: string | null; setActive: (s: string | null) => void }) {
  const byId = Object.fromEntries(map.nodes.map((n) => [n.id, n]));
  const H = 28;
  return (
    <svg viewBox={`-10 -14 660 ${map.height}`} className="w-full" role="group" aria-label={map.title}>
      <defs>
        <marker id={`arrow-${map.id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--ink-3)" />
        </marker>
        <marker id={`bar-${map.id}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M5,0 L5,10" stroke="var(--danger)" strokeWidth="2.5" />
        </marker>
      </defs>
      {map.edges.map((e, i) => {
        const a = byId[e.from];
        const b = byId[e.to];
        const ax = a.x + nodeWidth(a) / 2;
        const ay = a.y + H / 2;
        const bx = b.x + nodeWidth(b) / 2;
        const by = b.y + H / 2;
        const dx = bx - ax;
        const dy = by - ay;
        const len = Math.hypot(dx, dy) || 1;
        // stop short of target box
        const pad = Math.abs(dy) > Math.abs(dx) ? H / 2 + 4 : nodeWidth(b) / 2 + 4;
        const ex = bx - (dx / len) * pad;
        const ey = by - (dy / len) * pad;
        return (
          <line
            key={i}
            x1={ax}
            y1={ay}
            x2={ex}
            y2={ey}
            stroke={e.inhibit ? "var(--danger)" : "var(--ink-3)"}
            strokeWidth={1.2}
            strokeDasharray={e.inhibit ? "4 3" : undefined}
            markerEnd={`url(#${e.inhibit ? "bar" : "arrow"}-${map.id})`}
            opacity={0.8}
          />
        );
      })}
      {map.nodes.map((n) => {
        const s = KIND_STYLE[n.kind];
        const linked = n.slug && available.has(n.slug);
        const isActive = active === n.id;
        const box = (
          <g
            onMouseEnter={() => setActive(n.id)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(n.id)}
            onBlur={() => setActive(null)}
            style={{ cursor: linked ? "pointer" : "default" }}
          >
            <rect x={n.x} y={n.y} width={nodeWidth(n)} height={H} rx={n.kind === "drug" ? 14 : 8} fill={s.fill} stroke={isActive ? "var(--ink)" : s.stroke} strokeWidth={isActive ? 2 : 1.2} strokeDasharray={n.kind === "drug" ? "3 2" : undefined} />
            <text x={n.x + nodeWidth(n) / 2} y={n.y + H / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={500} fill="var(--ink)">{n.label}</text>
            {n.note && <text x={n.x + nodeWidth(n) / 2} y={n.y + H + 11} textAnchor="middle" fontSize={9} fill="var(--ink-3)">{n.note}</text>}
          </g>
        );
        return linked ? (
          <Link key={n.id} href={`/biomarkers/${n.slug}`} aria-label={`${n.label} biomarker monograph`}>
            {box}
          </Link>
        ) : (
          <g key={n.id}>{box}</g>
        );
      })}
    </svg>
  );
}

export function PathwayMaps({ availableSlugs }: { availableSlugs: string[] }) {
  const [tab, setTab] = useState(MAPS[0].id);
  const [active, setActive] = useState<string | null>(null);
  const available = new Set(availableSlugs);
  const map = MAPS.find((m) => m.id === tab)!;
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Signalling diagrams">
        {MAPS.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={tab === m.id}
            onClick={() => setTab(m.id)}
            className={cn("rounded-full px-3 py-1.5 text-xs transition-colors", tab === m.id ? "bg-ink text-bg" : "bg-surface-2 text-ink-2 hover:text-ink")}
          >
            {m.title.split(":")[0].split("→")[0].trim()}
          </button>
        ))}
      </div>
      <h3 className="font-serif text-lg text-ink">{map.title}</h3>
      <div className="mt-3 overflow-x-auto">
        <div className="min-w-[560px]">
          <MapSvg map={map} available={available} active={active} setActive={setActive} />
        </div>
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2">{map.caption}</p>
      <p className="mt-2 text-[11px] text-ink-3">Original schematic for teaching; simplified and not to scale. Solid boxes link to biomarker monographs; dashed red lines denote inhibition.</p>
    </div>
  );
}
