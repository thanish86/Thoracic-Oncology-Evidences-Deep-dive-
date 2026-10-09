"use server";

import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { EvidenceStatus } from "@prisma/client";
import { analysisKey } from "@/lib/content/keys";
import { prisma } from "@/server/db";

const reviewSchema = z.object({
  analysisId: z.string().min(1).max(64),
  decision: z.enum(["APPROVED", "REJECTED", "CHANGES_REQUESTED"]),
  reviewerEmail: z.string().email().max(200),
  reviewerName: z.string().trim().min(2).max(120),
  comment: z.string().trim().max(2000).optional(),
  token: z.string().min(1).max(500),
});

export interface ReviewState {
  ok: boolean;
  message: string;
}

function tokenMatches(given: string): boolean {
  const expected = process.env.ADMIN_REVIEW_TOKEN;
  if (!expected || expected.length < 16) return false; // reviews disabled unless a strong token is configured
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

const STATUS_FOR: Record<z.infer<typeof reviewSchema>["decision"], EvidenceStatus> = {
  APPROVED: "VERIFIED",
  REJECTED: "AWAITING_VERIFICATION",
  CHANGES_REQUESTED: "AWAITING_VERIFICATION",
};

/** Record a human review decision on one outcome analysis. Requires ADMIN_REVIEW_TOKEN. */
export async function reviewAnalysis(_prev: ReviewState, form: FormData): Promise<ReviewState> {
  const parsed = reviewSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { ok: false, message: "Please complete reviewer name, a valid email and the review token." };
  const { analysisId, decision, reviewerEmail, reviewerName, comment, token } = parsed.data;
  if (!tokenMatches(token)) return { ok: false, message: "Review token rejected (or reviews are disabled because ADMIN_REVIEW_TOKEN is not configured)." };
  if (decision !== "APPROVED" && !comment) return { ok: false, message: "A comment is required when rejecting or requesting changes." };

  const analysis = await prisma.trialOutcomeAnalysis.findUnique({
    where: { id: analysisId },
    include: { outcome: { include: { endpoint: { include: { trial: { select: { slug: true } } } } } } },
  });
  if (!analysis) return { ok: false, message: "Analysis not found (the database may have been re-seeded)." };

  const key = analysisKey({
    trialSlug: analysis.outcome.endpoint.trial.slug,
    endpoint: analysis.outcome.endpoint.code,
    endpointLabel: analysis.outcome.endpoint.label,
    population: analysis.outcome.population,
    analysisLabel: analysis.analysisLabel,
  });
  const toStatus = STATUS_FOR[decision];

  await prisma.$transaction(async (tx) => {
    const reviewer = await tx.user.upsert({
      where: { email: reviewerEmail.toLowerCase() },
      create: { email: reviewerEmail.toLowerCase(), name: reviewerName, role: "REVIEWER" },
      update: { name: reviewerName },
    });
    await tx.verificationRecord.create({
      data: { entityType: "TrialOutcomeAnalysis", entityId: key, action: decision, fromStatus: analysis.status, toStatus, comment, reviewerId: reviewer.id },
    });
    await tx.trialOutcomeAnalysis.update({ where: { id: analysisId }, data: { status: toStatus } });
    await tx.auditLog.create({
      data: { userId: reviewer.id, action: `review:${decision}`, entityType: "TrialOutcomeAnalysis", entityId: key, diff: { from: analysis.status, to: toStatus } },
    });
  });

  revalidatePath("/admin/evidence");
  return { ok: true, message: `${decision === "APPROVED" ? "Approved — value is now Verified" : "Decision recorded"} (${key}).` };
}
