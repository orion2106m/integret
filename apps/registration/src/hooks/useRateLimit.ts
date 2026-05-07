/**
 * Hook para rate limiting en cliente
 * Previene spam y abuso de formularios
 * Cumple con NIST SP 800-63B-3 (rate limiting recommendations)
 */

import { useCallback, useRef, useState } from "react";

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // ventana de tiempo en ms
  message?: string;
}

interface RateLimitState {
  attempts: number;
  lastAttemptTime: number;
  isLocked: boolean;
  lockUntil: number;
}

/**
 * Hook para rate limiting con backoff exponencial
 */
export function useRateLimit(config: RateLimitConfig) {
  const {
    maxAttempts = 5,
    windowMs = 60000, // 1 minuto por defecto
    message = "Demasiados intentos. Por favor, intente más tarde.",
  } = config;

  const stateRef = useRef<RateLimitState>({
    attempts: 0,
    lastAttemptTime: 0,
    isLocked: false,
    lockUntil: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  /**
   * Verifica si se puede hacer un intento
   */
  const canAttempt = useCallback((): boolean => {
    const state = stateRef.current;
    const now = Date.now();

    // Si está locked, verificar si expiró
    if (state.isLocked && now < state.lockUntil) {
      setIsLocked(true);
      const remaining = Math.ceil((state.lockUntil - now) / 1000);
      setRemainingTime(remaining);
      setError(`${message} Reintentar en ${remaining}s`);
      return false;
    }

    // Limpiar estado si pasó la ventana de tiempo
    if (now - state.lastAttemptTime > windowMs) {
      state.attempts = 0;
      state.isLocked = false;
      setIsLocked(false);
      setError(null);
    }

    return true;
  }, [maxAttempts, windowMs, message]);

  /**
   * Registra un intento
   */
  const recordAttempt = useCallback((): void => {
    const state = stateRef.current;
    const now = Date.now();

    state.attempts++;
    state.lastAttemptTime = now;

    if (state.attempts >= maxAttempts) {
      // Calcular lockout time con backoff exponencial
      const backoffMultiplier = Math.pow(
        2,
        Math.floor(state.attempts / maxAttempts) - 1,
      );
      const lockoutTime = windowMs * backoffMultiplier;

      state.isLocked = true;
      state.lockUntil = now + lockoutTime;
      setIsLocked(true);
      setRemainingTime(Math.ceil(lockoutTime / 1000));
      setError(`${message} Reintentar en ${Math.ceil(lockoutTime / 1000)}s`);
    }
  }, [maxAttempts, windowMs, message]);

  /**
   * Resetea el contador (después de éxito)
   */
  const reset = useCallback((): void => {
    stateRef.current = {
      attempts: 0,
      lastAttemptTime: 0,
      isLocked: false,
      lockUntil: 0,
    };
    setIsLocked(false);
    setError(null);
    setRemainingTime(0);
  }, []);

  return {
    canAttempt,
    recordAttempt,
    reset,
    isLocked,
    error,
    remainingTime,
    attempts: stateRef.current.attempts,
  };
}

/**
 * Hook para debouncing de acciones
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [isWaiting, setIsWaiting] = useState(false);

  const debouncedCallback = useCallback(
    ((...args: any[]) => {
      setIsWaiting(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
        setIsWaiting(false);
      }, delay);
    }) as T,
    [callback, delay],
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsWaiting(false);
  }, []);

  return {
    debouncedCallback,
    cancel,
    isWaiting,
  };
}
