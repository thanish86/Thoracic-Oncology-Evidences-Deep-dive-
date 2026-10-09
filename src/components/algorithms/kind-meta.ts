import type { AlgorithmNodeKind } from "@/content/algorithms/types";

export const KIND_META: Record<AlgorithmNodeKind, { label: string; className: string; dot: string }> = {
  decision: { label: "Decision", className: "border-lavender bg-lavender-soft", dot: "bg-lavender" },
  test: { label: "Test", className: "border-blue bg-blue-soft", dot: "bg-blue" },
  treatment: { label: "Treatment", className: "border-sage bg-sage-soft", dot: "bg-sage" },
  note: { label: "Note", className: "border-sand bg-sand-soft border-dashed", dot: "bg-sand" },
};
