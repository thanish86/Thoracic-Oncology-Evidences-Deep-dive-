import { Lightbulb } from "lucide-react";

/** A teaching section with an anchor id, prose, key points and an exam pearl. */
export function ConceptSection({
  id,
  eyebrow,
  title,
  children,
  points,
  pearl,
  widget,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  points?: React.ReactNode[];
  pearl?: React.ReactNode;
  widget?: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 border-t border-border pt-10">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">{eyebrow}</p>
      <h2 id={`${id}-title`} className="font-serif text-2xl tracking-tight text-ink">
        <a href={`#${id}`} className="hover:underline">
          {title}
        </a>
      </h2>
      <div className="prose-atlas mt-3 max-w-3xl text-[15px]">{children}</div>
      {points && points.length > 0 && (
        <ul className="mt-4 grid max-w-4xl gap-2 sm:grid-cols-2">
          {points.map((p, i) => (
            <li key={i} className="rounded-xl border border-border bg-surface px-3 py-2 text-[13px] leading-relaxed text-ink-2">
              {p}
            </li>
          ))}
        </ul>
      )}
      {pearl && (
        <div className="mt-4 flex max-w-3xl gap-2 rounded-xl bg-lavender-soft px-4 py-3 text-[13px] leading-relaxed text-ink-2">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-lavender" aria-hidden />
          <p>
            <span className="font-semibold text-ink">Exam pearl: </span>
            {pearl}
          </p>
        </div>
      )}
      {widget && <div className="mt-6">{widget}</div>}
    </section>
  );
}
