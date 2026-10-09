import { BadgeCheck, CircleDashed, Clock3, History, RefreshCw, TriangleAlert } from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/primitives";

const STATUS: Record<string, { label: string; tone: BadgeTone; icon: React.ComponentType<{ className?: string }>; description: string }> = {
  VERIFIED: { label: "Verified", tone: "sage", icon: BadgeCheck, description: "Approved by a named human reviewer against the cited source." },
  PRELIMINARY: { label: "Preliminary", tone: "lavender", icon: CircleDashed, description: "Interim or conference-level data; may change." },
  AWAITING_VERIFICATION: {
    label: "Awaiting verification",
    tone: "warning",
    icon: Clock3,
    description: "Transcribed from the cited source with a verbatim quote; not yet approved by a human reviewer.",
  },
  UPDATED_ANALYSIS: { label: "Updated analysis", tone: "blue", icon: RefreshCw, description: "A later analysis of a previously reported endpoint." },
  HISTORICAL: { label: "Historical", tone: "neutral", icon: History, description: "Superseded by later evidence; retained for history." },
  CORRECTED_RETRACTED: { label: "Corrected / retracted", tone: "danger", icon: TriangleAlert, description: "The source has been corrected or retracted." },
};

export function EvidenceStatusBadge({ status, showDescription = false }: { status: string; showDescription?: boolean }) {
  const s = STATUS[status] ?? STATUS.AWAITING_VERIFICATION;
  const Icon = s.icon;
  return (
    <span className="inline-flex items-center gap-2">
      <Badge tone={s.tone} title={s.description}>
        <Icon className="h-3 w-3" aria-hidden />
        {s.label}
      </Badge>
      {showDescription && <span className="text-xs text-ink-3">{s.description}</span>}
    </span>
  );
}

export const STATUS_META = STATUS;
