import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-ring",
  {
    variants: {
      variant: {
        primary: "bg-ink text-bg hover:bg-ink/90",
        secondary: "bg-surface border border-border text-ink hover:bg-surface-2",
        ghost: "text-ink-2 hover:bg-surface-2 hover:text-ink",
        accent: "bg-accent text-white hover:bg-accent/90",
      },
      size: { sm: "h-8 px-3 text-xs", md: "h-9 px-4", lg: "h-11 px-6 text-base", icon: "h-9 w-9" },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
Button.displayName = "Button";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide", {
  variants: {
    tone: {
      neutral: "bg-surface-2 text-ink-2 ring-1 ring-inset ring-border",
      blue: "bg-blue-soft text-blue-ink",
      sage: "bg-sage-soft text-sage-ink",
      lavender: "bg-lavender-soft text-lavender-ink",
      rose: "bg-rose-soft text-rose-ink",
      sand: "bg-sand-soft text-sand-ink",
      danger: "bg-rose-soft text-rose-ink",
      warning: "bg-sand-soft text-sand-ink",
    },
  },
  defaultVariants: { tone: "neutral" },
});
export type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>["tone"]>;
export function Badge({ className, tone, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-border bg-surface shadow-soft", className)} {...props} />;
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="max-w-3xl">
        {eyebrow && <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">{eyebrow}</p>}
        <h2 className="font-serif text-2xl tracking-tight text-ink">{title}</h2>
        {description && <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="mb-8 border-b border-border pb-8">
      {eyebrow && <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3">{eyebrow}</p>}
      <h1 className="font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">{title}</h1>
      {description && <div className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-2">{description}</div>}
      {children && <div className="mt-5">{children}</div>}
    </header>
  );
}

export function EmptyState({ icon, title, children, action }: { icon?: React.ReactNode; title: string; children?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface/60 px-6 py-12 text-center">
      {icon && <div className="mb-3 text-ink-3">{icon}</div>}
      <p className="font-medium text-ink">{title}</p>
      {children && <div className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-2">{children}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} aria-hidden />;
}

export function Notice({ tone = "info", title, children }: { tone?: "info" | "warning"; title?: string; children: React.ReactNode }) {
  return (
    <div
      role="note"
      className={cn(
        "rounded-xl border px-4 py-3 text-sm leading-relaxed",
        tone === "warning" ? "border-sand/40 bg-sand-soft text-ink-2" : "border-blue/30 bg-blue-soft text-ink-2",
      )}
    >
      {title && <p className="mb-0.5 font-medium text-ink">{title}</p>}
      {children}
    </div>
  );
}

export function KeyValue({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(110px,160px)_1fr] gap-3 border-b border-border/70 py-2.5 text-sm last:border-0">
      <dt className="text-ink-3">{label}</dt>
      <dd className="text-ink">{children ?? <span className="text-ink-3">Not yet extracted</span>}</dd>
    </div>
  );
}
