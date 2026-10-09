import { FlaskRound } from "lucide-react";
import { cn } from "@/lib/utils";

/** Mandatory label for every teaching chart: the data are simulated, never trial results. */
export function SyntheticBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-sand-soft px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-warning ring-1 ring-inset ring-sand/40",
        className,
      )}
    >
      <FlaskRound className="h-3 w-3" aria-hidden />
      Synthetic data for teaching
    </span>
  );
}

export function fmtP(p: number): string {
  if (!Number.isFinite(p)) return "—";
  if (p < 0.001) return "<0.001";
  if (p < 0.01) return p.toFixed(3);
  return p.toFixed(2);
}

export function fmt(n: number | null | undefined, dp = 2): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return n.toFixed(dp);
}
