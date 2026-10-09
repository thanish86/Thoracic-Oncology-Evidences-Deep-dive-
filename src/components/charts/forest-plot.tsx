/**
 * Forest plot of stored effect estimates (ratio measures on a log scale).
 * Renders only values that exist in the database with both CI bounds —
 * never imputes, never reconstructs from figures.
 */
export interface ForestRow {
  label: string;
  sublabel?: string;
  estimate: number;
  lower: number;
  upper: number;
  measure: string;
}

export function ForestPlot({ rows, title, favoursLeft = "Favours experimental", favoursRight = "Favours control" }: { rows: ForestRow[]; title: string; favoursLeft?: string; favoursRight?: string }) {
  const valid = rows.filter((r) => r.lower > 0 && r.upper > 0 && r.estimate > 0);
  if (!valid.length) return null;
  const min = Math.min(0.1, ...valid.map((r) => r.lower));
  const max = Math.max(2, ...valid.map((r) => r.upper));
  const lmin = Math.log(min);
  const lmax = Math.log(max);
  const W = 360;
  const rowH = 34;
  const top = 10;
  const H = top + valid.length * rowH + 44;
  const x = (v: number) => ((Math.log(v) - lmin) / (lmax - lmin)) * W;
  const ticks = [0.1, 0.25, 0.5, 1, 2, 4].filter((t) => t >= min && t <= max);

  return (
    <figure className="overflow-x-auto rounded-2xl border border-border bg-surface p-4">
      <figcaption className="mb-3 text-sm font-medium text-ink">{title}</figcaption>
      <div className="grid min-w-[640px] grid-cols-[minmax(180px,1fr)_380px_150px] items-start gap-3">
        <div style={{ paddingTop: top }}>
          {valid.map((r, i) => (
            <div key={i} className="flex flex-col justify-center" style={{ height: rowH }}>
              <span className="truncate text-[13px] text-ink">{r.label}</span>
              {r.sublabel && <span className="truncate text-[11px] text-ink-3">{r.sublabel}</span>}
            </div>
          ))}
        </div>
        <svg viewBox={`-10 0 ${W + 20} ${H}`} className="w-full" role="img" aria-label={`${title}: forest plot of ${valid.length} effect estimates on a log scale`}>
          <line x1={x(1)} x2={x(1)} y1={0} y2={top + valid.length * rowH} stroke="var(--border-strong)" strokeDasharray="3 3" />
          {valid.map((r, i) => {
            const cy = top + i * rowH + rowH / 2;
            return (
              <g key={i}>
                <line x1={x(r.lower)} x2={x(r.upper)} y1={cy} y2={cy} stroke="var(--ink-2)" strokeWidth={1.5} />
                <line x1={x(r.lower)} x2={x(r.lower)} y1={cy - 4} y2={cy + 4} stroke="var(--ink-2)" />
                <line x1={x(r.upper)} x2={x(r.upper)} y1={cy - 4} y2={cy + 4} stroke="var(--ink-2)" />
                <rect x={x(r.estimate) - 5} y={cy - 5} width={10} height={10} fill="var(--accent)" />
              </g>
            );
          })}
          <line x1={0} x2={W} y1={top + valid.length * rowH + 4} y2={top + valid.length * rowH + 4} stroke="var(--border-strong)" />
          {ticks.map((t) => (
            <g key={t}>
              <line x1={x(t)} x2={x(t)} y1={top + valid.length * rowH + 4} y2={top + valid.length * rowH + 9} stroke="var(--ink-3)" />
              <text x={x(t)} y={top + valid.length * rowH + 22} textAnchor="middle" fontSize={10} fill="var(--ink-3)">{t}</text>
            </g>
          ))}
          <text x={x(1) - 6} y={H - 4} textAnchor="end" fontSize={10} fill="var(--ink-3)">← {favoursLeft}</text>
          <text x={x(1) + 6} y={H - 4} fontSize={10} fill="var(--ink-3)">{favoursRight} →</text>
        </svg>
        <div style={{ paddingTop: top }}>
          {valid.map((r, i) => (
            <div key={i} className="flex items-center tabular text-[12px] text-ink-2" style={{ height: rowH }}>
              {r.measure} {r.estimate} ({r.lower}–{r.upper})
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
