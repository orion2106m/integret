import type { ReactNode } from "react";
import { Button } from "./Button";

export interface ErrorFallbackProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onRetry?: () => void;
  icon?: ReactNode;
}

export function ErrorFallback({
  title = "Ocurrió un error",
  message = "No pudimos cargar el contenido. Intenta de nuevo en unos segundos.",
  actionLabel = "Reintentar",
  onRetry,
  icon,
}: ErrorFallbackProps) {
  return (
    <div className="surface-1 anim-fade-up rounded-[var(--radius-lg)] p-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,107,107,0.16)] text-[var(--color-danger)]">
        {icon ?? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M12 8v4m0 4h.01" />
            <path d="M10.3 3.5 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.7 3.5a2 2 0 0 0-3.4 0Z" />
          </svg>
        )}
      </div>
      <h2 className="text-lg font-semibold text-[var(--color-text)]">
        {title}
      </h2>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">{message}</p>
      {onRetry ? (
        <Button onClick={onRetry} className="mt-4">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
