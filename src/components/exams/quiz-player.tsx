"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ExternalLink, RotateCcw, XCircle } from "lucide-react";
import { Badge, Button, EmptyState } from "@/components/ui/primitives";
import type { QuizFormat, QuizQuestionDef } from "@/lib/exams/questions";
import { cn } from "@/lib/utils";

const FORMAT_LABEL: Record<QuizFormat, string> = {
  SINGLE_BEST_ANSWER: "Single best answer",
  TYPE_K: "Type K (true/false)",
  VIGNETTE: "Clinical vignette",
  TRIAL_INTERPRETATION: "Trial interpretation",
  BIOMARKER: "Biomarker",
  STAGING: "Staging",
  IMAGE: "Image",
};

type Answer = { correct: string } | { truth: Record<string, boolean> };
const isTypeK = (a: Answer): a is { truth: Record<string, boolean> } => "truth" in a;

interface QState {
  choice?: string;
  truth: Record<string, boolean>;
  submitted: boolean;
}
const EMPTY: QState = { truth: {}, submitted: false };

function isComplete(q: QuizQuestionDef, s: QState) {
  return isTypeK(q.answer) ? q.options.every((o) => s.truth[o.id] !== undefined) : s.choice !== undefined;
}

function isCorrect(q: QuizQuestionDef, s: QState) {
  const a = q.answer;
  return isTypeK(a) ? q.options.every((o) => s.truth[o.id] === a.truth[o.id]) : s.choice === a.correct;
}

export function QuizPlayer({ questions }: { questions: QuizQuestionDef[] }) {
  const [format, setFormat] = useState<string>("all");
  const [topic, setTopic] = useState<string>("all");
  const [state, setState] = useState<Record<string, QState>>({});
  const formatId = useId();
  const topicId = useId();

  const formats = useMemo(() => [...new Set(questions.map((q) => q.format))], [questions]);
  const topics = useMemo(() => [...new Set(questions.map((q) => q.topic))].sort(), [questions]);
  const visible = questions.filter((q) => (format === "all" || q.format === format) && (topic === "all" || q.topic === topic));

  const submitted = visible.filter((q) => state[q.slug]?.submitted);
  const correct = submitted.filter((q) => isCorrect(q, state[q.slug]));

  const update = (slug: string, fn: (s: QState) => QState) => setState((prev) => ({ ...prev, [slug]: fn(prev[slug] ?? EMPTY) }));

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-1 mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-surface/95 p-3 backdrop-blur">
        <div>
          <label htmlFor={formatId} className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-ink-3">Format</label>
          <select id={formatId} value={format} onChange={(e) => setFormat(e.target.value)} className="h-9 rounded-lg border border-border bg-surface px-2 text-sm text-ink">
            <option value="all">All formats</option>
            {formats.map((f) => (
              <option key={f} value={f}>{FORMAT_LABEL[f]}</option>
            ))}
          </select>
        </div>
        <div className="min-w-0 max-w-full">
          <label htmlFor={topicId} className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-ink-3">Topic</label>
          <select id={topicId} value={topic} onChange={(e) => setTopic(e.target.value)} className="h-9 max-w-full rounded-lg border border-border bg-surface px-2 text-sm text-ink">
            <option value="all">All topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <p className="tabular text-sm text-ink-2" aria-live="polite">
            Score <span className="font-semibold text-ink">{correct.length}</span> / {submitted.length} answered
            <span className="text-ink-3"> · {visible.length} shown</span>
          </p>
          <Button type="button" size="sm" variant="ghost" onClick={() => setState({})} disabled={!Object.keys(state).length}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset
          </Button>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No questions match these filters">Choose another format or topic.</EmptyState>
      ) : (
        <ol className="space-y-6">
          {visible.map((q, i) => (
            <li key={q.slug}>
              <QuestionCard
                index={i + 1}
                q={q}
                s={state[q.slug] ?? EMPTY}
                onChange={(fn) => update(q.slug, fn)}
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function QuestionCard({ index, q, s, onChange }: { index: number; q: QuizQuestionDef; s: QState; onChange: (fn: (s: QState) => QState) => void }) {
  const name = useId();
  const complete = isComplete(q, s);
  const right = s.submitted && isCorrect(q, s);
  const a = q.answer;

  return (
    <article className="rounded-2xl border border-border bg-surface p-4 shadow-soft sm:p-5" aria-labelledby={`${name}-stem`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="tabular text-[12px] font-semibold text-ink-3">Q{index}</span>
        <Badge tone={isTypeK(a) ? "lavender" : "blue"}>{FORMAT_LABEL[q.format]}</Badge>
        <Badge>{q.topic}</Badge>
        {s.submitted && (
          <Badge tone={right ? "sage" : "danger"} className="ml-auto">
            {right ? "Correct" : "Incorrect"}
          </Badge>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (complete) onChange((st) => ({ ...st, submitted: true }));
        }}
      >
        <fieldset disabled={s.submitted}>
          <legend id={`${name}-stem`} className="mb-3 text-[15px] leading-relaxed text-ink">
            {q.stem}
          </legend>

          {isTypeK(a) ? (
            <div className="space-y-2">
              <p className="text-[12px] text-ink-3">Mark each statement true or false. Scored correct only if all four are right.</p>
              {q.options.map((o) => {
                const mine = s.truth[o.id];
                const key = a.truth[o.id];
                const ok = s.submitted && mine === key;
                return (
                  <fieldset
                    key={o.id}
                    className={cn(
                      "rounded-xl border px-3 py-2",
                      !s.submitted && "border-border",
                      s.submitted && ok && "border-success/50 bg-sage-soft",
                      s.submitted && !ok && "border-danger/50 bg-rose-soft",
                    )}
                  >
                    <legend className="sr-only">Statement {o.id}</legend>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="min-w-0 flex-1 text-[14px] leading-relaxed text-ink">
                        <span className="tabular mr-1.5 font-semibold text-ink-3">{o.id}.</span>
                        {o.text}
                      </p>
                      <div className="flex shrink-0 gap-3" role="radiogroup" aria-label={`Statement ${o.id}: true or false`}>
                        {[true, false].map((v) => (
                          <label key={String(v)} className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] text-ink-2">
                            <input
                              type="radio"
                              name={`${name}-${o.id}`}
                              checked={mine === v}
                              onChange={() => onChange((st) => ({ ...st, truth: { ...st.truth, [o.id]: v } }))}
                              className="accent-[var(--accent)]"
                            />
                            {v ? "True" : "False"}
                          </label>
                        ))}
                      </div>
                    </div>
                    {s.submitted && (
                      <p className={cn("mt-1 flex items-center gap-1 text-[12px] font-medium", ok ? "text-success" : "text-danger")}>
                        {ok ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : <XCircle className="h-3.5 w-3.5" aria-hidden />}
                        Key: {key ? "True" : "False"} · you answered {mine ? "True" : "False"}
                      </p>
                    )}
                  </fieldset>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {q.options.map((o) => {
                const chosen = s.choice === o.id;
                const isKey = a.correct === o.id;
                return (
                  <label
                    key={o.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2 text-[14px] leading-relaxed transition-colors",
                      !s.submitted && (chosen ? "border-accent bg-accent-soft" : "border-border hover:bg-surface-2"),
                      s.submitted && isKey && "border-success/50 bg-sage-soft",
                      s.submitted && chosen && !isKey && "border-danger/50 bg-rose-soft",
                      s.submitted && !chosen && !isKey && "border-border opacity-70",
                    )}
                  >
                    <input
                      type="radio"
                      name={name}
                      value={o.id}
                      checked={chosen}
                      onChange={() => onChange((st) => ({ ...st, choice: o.id }))}
                      className="mt-1 accent-[var(--accent)]"
                    />
                    <span className="min-w-0 flex-1 text-ink">
                      <span className="tabular mr-1.5 font-semibold text-ink-3">{o.id}.</span>
                      {o.text}
                    </span>
                    {s.submitted && isKey && (
                      <span className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-success">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Correct answer
                      </span>
                    )}
                    {s.submitted && chosen && !isKey && (
                      <span className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-danger">
                        <XCircle className="h-3.5 w-3.5" aria-hidden /> Your answer
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </fieldset>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!s.submitted ? (
            <>
              <Button type="submit" variant="primary" size="sm" disabled={!complete}>
                Submit
              </Button>
              {!complete && <span className="text-[12px] text-ink-3">{isTypeK(a) ? "Answer all four statements to submit." : "Select an option to submit."}</span>}
            </>
          ) : (
            <Button type="button" size="sm" variant="ghost" onClick={() => onChange(() => EMPTY)}>
              <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Try again
            </Button>
          )}
        </div>
      </form>

      {s.submitted && (
        <div className="mt-4 rounded-xl bg-surface-2 px-4 py-3" aria-live="polite">
          <p className="text-[13px] font-semibold text-ink">
            {isTypeK(a)
              ? `Key: ${q.options.map((o) => `${o.id} ${a.truth[o.id] ? "T" : "F"}`).join(", ")}`
              : `Correct answer: ${a.correct}`}
          </p>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">{q.explanation}</p>
          {q.sources.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">Sources</p>
              <ul className="mt-1 space-y-1 text-[13px]">
                {q.sources.map((src, i) => (
                  <li key={i} className="flex flex-wrap items-center gap-x-2 text-ink-2">
                    {src.url ? (
                      <a href={src.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                        {src.label}
                        <ExternalLink className="h-3 w-3" aria-hidden />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ) : (
                      <span>{src.label}</span>
                    )}
                    {src.trialSlug && (
                      <Link href={`/trials/${src.trialSlug}`} className="text-[12px] font-medium text-accent hover:underline">
                        Trial dossier →
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
