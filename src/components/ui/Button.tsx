import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-[var(--color-border-accent)] bg-[var(--color-accent)] text-white shadow-[var(--shadow-accent)] hover:bg-[var(--color-accent-hover)]",
  outline:
    "border border-[var(--color-border)] bg-transparent text-[var(--color-text)] hover:border-[var(--color-border-accent)] hover:bg-[var(--color-accent-muted)] hover:text-[var(--color-accent)]",
  ghost:
    "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export function Button({
  children,
  className,
  type = "button",
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] font-medium transition-colors duration-150 ${variantClasses[variant]} ${sizeClasses[size]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
