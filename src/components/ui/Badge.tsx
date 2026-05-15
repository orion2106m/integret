import type { HTMLAttributes } from "react";

type BadgeTone = "neutral" | "violet" | "teal";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-[var(--color-surface-2)] text-[var(--color-text-muted)]",
  violet: "bg-[rgba(108,99,255,0.16)] text-[var(--color-accent-violet)]",
  teal: "bg-[rgba(78,205,196,0.16)] text-[var(--color-accent-teal)]",
};

export function Badge({
  children,
  className,
  tone = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </span>
  );
}
