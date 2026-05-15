import DOMPurify from "dompurify";

const htmlConfig = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
};

export function sanitizeText(value: string) {
  return DOMPurify.sanitize(value, htmlConfig).trim();
}

export function sanitizeEmail(value: string) {
  return sanitizeText(value).toLowerCase();
}

export function sanitizeHtml(value: string) {
  return DOMPurify.sanitize(value, {
    USE_PROFILES: { html: true },
  });
}

export function sanitizeUnknown<T>(value: T): T {
  if (typeof value === "string") {
    return sanitizeText(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeUnknown(entry)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        sanitizeUnknown(entry),
      ]),
    ) as T;
  }

  return value;
}
