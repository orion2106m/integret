import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "../../hooks/useFocusTrap";

interface FormModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  isDismissible?: boolean;
}

export default function FormModal({
  isOpen,
  title,
  subtitle,
  children,
  onClose,
  isDismissible = true,
}: FormModalProps) {
  const titleId = useId();
  const subtitleId = useId();
  const containerRef = useFocusTrap(isOpen);
  const backdropRef = useRef<HTMLDivElement>(null);
  const previousOverflowRef = useRef<string>("");

  useEffect(() => {
    if (!isOpen) return;

    // Guardar overflow actual
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (isDismissible && e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    const handleBackdropClick = (e: MouseEvent) => {
      // Solo cerrar si se hace click directamente en el backdrop
      if (isDismissible && e.target === backdropRef.current) {
        onClose();
      }
    };

    // Event listeners con captura para mejor control
    document.addEventListener("keydown", handleEscape, true);
    backdropRef.current?.addEventListener("click", handleBackdropClick);

    return () => {
      document.removeEventListener("keydown", handleEscape, true);
      backdropRef.current?.removeEventListener("click", handleBackdropClick);
      // Restaurar scroll
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, [isOpen, onClose, isDismissible]);

  // Ariatribuir aria-hidden al body (excepto el modal)
  useEffect(() => {
    if (!isOpen) return;

    const main = document.querySelector("main");
    const nav = document.querySelector("nav");

    if (main) main.setAttribute("aria-hidden", "true");
    if (nav) nav.setAttribute("aria-hidden", "true");

    return () => {
      if (main) main.removeAttribute("aria-hidden");
      if (nav) nav.removeAttribute("aria-hidden");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop - Click aquí para cerrar */}
      <div
        ref={backdropRef}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md transition-opacity duration-300 anim-fade-in"
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 anim-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? subtitleId : undefined}
      >
        <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-2xl anim-scale-in flex flex-col">
          {/* Header - Sticky */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4">
            <div className="flex-1">
              <h2
                id={titleId}
                className="text-lg font-semibold text-[var(--color-text)]"
              >
                {title}
              </h2>
              {subtitle && (
                <p
                  id={subtitleId}
                  className="mt-1 text-sm text-[var(--color-text-muted)]"
                >
                  {subtitle}
                </p>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-all duration-200 hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-violet)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]"
              aria-label={`Cerrar ${title}`}
              type="button"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-6">
            {children}
          </div>

          {/* Hint de accesibilidad */}
          <div className="sr-only" role="status" aria-live="polite">
            {isDismissible &&
              "Presiona Escape o haz click fuera del modal para cerrarlo."}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
