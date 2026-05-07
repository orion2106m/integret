import * as z from "zod";

/**
 * Schema de validación para formulario de registro
 * Usa Zod para validación fuerte en tiempo de compilación y runtime
 */

export const DocumentTypeSchema = z.enum(["CC", "NIT", "CE", "PA"]);

export const RegistrationFormSchema = z.object({
  documento: z
    .string()
    .min(1, "El documento es requerido")
    .min(6, "El documento debe tener al menos 6 caracteres")
    .max(20, "El documento no puede exceder 20 caracteres"),
  tipo_documento: DocumentTypeSchema,
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  apellido: z
    .string()
    .min(1, "El apellido es requerido")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido no puede exceder 100 caracteres"),
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  telefono: z
    .string()
    .min(1, "El teléfono es requerido")
    .regex(/^\+?[\d\s\-\(\)]{7,20}$/, "Teléfono inválido"),
  empresa_nombre: z
    .string()
    .max(100, "El nombre de la empresa no puede exceder 100 caracteres")
    .optional(),
  empresa_documento: z
    .string()
    .max(20, "El documento de la empresa no puede exceder 20 caracteres")
    .optional(),
  observaciones: z
    .string()
    .max(500, "Las observaciones no pueden exceder 500 caracteres")
    .optional(),
});

export const RegistrationStatusSchema = z.enum([
  "borrador",
  "pendiente_revision",
  "rechazado",
  "aprobado",
  "archivado",
]);

export const RegistrationUpdateSchema = RegistrationFormSchema.partial().extend(
  {
    estado: RegistrationStatusSchema.optional(),
    motivo_rechazo: z
      .string()
      .min(1, "El motivo es requerido")
      .max(500, "El motivo no puede exceder 500 caracteres")
      .optional(),
  },
);

/**
 * Valida datos del formulario de registro
 */
export function validateRegistrationForm(data: unknown): {
  valid: boolean;
  errors: Record<string, string>;
} {
  try {
    RegistrationFormSchema.parse(data);
    return { valid: true, errors: {} };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      }
      return { valid: false, errors };
    }
    return {
      valid: false,
      errors: { form: "Error de validación desconocido" },
    };
  }
}

/**
 * Valida actualización de registro
 */
export function validateRegistrationUpdate(data: unknown): {
  valid: boolean;
  errors: Record<string, string>;
} {
  try {
    RegistrationUpdateSchema.parse(data);
    return { valid: true, errors: {} };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      }
      return { valid: false, errors };
    }
    return {
      valid: false,
      errors: { form: "Error de validación desconocido" },
    };
  }
}

export type RegistrationFormType = z.infer<typeof RegistrationFormSchema>;
export type RegistrationUpdateType = z.infer<typeof RegistrationUpdateSchema>;
