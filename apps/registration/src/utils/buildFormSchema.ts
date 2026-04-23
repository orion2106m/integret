import { z } from "zod";
import type { FormConfig, FormFieldConfig } from "../types/formConfig.types";

function buildFieldSchema(field: FormFieldConfig): z.ZodTypeAny {
  const requiredMessage = `${field.label} es obligatorio`;

  switch (field.fieldType) {
    case "email": {
      const emailSchema = z
        .string({ required_error: requiredMessage })
        .trim()
        .email("Formato de correo invalido");

      return field.required
        ? emailSchema
        : emailSchema.optional().or(z.literal(""));
    }
    case "phone": {
      const phoneSchema = z
        .string({ required_error: requiredMessage })
        .trim()
        .regex(/^[+]?\d{7,15}$/, "Formato de celular/telefono invalido");

      return field.required
        ? phoneSchema
        : phoneSchema.optional().or(z.literal(""));
    }
    case "number": {
      const numberSchema = z.coerce.number({ required_error: requiredMessage });
      return field.required ? numberSchema : numberSchema.optional();
    }
    case "date": {
      const dateSchema = z
        .string({ required_error: requiredMessage })
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha invalido (YYYY-MM-DD)");
      return field.required
        ? dateSchema
        : dateSchema.optional().or(z.literal(""));
    }
    default: {
      const textSchema = z.string({ required_error: requiredMessage }).trim();
      return field.required
        ? textSchema.min(1, requiredMessage)
        : textSchema.optional().or(z.literal(""));
    }
  }
}

export function buildFormSchema(
  config: FormConfig,
): z.ZodObject<z.ZodRawShape> {
  const shape: z.ZodRawShape = {};

  config.sections
    .filter((section) => section.enabled)
    .flatMap((section) => section.fields)
    .forEach((field) => {
      shape[field.id] = buildFieldSchema(field);
    });

  return z.object(shape);
}
