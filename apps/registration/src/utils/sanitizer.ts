/**
 * Utilidades de sanitización siguiendo estándares OWASP
 * Previene XSS, inyección HTML, y otros ataques de entrada
 */

/**
 * Sanitiza HTML eliminando scripts y elementos peligrosos
 * Cumple con OWASP A03:2021 (Injection)
 */
export function sanitizeHtml(dirty: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return dirty.replace(/[&<>"'\/]/g, (char) => map[char]);
}

/**
 * Sanitiza texto removiendo caracteres peligrosos pero manteniendo espacios
 * Previene XSS y manipulación de atributos
 */
export function sanitizeText(
  input: string,
  options: {
    maxLength?: number;
    allowSpaces?: boolean;
    allowSpecialChars?: boolean;
  } = {},
): string {
  const {
    maxLength = 200,
    allowSpaces = true,
    allowSpecialChars = false,
  } = options;

  let sanitized = input.trim();

  // Limitar longitud
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Remover caracteres de control
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, "");

  // Según configuración, permitir o remover caracteres especiales
  if (!allowSpecialChars) {
    // Permitir solo alfanuméricos, espacios, y guiones/puntos básicos
    sanitized = sanitized.replace(
      /[^a-zA-Z0-9áéíóúàèìòùäëïöüñÁÉÍÓÚÀÈÌÒÙÄËÏÖÜÑ\s\-\.]/g,
      "",
    );
  }

  // Remover espacios múltiples
  if (allowSpaces) {
    sanitized = sanitized.replace(/\s+/g, " ");
  }

  return sanitized;
}

/**
 * Sanitiza email según RFC 5321 y OWASP
 */
export function sanitizeEmail(email: string): string {
  // Remover espacios
  let sanitized = email.trim().toLowerCase();

  // Validar formato básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return "";
  }

  // Limitar longitud según RFC 5321
  if (sanitized.length > 254) {
    return "";
  }

  // Sanitizar caracteres especiales
  sanitized = sanitizeHtml(sanitized);

  return sanitized;
}

/**
 * Sanitiza números de documento (cédula, pasaporte, etc.)
 * Permite solo números y algunos caracteres específicos según tipo
 */
export function sanitizeDocumentNumber(
  document: string,
  type: "CC" | "NIT" | "CE" | "PA" = "CC",
): string {
  let sanitized = document.trim().toUpperCase();

  // Remover espacios
  sanitized = sanitized.replace(/\s/g, "");

  // Según tipo de documento
  switch (type) {
    case "CC":
    case "CE":
      // Solo números
      sanitized = sanitized.replace(/[^0-9]/g, "");
      break;
    case "NIT":
      // Números y guion
      sanitized = sanitized.replace(/[^0-9\-]/g, "");
      break;
    case "PA":
      // Alfanuméricos
      sanitized = sanitized.replace(/[^A-Z0-9]/g, "");
      break;
  }

  // Limitar longitud según tipo
  const maxLengths: Record<string, number> = {
    CC: 15,
    NIT: 20,
    CE: 15,
    PA: 20,
  };

  const maxLength = maxLengths[type] || 20;
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitiza número de teléfono
 * Permite números, espacios, guiones, paréntesis y +
 */
export function sanitizePhoneNumber(phone: string): string {
  let sanitized = phone.trim();

  // Remover caracteres no válidos para teléfono
  sanitized = sanitized.replace(/[^+\d\s\-()]/g, "");

  // Limitar longitud
  if (sanitized.length > 20) {
    sanitized = sanitized.substring(0, 20);
  }

  return sanitized;
}

/**
 * Sanitiza nombre de empresa
 */
export function sanitizeCompanyName(name: string): string {
  return sanitizeText(name, {
    maxLength: 100,
    allowSpaces: true,
    allowSpecialChars: true, // Permite guiones, puntos
  }).replace(/[^a-zA-Z0-9áéíóúàèìòùäëïöüñÁÉÍÓÚÀÈÌÒÙÄËÏÖÜÑ\s\-\.()&]/g, "");
}

/**
 * Sanitiza texto de observaciones
 */
export function sanitizeObservations(text: string): string {
  return sanitizeText(text, {
    maxLength: 500,
    allowSpaces: true,
    allowSpecialChars: false,
  });
}

/**
 * Objeto sanitizador para todos los campos del formulario
 */
export const fieldSanitizers = {
  nombre: (value: string) =>
    sanitizeText(value, { maxLength: 100, allowSpaces: true }),
  apellido: (value: string) =>
    sanitizeText(value, { maxLength: 100, allowSpaces: true }),
  documento: (value: string, type: string) =>
    sanitizeDocumentNumber(value, (type as "CC" | "NIT" | "CE" | "PA") || "CC"),
  email: (value: string) => sanitizeEmail(value),
  telefono: (value: string) => sanitizePhoneNumber(value),
  empresa_nombre: (value: string) => sanitizeCompanyName(value),
  empresa_documento: (value: string) => sanitizeDocumentNumber(value, "NIT"),
  observaciones: (value: string) => sanitizeObservations(value),
} as const;

/**
 * Sanitiza un objeto completo de formulario
 */
export function sanitizeFormData(
  data: Record<string, any>,
  tipo_documento: string = "CC",
): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      sanitized[key] = "";
      continue;
    }

    const stringValue = String(value).trim();

    // Usar sanitizer específico si existe
    if (key in fieldSanitizers && key !== "documento") {
      sanitized[key] = (
        fieldSanitizers[key as keyof typeof fieldSanitizers] as Function
      )(stringValue);
    } else if (key === "documento") {
      sanitized[key] = sanitizeDocumentNumber(
        stringValue,
        tipo_documento as any,
      );
    } else {
      // Fallback: sanitización básica
      sanitized[key] = sanitizeHtml(stringValue);
    }
  }

  return sanitized;
}
