import { Badge, Card, type BadgeTone } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/** Simple semantic table for atlas reference content. */
export function AtlasTable({ caption, columns, rows, className }: { caption: string; columns: string[]; rows: React.ReactNode[][]; className?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-border bg-surface", className)}>
      <table className="w-full min-w-[560px] text-left text-sm">
        <caption className="border-b border-border px-4 py-2.5 text-left text-xs font-medium text-ink-2">{caption}</caption>
        <thead className="border-b border-border bg-surface-2/60 text-xs text-ink-3">
          <tr>
            {columns.map((c) => (
              <th key={c} scope="col" className="px-4 py-2 font-medium">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border/70 align-top last:border-0">
              {r.map((cell, j) =>
                j === 0 ? (
                  <th key={j} scope="row" className="px-4 py-2.5 font-medium text-ink">{cell}</th>
                ) : (
                  <td key={j} className="px-4 py-2.5 leading-relaxed text-ink-2">{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InfoCard({ title, tag, tone, children, className }: { title: string; tag?: string; tone?: BadgeTone; children: React.ReactNode; className?: string }) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-serif text-lg leading-snug text-ink">{title}</h3>
        {tag && <Badge tone={tone}>{tag}</Badge>}
      </div>
      <div className="space-y-2 text-sm leading-relaxed text-ink-2 [&_li]:ml-4 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-1">{children}</div>
    </Card>
  );
}

export function AtlasSection({ id, eyebrow, title, description, children }: { id: string; eyebrow?: string; title: string; description?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-20 border-t border-border pt-10 first:border-0 first:pt-0">
      <div className="mb-5 max-w-3xl">
        {eyebrow && <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">{eyebrow}</p>}
        <h2 id={`${id}-h`} className="font-serif text-2xl tracking-tight text-ink">{title}</h2>
        {description && <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function OnThisPage({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="mb-10 rounded-2xl border border-border bg-surface-2/50 px-4 py-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">On this page</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className="text-ink-2 hover:text-accent">{i.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
