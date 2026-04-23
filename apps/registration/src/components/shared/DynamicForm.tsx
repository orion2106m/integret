import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import type { FormConfig } from "../../types/formConfig.types";
import { buildFormSchema } from "../../utils/buildFormSchema";
import { DynamicSection } from "./DynamicSection";

interface DynamicFormProps {
  config: FormConfig;
  initialValues?: Record<string, string>;
  submitLabel?: string;
  onSubmit: (values: Record<string, string>) => Promise<void> | void;
}

export function DynamicForm({
  config,
  initialValues,
  submitLabel = "Guardar",
  onSubmit,
}: DynamicFormProps) {
  const [values, setValues] = useState<Record<string, string>>(
    initialValues ?? {},
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const schema = useMemo(() => buildFormSchema(config), [config]);

  const handleChange = (fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => {
      if (!prev[fieldId]) return prev;
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = schema.safeParse(values);

    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldId = String(issue.path[0] ?? "");
        if (!fieldId) return;
        nextErrors[fieldId] = issue.message;
      });

      setErrors(nextErrors);
      return;
    }

    setSaving(true);
    try {
      await onSubmit(result.data as Record<string, string>);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      {config.sections
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <DynamicSection
            key={section.id}
            section={section}
            values={values}
            disabled={saving}
            onChange={handleChange}
          />
        ))}

      {Object.keys(errors).length > 0 ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p className="font-semibold">Hay errores de validacion:</p>
          <ul className="mt-1 list-disc pl-5">
            {Object.entries(errors).map(([fieldId, message]) => (
              <li key={fieldId}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
      >
        {saving ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
