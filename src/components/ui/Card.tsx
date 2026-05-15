import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-card)] ${className ?? ""}`}
      {...props}
    >
      {children}
    </div>
  );
});
