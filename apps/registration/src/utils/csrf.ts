/**
 * Utilidades para CSRF protection
 * Implementa double-submit cookie pattern y token validation
 * Cumple con OWASP A01:2021 (Broken Access Control)
 */

/**
 * Genera un token CSRF aleatorio
 */
export function generateCsrfToken(): string {
  // Generar 32 bytes aleatorios y convertir a hex
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);

  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Almacena token CSRF en sessionStorage (más seguro que localStorage para sesiones)
 */
export function storeCsrfToken(token: string): void {
  try {
    sessionStorage.setItem("csrf_token", token);
  } catch (e) {
    console.error("Error storing CSRF token", e);
  }
}

/**
 * Obtiene token CSRF del storage
 */
export function getCsrfToken(): string | null {
  try {
    return sessionStorage.getItem("csrf_token");
  } catch (e) {
    console.error("Error getting CSRF token", e);
    return null;
  }
}

/**
 * Valida si un token CSRF es válido
 */
export function validateCsrfToken(token: string | null): boolean {
  if (!token) return false;

  const stored = getCsrfToken();
  if (!stored) return false;

  // Comparación timing-safe para prevenir timing attacks
  return timingSafeCompare(token, stored);
}

/**
 * Comparación timing-safe para evitar timing attacks
 */
function timingSafeCompare(a: string, b: string): boolean {
  const bufferA = new TextEncoder().encode(a);
  const bufferB = new TextEncoder().encode(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < bufferA.length; i++) {
    result |= bufferA[i] ^ bufferB[i];
  }

  return result === 0;
}

/**
 * Hook para manejar CSRF en formularios
 */
export function useCsrfProtection() {
  // Generar o recuperar token al montar
  const getOrCreateToken = (): string => {
    let token = getCsrfToken();

    if (!token) {
      token = generateCsrfToken();
      storeCsrfToken(token);
    }

    return token;
  };

  const token = getOrCreateToken();

  /**
   * Incluir token en headers de request
   */
  const addCsrfToHeaders = (
    headers: Record<string, string>,
  ): Record<string, string> => {
    return {
      ...headers,
      "X-CSRF-Token": token,
    };
  };

  /**
   * Incluir token en FormData
   */
  const addCsrfToFormData = (formData: FormData): FormData => {
    formData.append("csrf_token", token);
    return formData;
  };

  /**
   * Incluir token en objeto JSON
   */
  const addCsrfToPayload = <T extends Record<string, any>>(
    payload: T,
  ): T & { csrf_token: string } => {
    return {
      ...payload,
      csrf_token: token,
    };
  };

  return {
    token,
    addCsrfToHeaders,
    addCsrfToFormData,
    addCsrfToPayload,
  };
}
