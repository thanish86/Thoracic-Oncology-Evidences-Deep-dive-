"use client";

import { useActionState, useEffect, useState } from "react";
import { reviewAnalysis, type ReviewState } from "@/app/admin/evidence/actions";
import { Button } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const REVIEWER_KEY = "oa:reviewer:v1";

export function ReviewForm({ analysisId }: { analysisId: string }) {
  const [state, action, pending] = useActionState<ReviewState, FormData>(reviewAnalysis, { ok: false, message: "" });
  const [reviewer, setReviewer] = useState({ name: "", email: "" });
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REVIEWER_KEY);
      if (saved) setReviewer(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);
  const remember = (next: typeof reviewer) => {
    setReviewer(next);
    try {
      localStorage.setItem(REVIEWER_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  return (
    <form action={action} className="mt-3 space-y-2 rounded-xl border border-border bg-surface-2/50 p-3">
      <input type="hidden" name="analysisId" value={analysisId} />
      <div className="grid gap-2 sm:grid-cols-3">
        <label className="text-xs text-ink-3">
          Reviewer name
          <input name="reviewerName" required value={reviewer.name} onChange={(e) => remember({ ...reviewer, name: e.target.value })} className="mt-1 h-8 w-full rounded-lg border border-border bg-surface px-2 text-sm text-ink" />
        </label>
        <label className="text-xs text-ink-3">
          Reviewer email
          <input name="reviewerEmail" type="email" required value={reviewer.email} onChange={(e) => remember({ ...reviewer, email: e.target.value })} className="mt-1 h-8 w-full rounded-lg border border-border bg-surface px-2 text-sm text-ink" />
        </label>
        <label className="text-xs text-ink-3">
          Review token
          <input name="token" type="password" required autoComplete="off" className="mt-1 h-8 w-full rounded-lg border border-border bg-surface px-2 text-sm text-ink" />
        </label>
      </div>
      <label className="block text-xs text-ink-3">
        Comment (required unless approving)
        <textarea name="comment" rows={2} className="mt-1 w-full rounded-lg border border-border bg-surface px-2 py-1 text-sm text-ink" />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="primary" name="decision" value="APPROVED" disabled={pending}>Approve as verified</Button>
        <Button size="sm" name="decision" value="CHANGES_REQUESTED" disabled={pending}>Request changes</Button>
        <Button size="sm" variant="ghost" name="decision" value="REJECTED" disabled={pending}>Reject</Button>
        {state.message && <p role="status" className={cn("text-xs", state.ok ? "text-success" : "text-danger")}>{state.message}</p>}
      </div>
    </form>
  );
}
