import { SyntheticBadge } from "./synthetic-badge";

/** Group-sequential boundaries (two-sided α = 0.05, 3 equally spaced looks) — standard tabulated constants. */
const LOOKS = [
  { info: "33%", obf: 3.471, pocock: 2.289 },
  { info: "67%", obf: 2.454, pocock: 2.289 },
  { info: "100%", obf: 2.004, pocock: 2.289 },
];

export function AlphaSpendingTable() {
  return (
    <div className="max-w-xl overflow-x-auto rounded-2xl border border-border bg-surface p-4">
      <table className="w-full text-[13px]">
        <caption className="mb-2 text-left text-sm font-medium text-ink">
          Critical |z| at each look — 3 equally spaced analyses, overall two-sided α = 0.05
        </caption>
        <thead>
          <tr className="text-ink-3">
            <th scope="col" className="py-1 text-left font-medium">Information fraction</th>
            <th scope="col" className="py-1 text-right font-medium">O’Brien–Fleming</th>
            <th scope="col" className="py-1 text-right font-medium">Pocock</th>
          </tr>
        </thead>
        <tbody className="tabular text-ink-2">
          {LOOKS.map((l) => (
            <tr key={l.info} className="border-t border-border">
              <td className="py-1">{l.info}</td>
              <td className="py-1 text-right">{l.obf.toFixed(3)}</td>
              <td className="py-1 text-right">{l.pocock.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-[11px] text-ink-3">
        Tabulated boundary constants (Jennison &amp; Turnbull, <em>Group Sequential Methods</em>, 2000). The unadjusted single-look value would be 1.960. O’Brien–Fleming spends almost no α early, so the final test stays close to the nominal level.
      </p>
    </div>
  );
}

/** Schematic of immortal time: the response-defined "responder" group is guaranteed to survive until response. */
export function ImmortalTimeDiagram() {
  return (
    <figure className="max-w-2xl rounded-2xl border border-border bg-surface p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <figcaption className="text-sm font-medium text-ink">Why “responders live longer” is partly an artefact</figcaption>
        <SyntheticBadge />
      </div>
      <svg viewBox="0 0 520 130" className="w-full" role="img" aria-label="Schematic timeline: a responder's time before response is immortal and misattributed to the responder group; a landmark at month 3 removes it.">
        <line x1={20} x2={500} y1={110} y2={110} stroke="var(--border-strong)" />
        {[0, 3, 6, 9, 12].map((m) => (
          <text key={m} x={20 + m * 40} y={125} fontSize={10} textAnchor="middle" fill="var(--ink-3)">{m}</text>
        ))}
        <text x={20} y={18} fontSize={11} fill="var(--ink-2)">Patient A (responds at month 3)</text>
        <rect x={20} y={24} width={120} height={14} fill="var(--sand-soft)" stroke="var(--sand)" />
        <text x={80} y={34} fontSize={9} textAnchor="middle" fill="var(--warning)">immortal time</text>
        <rect x={140} y={24} width={280} height={14} fill="var(--accent-soft)" stroke="var(--accent)" />
        <text x={20} y={62} fontSize={11} fill="var(--ink-2)">Patient B (dies at month 2, never had a chance to respond)</text>
        <rect x={20} y={68} width={80} height={14} fill="var(--rose-soft)" stroke="var(--rose)" />
        <line x1={140} x2={140} y1={10} y2={110} stroke="var(--lavender)" strokeDasharray="4 3" />
        <text x={146} y={104} fontSize={10} fill="var(--lavender)">landmark (month 3)</text>
      </svg>
    </figure>
  );
}
