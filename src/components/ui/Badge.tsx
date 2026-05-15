import type { HTMLAttributes } from "react";

type BadgeTone =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "info"
  | "danger"
  | "disabled"
  | "violet"
  | "teal";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]",
  accent: "bg-[var(--color-accent-muted)] text-[var(--color-accent)]",
  success: "bg-[rgba(74,222,128,0.1)] text-[var(--color-success)]",
  warning: "bg-[rgba(250,204,21,0.1)] text-[var(--color-warning)]",
  info: "bg-[rgba(96,165,250,0.1)] text-[var(--color-info)]",
  danger: "bg-[rgba(248,113,113,0.1)] text-[var(--color-error)]",
  disabled: "bg-[rgba(68,68,90,0.14)] text-[var(--color-text-disabled)]",
  violet: "bg-[var(--color-accent-muted)] text-[var(--color-accent)]",
  teal: "bg-[rgba(96,165,250,0.1)] text-[var(--color-info)]",
};

export function Badge({
  children,
  className,
  tone = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-[6px] px-2.5 py-1 text-[11px] font-medium ${toneClasses[tone]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </span>
  );
}
