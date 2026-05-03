/**
 * Hook para manejar focus trap en modales
 * Sigue estándares WAI-ARIA y best practices de accesibilidad
 */

import { useEffect, useRef } from "react";

/**
 * Enfoca el siguiente elemento con rol/atributo tabulable dentro de un contenedor
 */
function getNextFocusableElement(
  container: HTMLElement,
  currentElement: Element,
  reverse: boolean = false,
): HTMLElement | null {
  const focusableElements = Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ) as HTMLElement[];

  if (focusableElements.length === 0) return null;

  const currentIndex = focusableElements.indexOf(currentElement as HTMLElement);

  if (reverse) {
    if (currentIndex <= 0)
      return focusableElements[focusableElements.length - 1];
    return focusableElements[currentIndex - 1];
  } else {
    if (currentIndex >= focusableElements.length - 1)
      return focusableElements[0];
    return focusableElements[currentIndex + 1];
  }
}

/**
 * Hook para trap focus dentro de un modal
 * Previene que el usuario tabule fuera del modal
 */
export function useFocusTrap(isOpen: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    // Guardar elemento activo anterior
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    // Enfocar primer elemento focusable
    const firstFocusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) as HTMLElement;

    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Manejar Tab
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const activeElement = document.activeElement;
      if (!container.contains(activeElement as Node)) return;

      const nextFocusable = getNextFocusableElement(
        container,
        activeElement as Element,
        e.shiftKey,
      );

      if (nextFocusable) {
        e.preventDefault();
        nextFocusable.focus();
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      // Restaurar focus al elemento anterior
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isOpen]);

  return containerRef;
}
