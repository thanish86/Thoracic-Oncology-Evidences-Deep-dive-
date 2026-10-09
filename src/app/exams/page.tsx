import type { Metadata } from "next";
import { z } from "zod";
import { Notice, PageHeader } from "@/components/ui/primitives";
import { QuizPlayer } from "@/components/exams/quiz-player";
import { QUIZ_QUESTIONS, type QuizQuestionDef } from "@/lib/exams/questions";
import { listQuizQuestions } from "@/server/services/catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Exam studio",
  description: "Original ESMO/SCE-style single-best-answer and Type K practice questions in thoracic and breast oncology, with explanations and sources.",
};

const optionsSchema = z.array(z.object({ id: z.string(), text: z.string() }));
const answerSchema = z.union([z.object({ correct: z.string() }), z.object({ truth: z.record(z.boolean()) })]);

/** DB rows do not store sources, so they are joined back from the curated definitions by slug. */
async function loadQuestions(): Promise<{ questions: QuizQuestionDef[]; fromDb: boolean }> {
  const bySlug = new Map(QUIZ_QUESTIONS.map((q) => [q.slug, q]));
  try {
    const rows = await listQuizQuestions();
    const parsed: QuizQuestionDef[] = [];
    for (const r of rows) {
      const options = optionsSchema.safeParse(r.options);
      const answer = answerSchema.safeParse(r.answer);
      if (!options.success || !answer.success) continue;
      parsed.push({
        slug: r.slug,
        format: r.format,
        topic: r.topic,
        stem: r.stem,
        options: options.data,
        answer: answer.data,
        explanation: r.explanation,
        sources: bySlug.get(r.slug)?.sources ?? [],
        trialSlugs: r.trialSlugs,
      });
    }
    if (parsed.length) return { questions: parsed, fromDb: true };
  } catch {
    // database unavailable — fall through to bundled definitions
  }
  return { questions: [...QUIZ_QUESTIONS].sort((a, b) => a.topic.localeCompare(b.topic)), fromDb: false };
}

export default async function ExamsPage() {
  const { questions, fromDb } = await loadQuestions();
  return (
    <>
      <PageHeader
        eyebrow="Learning studio"
        title="Exam Studio"
        description="ESMO/SCE-style practice in single-best-answer and Type K (true/false) formats. Answers stay hidden until you submit; each question then shows the key, per-option feedback, an explanation and its sources."
      >
        <Notice tone="warning" title="Original questions — awaiting expert review">
          These items were written for ONCOATLAS and are not official ESMO, SCE or other examination questions. They are awaiting verification by a named oncologist; treat explanations as study notes and check the cited sources.
        </Notice>
      </PageHeader>
      <QuizPlayer questions={questions} />
      {!fromDb && <p className="mt-6 text-[11px] text-ink-3">Loaded from bundled question definitions (database unavailable or empty).</p>}
    </>
  );
}
