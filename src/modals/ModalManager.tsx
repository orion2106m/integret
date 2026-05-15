import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import type {
  DrawerModalConfig,
  ModalConfig,
  ModalInstance,
  ModalManagerValue,
  ModalTone,
} from "./modal.types";

const ModalContext = createContext<ModalManagerValue | null>(null);

function getFocusableElements(node: HTMLElement | null) {
  if (!node) {
    return [] as HTMLElement[];
  }

  return Array.from(
    node.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter(
    (element) =>
      !element.hasAttribute("disabled") && !element.getAttribute("aria-hidden"),
  );
}

function toneClasses(tone: ModalTone = "neutral") {
  switch (tone) {
    case "success":
      return "border-[rgba(5,150,105,0.2)] bg-[rgba(5,150,105,0.12)] text-[var(--color-success)]";
    case "warning":
      return "border-[rgba(217,119,6,0.2)] bg-[rgba(217,119,6,0.12)] text-[var(--color-warning)]";
    case "danger":
      return "border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.12)] text-[var(--color-danger)]";
    case "info":
      return "border-[rgba(37,99,235,0.2)] bg-[rgba(37,99,235,0.12)] text-[var(--color-info)]";
    default:
      return "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text)]";
  }
}

function sizeClasses(size: ModalConfig["size"] = "md") {
  switch (size) {
    case "sm":
      return "max-w-md";
    case "lg":
      return "max-w-3xl";
    case "xl":
      return "max-w-5xl";
    default:
      return "max-w-2xl";
  }
}

interface DialogShellProps {
  instance: ModalInstance;
  onClose: () => void;
  onConfirm?: () => void | Promise<void>;
}

function DialogShell({ instance, onClose, onConfirm }: DialogShellProps) {
  const { config } = instance;
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const focusable = getFocusableElements(dialogRef.current);
    focusable[0]?.focus();

    return () => {
      previousFocusRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && config.dismissible !== false) {
        event.preventDefault();
        onClose();
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [config.dismissible, onClose]);

  const titleId = `modal-${instance.id}-title`;
  const descriptionId = config.description
    ? `modal-${instance.id}-description`
    : undefined;
  const widthClass = sizeClasses(config.size);

  if (config.kind === "drawer") {
    const drawerConfig = config as DrawerModalConfig;
    const sideClass = drawerConfig.side === "left" ? "left-0" : "right-0";

    return (
      <div
        className={`fixed inset-y-0 ${sideClass} z-[70] w-[min(100vw,420px)]`}
      >
        <Card
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={`flex h-full flex-col rounded-none border-y-0 ${drawerConfig.side === "left" ? "border-l-0 border-r" : "border-r-0 border-l"}`}
        >
          <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] p-5">
            <div>
              <h2
                id={titleId}
                className="text-lg font-semibold text-[var(--color-text)]"
              >
                {config.title}
              </h2>
              {config.description ? (
                <p
                  id={descriptionId}
                  className="mt-1 text-sm text-[var(--color-text-muted)]"
                >
                  {config.description}
                </p>
              ) : null}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              Cerrar
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">{config.body}</div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`w-full ${widthClass}`}>
      <Card
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="p-0"
      >
        <div className="border-b border-[var(--color-border)] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id={titleId}
                className="text-lg font-semibold text-[var(--color-text)]"
              >
                {config.title}
              </h2>
              {config.description ? (
                <p
                  id={descriptionId}
                  className="mt-1 text-sm text-[var(--color-text-muted)]"
                >
                  {config.description}
                </p>
              ) : null}
            </div>
            {config.dismissible !== false ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Cerrar modal"
              >
                Cerrar
              </Button>
            ) : null}
          </div>
        </div>

        <div className="space-y-5 p-5">
          {config.kind === "alert" ? (
            <div
              className={`rounded-[var(--radius-sm)] border px-3 py-2 text-sm ${toneClasses(config.tone)}`}
            >
              {config.body}
            </div>
          ) : null}

          {config.kind === "confirm" ? (
            <div className="space-y-4">
              <div
                className={`rounded-[var(--radius-sm)] border px-3 py-2 text-sm ${toneClasses(config.tone)}`}
              >
                {config.body}
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={onClose}>
                  {config.cancelLabel ?? "Cancelar"}
                </Button>
                <Button
                  variant="primary"
                  onClick={async () => {
                    await onConfirm?.();
                  }}
                >
                  {config.confirmLabel ?? "Confirmar"}
                </Button>
              </div>
            </div>
          ) : null}

          {config.kind === "form" ? (
            <form
              className="space-y-5"
              onSubmit={async (event) => {
                event.preventDefault();
                await config.onSubmit?.(event);
              }}
            >
              {config.body}
              <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] pt-4">
                {config.footer}
                <Button variant="outline" type="button" onClick={onClose}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  {config.submitLabel ?? "Guardar"}
                </Button>
              </div>
            </form>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

export interface ModalManagerProviderProps {
  children: ReactNode;
}

export function ModalManagerProvider({ children }: ModalManagerProviderProps) {
  const [stack, setStack] = useState<ModalInstance[]>([]);
  const resolverMap = useRef(new Map<string, (value: boolean) => void>());

  const closeModal = useCallback((id?: string) => {
    setStack((currentStack) => {
      if (!id) {
        return currentStack.slice(0, -1);
      }

      return currentStack.filter((instance) => instance.id !== id);
    });
  }, []);

  const openModal = useCallback((config: ModalConfig) => {
    const id = crypto.randomUUID();
    setStack((currentStack) => [...currentStack, { id, config }]);
    return id;
  }, []);

  const closeAllModals = useCallback(() => {
    setStack([]);
  }, []);

  const alert = useCallback<ModalManagerValue["alert"]>(
    (config) => openModal({ ...config, kind: "alert" }),
    [openModal],
  );

  const confirm = useCallback<ModalManagerValue["confirm"]>(
    (config) =>
      new Promise<boolean>((resolve) => {
        const id = crypto.randomUUID();
        resolverMap.current.set(id, resolve);
        setStack((currentStack) => [
          ...currentStack,
          { id, config: { ...config, kind: "confirm" } },
        ]);
      }),
    [],
  );

  const form = useCallback<ModalManagerValue["form"]>(
    (config) => openModal({ ...config, kind: "form" }),
    [openModal],
  );

  const drawer = useCallback<ModalManagerValue["drawer"]>(
    (config) => openModal({ ...config, kind: "drawer" }),
    [openModal],
  );

  const value = useMemo<ModalManagerValue>(
    () => ({
      stack,
      openModal,
      closeModal,
      closeAllModals,
      alert,
      confirm,
      form,
      drawer,
    }),
    [
      alert,
      closeAllModals,
      closeModal,
      confirm,
      drawer,
      form,
      openModal,
      stack,
    ],
  );

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.body.style.overflow = stack.length > 0 ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [stack.length]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      {typeof document !== "undefined" && stack.length > 0
        ? createPortal(
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(7,10,20,0.56)] p-4 backdrop-blur-sm">
              <div
                className="absolute inset-0"
                onClick={() => closeModal()}
                aria-hidden="true"
              />
              {stack.map((instance, index) => {
                const active = index === stack.length - 1;
                const onClose = () => {
                  closeModal(instance.id);
                  const resolver = resolverMap.current.get(instance.id);
                  if (resolver) {
                    resolver(false);
                    resolverMap.current.delete(instance.id);
                  }
                };

                const onConfirm = async () => {
                  const resolver = resolverMap.current.get(instance.id);
                  if (resolver) {
                    resolver(true);
                    resolverMap.current.delete(instance.id);
                  }

                  await (instance.config.kind === "confirm"
                    ? instance.config.onConfirm?.()
                    : Promise.resolve());
                  closeModal(instance.id);
                };

                return active ? (
                  <div
                    key={instance.id}
                    className="relative z-[71]"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <DialogShell
                      instance={instance}
                      onClose={onClose}
                      onConfirm={onConfirm}
                    />
                  </div>
                ) : null;
              })}
            </div>,
            document.body,
          )
        : null}
    </ModalContext.Provider>
  );
}

export { ModalContext };
