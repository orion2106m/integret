import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRateLimit } from "../../hooks/useRateLimit";
import { validateRegistrationForm } from "../../schemas/registrationSchema";
import type {
  RegistrationFormData,
  RegistrationRecord,
} from "../../types/registration.types";
import { useCsrfProtection } from "../../utils/csrf";
import { fieldSanitizers, sanitizeFormData } from "../../utils/sanitizer";

interface RegistrationFormProps {
  initialData?: RegistrationRecord | null;
  isLoading?: boolean;
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  onCancel?: () => void;
  mode?: "create" | "edit";
}

const initialFormValues: RegistrationFormData = {
  documento: "",
  tipo_documento: "CC",
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  empresa_nombre: "",
  empresa_documento: "",
  observaciones: "",
};

// Mensajes de error seguros (no exponen información interna)
const SAFE_ERROR_MESSAGES: Record<string, string> = {
  INVALID_FORMAT: "Formato inválido. Verifique los datos ingresados.",
  INVALID_EMAIL: "El correo electrónico no es válido.",
  INVALID_PHONE: "El número de teléfono no es válido.",
  DOCUMENT_EXISTS: "Este documento ya existe en el sistema.",
  SERVER_ERROR: "Ocurrió un error. Por favor, intente más tarde.",
  RATE_LIMIT:
    "Demasiados intentos. Por favor, espere antes de intentar nuevamente.",
};

export default function RegistrationForm({
  initialData = null,
  isLoading = false,
  onSubmit,
  onCancel,
  mode = "create",
}: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    documento: initialData?.documento || "",
    tipo_documento: initialData?.tipo_documento || "CC",
    nombre: initialData?.nombre || "",
    apellido: initialData?.apellido || "",
    email: initialData?.email || "",
    telefono: initialData?.telefono || "",
    empresa_nombre: initialData?.empresa_nombre || "",
    empresa_documento: initialData?.empresa_documento || "",
    observaciones: initialData?.observaciones || "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Rate limiting: máximo 5 intentos por minuto
  const rateLimiter = useRateLimit({ maxAttempts: 5, windowMs: 60000 });

  // CSRF Protection
  const { token: csrfToken } = useCsrfProtection();

  const inputBaseClass =
    "mt-2 block w-full rounded-xl border bg-[var(--color-surface-2)] px-4 py-3 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-violet)] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)] focus:bg-[var(--color-surface)]";

  /**
   * Sanitiza y valida un campo individual en tiempo real
   */
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Sanitizar el valor según el tipo de campo
    let sanitizedValue = value;
    if (name in fieldSanitizers && name !== "tipo_documento") {
      const sanitizer = fieldSanitizers[name as keyof typeof fieldSanitizers];
      if (name === "documento") {
        sanitizedValue = sanitizer(value, formData.tipo_documento);
      } else {
        sanitizedValue = (sanitizer as Function)(value);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Limpiar errores del campo cuando el usuario comienza a escribir
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[name];
        return nextErrors;
      });
    }
  };

  /**
   * Submit con sanitización, validación y protecciones de seguridad
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});

    // Verificar rate limiting
    if (!rateLimiter.canAttempt()) {
      setSubmitError(rateLimiter.error);
      return;
    }

    // Sanitizar todos los datos del formulario
    const sanitizedData = sanitizeFormData(formData, formData.tipo_documento);

    // Validar datos sanitizados
    const validation = validateRegistrationForm(sanitizedData);
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      rateLimiter.recordAttempt();
      return;
    }

    try {
      // Registrar intento de envío
      rateLimiter.recordAttempt();

      // Enviar datos sanitizados al servidor
      await onSubmit(sanitizedData as unknown as RegistrationFormData);

      // Si fue exitoso, limpiar formulario y resetear rate limiter
      rateLimiter.reset();
      setFormData(initialFormValues);
      setFieldErrors({});
    } catch (error) {
      // Manejar errores de forma segura sin exponer detalles internos
      let message = SAFE_ERROR_MESSAGES.SERVER_ERROR;

      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();

        // Mapear errores específicos conocidos
        if (errorMessage.includes("already exists")) {
          message = SAFE_ERROR_MESSAGES.DOCUMENT_EXISTS;
        } else if (errorMessage.includes("invalid")) {
          message = SAFE_ERROR_MESSAGES.INVALID_FORMAT;
        }

        // Log para debugging (solo en desarrollo)
        if (typeof window !== "undefined" && (window as any).__DEV__) {
          console.error("Form submission error:", error);
        }
      }

      setSubmitError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 anim-fade-up">
      {/* Security Info Banner */}
      <div className="rounded-xl border border-[var(--color-accent-cyan)]/30 bg-[rgba(6,182,212,0.08)] p-4">
        <div className="flex items-start gap-3">
          <svg
            className="h-5 w-5 text-[var(--color-accent-cyan)] flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <p className="text-xs text-[var(--color-text-muted)]">
            Todos tus datos se validan y sanitizan de forma segura según
            estándares OWASP y NIST.
          </p>
        </div>
      </div>

      {/* Rate Limit Warning */}
      {rateLimiter.isLocked && (
        <div className="rounded-xl border border-[var(--color-warning)]/50 bg-[rgba(249,115,22,0.1)] p-4 anim-shake">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-[var(--color-warning)] flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">
                Demasiados intentos
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Por favor, espera {rateLimiter.remainingTime}s antes de intentar
                de nuevo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Personal Data Section */}
      <section className="space-y-6 rounded-2xl border border-[var(--color-border)] bg-[linear-gradient(145deg,rgba(99,102,241,0.08),transparent)] p-8 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#6366f1,#8b5cf6)]">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text)]">
              Información Personal
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Datos del solicitante
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="tipo_documento"
              className="block text-sm font-semibold text-[var(--color-text)]"
            >
              Tipo de Documento{" "}
              <span className="text-[var(--color-danger)]">*</span>
            </label>
            <select
              id="tipo_documento"
              name="tipo_documento"
              value={formData.tipo_documento}
              onChange={handleInputChange}
              disabled={mode === "edit"}
              className={`${inputBaseClass} border-[var(--color-border)] disabled:opacity-50`}
              aria-invalid={!!fieldErrors.tipo_documento}
              aria-describedby={
                fieldErrors.tipo_documento ? "error-tipo_documento" : undefined
              }
            >
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="NIT">NIT</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="PA">Pasaporte</option>
            </select>
            {fieldErrors.tipo_documento && (
              <p
                id="error-tipo_documento"
                className="mt-2 text-xs font-semibold text-[var(--color-danger)]"
              >
                {fieldErrors.tipo_documento}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="documento"
              className="block text-sm font-semibold text-[var(--color-text)]"
            >
              Número de Documento{" "}
              <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="text"
              id="documento"
              name="documento"
              value={formData.documento}
              onChange={handleInputChange}
              disabled={mode === "edit"}
              maxLength={20}
              className={`${inputBaseClass} disabled:opacity-50 ${
                fieldErrors.documento
                  ? "border-[var(--color-danger)] bg-[rgba(239,68,68,0.05)]"
                  : "border-[var(--color-border)]"
              }`}
              placeholder="1023456789"
              aria-invalid={!!fieldErrors.documento}
              aria-describedby={
                fieldErrors.documento ? "error-documento" : undefined
              }
              autoComplete="off"
              spellCheck="false"
            />
            {fieldErrors.documento && (
              <p
                id="error-documento"
                className="mt-2 text-xs font-semibold text-[var(--color-danger)]"
              >
                {fieldErrors.documento}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-semibold text-[var(--color-text)]"
            >
              Nombre <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              maxLength={100}
              className={`${inputBaseClass} ${
                fieldErrors.nombre
                  ? "border-[var(--color-danger)] bg-[rgba(239,68,68,0.05)]"
                  : "border-[var(--color-border)]"
              }`}
              placeholder="Juan"
              aria-invalid={!!fieldErrors.nombre}
              aria-describedby={fieldErrors.nombre ? "error-nombre" : undefined}
              autoComplete="given-name"
              spellCheck="true"
            />
            {fieldErrors.nombre && (
              <p
                id="error-nombre"
                className="mt-2 text-xs font-semibold text-[var(--color-danger)]"
              >
                {fieldErrors.nombre}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="apellido"
              className="block text-sm font-semibold text-[var(--color-text)]"
            >
              Apellido <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              maxLength={100}
              className={`${inputBaseClass} ${
                fieldErrors.apellido
                  ? "border-[var(--color-danger)] bg-[rgba(239,68,68,0.05)]"
                  : "border-[var(--color-border)]"
              }`}
              placeholder="Pérez"
              aria-invalid={!!fieldErrors.apellido}
              aria-describedby={
                fieldErrors.apellido ? "error-apellido" : undefined
              }
              autoComplete="family-name"
              spellCheck="true"
            />
            {fieldErrors.apellido && (
              <p
                id="error-apellido"
                className="mt-2 text-xs font-semibold text-[var(--color-danger)]"
              >
                {fieldErrors.apellido}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[var(--color-text)]"
            >
              Correo Electrónico{" "}
              <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              maxLength={254}
              className={`${inputBaseClass} ${
                fieldErrors.email
                  ? "border-[var(--color-danger)] bg-[rgba(239,68,68,0.05)]"
                  : "border-[var(--color-border)]"
              }`}
              placeholder="juan@ejemplo.com"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "error-email" : undefined}
              autoComplete="email"
              spellCheck="false"
            />
            {fieldErrors.email && (
              <p
                id="error-email"
                className="mt-2 text-xs font-semibold text-[var(--color-danger)]"
              >
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="telefono"
              className="block text-sm font-semibold text-[var(--color-text)]"
            >
              Teléfono <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              maxLength={20}
              className={`${inputBaseClass} ${
                fieldErrors.telefono
                  ? "border-[var(--color-danger)] bg-[rgba(239,68,68,0.05)]"
                  : "border-[var(--color-border)]"
              }`}
              placeholder="+57 (300) 123-4567"
              aria-invalid={!!fieldErrors.telefono}
              aria-describedby={
                fieldErrors.telefono ? "error-telefono" : undefined
              }
              autoComplete="tel"
              spellCheck="false"
            />
            {fieldErrors.telefono && (
              <p
                id="error-telefono"
                className="mt-2 text-xs font-semibold text-[var(--color-danger)]"
              >
                {fieldErrors.telefono}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Business Data Section */}
      <section className="space-y-6 rounded-2xl border border-[var(--color-border)] bg-[linear-gradient(145deg,rgba(6,182,212,0.06),transparent)] p-8 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#06b6d4,#0ea5e9)]">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text)]">
              Información Empresarial
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Datos opcionales de la empresa
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="empresa_nombre"
              className="block text-sm font-semibold text-[var(--color-text)]"
            >
              Nombre de la Empresa
            </label>
            <input
              type="text"
              id="empresa_nombre"
              name="empresa_nombre"
              value={formData.empresa_nombre}
              onChange={handleInputChange}
              maxLength={100}
              className={`${inputBaseClass} border-[var(--color-border)]`}
              placeholder="Acme Corporation"
              autoComplete="organization"
              spellCheck="false"
            />
          </div>

          <div>
            <label
              htmlFor="empresa_documento"
              className="block text-sm font-semibold text-[var(--color-text)]"
            >
              NIT de la Empresa
            </label>
            <input
              type="text"
              id="empresa_documento"
              name="empresa_documento"
              value={formData.empresa_documento}
              onChange={handleInputChange}
              maxLength={20}
              className={`${inputBaseClass} border-[var(--color-border)]`}
              placeholder="890.123.456-7"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>
      </section>

      {/* Notes Section */}
      <section className="space-y-6 rounded-2xl border border-[var(--color-border)] bg-[linear-gradient(145deg,rgba(139,92,246,0.06),transparent)] p-8 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#8b5cf6,#a855f7)]">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text)]">
              Notas y Observaciones
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Información adicional relevante
            </p>
          </div>
        </div>
        <div>
          <label
            htmlFor="observaciones"
            className="block text-sm font-semibold text-[var(--color-text)]"
          >
            Observaciones
          </label>
          <textarea
            id="observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleInputChange}
            maxLength={500}
            rows={4}
            className={`${inputBaseClass} border-[var(--color-border)] resize-none`}
            placeholder="Información adicional sobre el solicitante..."
            spellCheck="true"
          />
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {(formData.observaciones || "").length}/500 caracteres
          </p>
        </div>
      </section>

      {/* Error Alert */}
      {submitError && (
        <div
          className="rounded-xl border border-[var(--color-danger)] bg-[rgba(239,68,68,0.1)] p-4 anim-fade-up"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-[var(--color-danger)] flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-semibold text-[var(--color-danger)]">
              {submitError}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-4 border-t border-[var(--color-border)] pt-8">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading || rateLimiter.isLocked}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-6 py-3 text-sm font-semibold text-[var(--color-text)] transition-all duration-200 hover:border-[var(--color-accent-violet)] hover:bg-[var(--color-surface)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || rateLimiter.isLocked}
          className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#6366f1,#8b5cf6)] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(99,102,241,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isLoading && (
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
          )}
          {isLoading
            ? "Guardando..."
            : rateLimiter.isLocked
              ? `Espera ${rateLimiter.remainingTime}s`
              : mode === "create"
                ? "Crear Registro"
                : "Actualizar Registro"}
        </button>
      </div>

      {/* CSRF Token (hidden) */}
      <input type="hidden" name="csrf_token" value={csrfToken} />
    </form>
  );
}
