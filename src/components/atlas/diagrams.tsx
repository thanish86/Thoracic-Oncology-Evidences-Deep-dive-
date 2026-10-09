/**
 * Original explanatory schematics (inline SVG). These are conceptual drawings created for
 * ONCOATLAS — not reproductions of clinical images or of any published figure.
 */

function Figure({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <figure className="rounded-2xl border border-border bg-surface p-4">
      {children}
      <figcaption className="mt-3 text-xs leading-relaxed text-ink-3">{caption}</figcaption>
    </figure>
  );
}

/** RECIST 1.1 response categories along a "sum of diameters" axis. */
export function RecistDiagram() {
  return (
    <Figure caption="Schematic: RECIST 1.1 compares the sum of target-lesion diameters with baseline for response, and with the smallest sum on study (nadir) for progression. Any unequivocal new lesion is progression regardless of the sum.">
      <svg viewBox="0 0 560 170" role="img" aria-labelledby="recist-t recist-d" className="h-auto w-full">
        <title id="recist-t">RECIST 1.1 response categories</title>
        <desc id="recist-d">A horizontal bar: complete response at disappearance of target lesions, partial response at a decrease of at least 30 percent from baseline, stable disease in between, progressive disease at an increase of at least 20 percent and at least 5 millimetres from nadir.</desc>
        <rect x="20" y="60" width="90" height="36" rx="6" className="fill-sage" opacity="0.85" />
        <rect x="110" y="60" width="150" height="36" className="fill-sage-soft stroke-sage" />
        <rect x="260" y="60" width="150" height="36" className="fill-surface-2 stroke-border-strong" />
        <rect x="410" y="60" width="130" height="36" rx="6" className="fill-rose-soft stroke-rose" />
        <text x="65" y="83" textAnchor="middle" className="fill-surface text-[11px] font-semibold">CR</text>
        <text x="185" y="83" textAnchor="middle" className="fill-ink text-[11px] font-semibold">PR</text>
        <text x="335" y="83" textAnchor="middle" className="fill-ink text-[11px] font-semibold">SD</text>
        <text x="475" y="83" textAnchor="middle" className="fill-ink text-[11px] font-semibold">PD</text>
        <line x1="260" y1="40" x2="260" y2="116" className="stroke-ink-3" strokeDasharray="3 3" />
        <line x1="410" y1="40" x2="410" y2="116" className="stroke-ink-3" strokeDasharray="3 3" />
        <text x="260" y="32" textAnchor="middle" className="fill-ink-2 text-[10px]">≥30% decrease vs baseline</text>
        <text x="410" y="32" textAnchor="middle" className="fill-ink-2 text-[10px]">≥20% and ≥5 mm increase vs nadir</text>
        <text x="65" y="132" textAnchor="middle" className="fill-ink-3 text-[10px]">All targets gone;</text>
        <text x="65" y="145" textAnchor="middle" className="fill-ink-3 text-[10px]">nodes &lt;10 mm short axis</text>
        <text x="335" y="132" textAnchor="middle" className="fill-ink-3 text-[10px]">Neither PR nor PD</text>
        <text x="475" y="132" textAnchor="middle" className="fill-ink-3 text-[10px]">or new lesion(s)</text>
      </svg>
    </Figure>
  );
}

function Nucleus({ cx, cy, red, green, fused = 0 }: { cx: number; cy: number; red: [number, number][]; green: [number, number][]; fused?: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="38" ry="32" className="fill-blue-soft stroke-blue" />
      {red.map(([x, y], i) => <circle key={`r${i}`} cx={cx + x} cy={cy + y} r="4.5" className="fill-rose" />)}
      {green.map(([x, y], i) => <circle key={`g${i}`} cx={cx + x} cy={cy + y} r="4.5" className="fill-sage" />)}
      {Array.from({ length: fused }).map((_, i) => (
        <g key={`f${i}`}>
          <circle cx={cx - 14 + i * 22} cy={cy + 14} r="4.5" className="fill-rose" />
          <circle cx={cx - 9 + i * 22} cy={cy + 14} r="4.5" className="fill-sage" />
        </g>
      ))}
    </g>
  );
}

/** HER2 dual-probe ISH concept: HER2 signals vs chromosome 17 centromere signals. */
export function Her2IshDiagram() {
  return (
    <Figure caption="Schematic: dual-probe ISH counts HER2 gene signals (rose) and chromosome 17 centromere (CEP17) signals (sage) per nucleus. The ratio and the mean HER2 copy number together assign the ASCO/CAP group.">
      <svg viewBox="0 0 400 140" role="img" aria-labelledby="her2-t" className="h-auto w-full">
        <title id="her2-t">HER2 ISH: non-amplified versus amplified nucleus</title>
        <Nucleus cx={90} cy={65} red={[[-14, -8], [12, 6]]} green={[[-6, 10], [16, -12]]} />
        <Nucleus cx={290} cy={65} red={[[-20, -10], [-10, -16], [0, -8], [10, -16], [20, -6], [-16, 4], [-4, 6], [8, 2], [18, 10], [-8, 16], [4, 18]]} green={[[-24, 12], [24, -18]]} />
        <text x="90" y="125" textAnchor="middle" className="fill-ink-2 text-[11px]">Balanced signals (not amplified)</text>
        <text x="290" y="125" textAnchor="middle" className="fill-ink-2 text-[11px]">HER2 clusters (amplified)</text>
      </svg>
    </Figure>
  );
}

/** ALK break-apart FISH concept. */
export function AlkBreakApartDiagram() {
  return (
    <Figure caption="Schematic: a break-apart probe labels the two ends of the ALK gene in different colours. Intact genes show fused (adjacent) signals; a rearrangement separates them (split signals) or leaves an isolated 3′ signal.">
      <svg viewBox="0 0 560 140" role="img" aria-labelledby="alk-t" className="h-auto w-full">
        <title id="alk-t">ALK break-apart FISH patterns</title>
        <Nucleus cx={90} cy={60} red={[]} green={[]} fused={2} />
        <Nucleus cx={280} cy={60} red={[[18, -14]]} green={[[-20, -10]]} fused={1} />
        <Nucleus cx={470} cy={60} red={[[16, -12]]} green={[]} fused={1} />
        <text x="90" y="120" textAnchor="middle" className="fill-ink-2 text-[11px]">Fused only: negative pattern</text>
        <text x="280" y="120" textAnchor="middle" className="fill-ink-2 text-[11px]">Split 5′/3′ signals</text>
        <text x="470" y="120" textAnchor="middle" className="fill-ink-2 text-[11px]">Isolated 3′ signal</text>
      </svg>
    </Figure>
  );
}

/** mRECIST for pleural mesothelioma: thickness perpendicular to chest wall. */
export function MesoMrecistDiagram() {
  return (
    <Figure caption="Schematic: modified RECIST for pleural mesothelioma measures rind thickness perpendicular to the chest wall or mediastinum at two positions on each of three axial CT levels; the measurements are summed into a single unidimensional value.">
      <svg viewBox="0 0 400 170" role="img" aria-labelledby="meso-t" className="h-auto w-full">
        <title id="meso-t">Pleural rind thickness measured perpendicular to the chest wall</title>
        <ellipse cx="200" cy="85" rx="170" ry="70" className="fill-surface-2 stroke-border-strong" strokeWidth="3" />
        <path d="M 40 85 A 160 62 0 0 1 200 23 L 200 36 A 146 50 0 0 0 54 85 Z" className="fill-sage" opacity="0.75" />
        <ellipse cx="200" cy="90" rx="120" ry="45" className="fill-surface stroke-border" />
        <line x1="72" y1="52" x2="82" y2="62" className="stroke-ink" strokeWidth="2" />
        <line x1="150" y1="26" x2="152" y2="40" className="stroke-ink" strokeWidth="2" />
        <text x="60" y="44" className="fill-ink text-[10px] font-semibold">1</text>
        <text x="144" y="20" className="fill-ink text-[10px] font-semibold">2</text>
        <text x="200" y="95" textAnchor="middle" className="fill-ink-3 text-[11px]">Lung</text>
        <text x="300" y="30" className="fill-ink-2 text-[10px]">Pleural rind (sage)</text>
      </svg>
    </Figure>
  );
}
