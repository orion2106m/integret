import type { ChangeEvent } from "react";
import type { FormFieldConfig } from "../../types/formConfig.types";

interface DynamicFieldProps {
  field: FormFieldConfig;
  value: string;
  disabled?: boolean;
  onChange: (fieldId: string, value: string) => void;
}

export function DynamicField({
  field,
  value,
  disabled,
  onChange,
}: DynamicFieldProps) {
  const isDisabled = disabled || !field.editable;
  const commonProps = {
    id: field.id,
    name: field.id,
    value,
    disabled: isDisabled,
    required: field.required,
    placeholder: field.placeholder,
    onChange: (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => onChange(field.id, event.target.value),
    className:
      "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 disabled:bg-slate-100",
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={field.id} className="text-sm font-medium text-slate-700">
        {field.label}
        {field.required ? " *" : ""}
      </label>

      {field.fieldType === "textarea" ? (
        <textarea rows={3} {...commonProps} />
      ) : null}

      {field.fieldType === "select" ? (
        <select {...commonProps}>
          <option value="">Seleccione una opcion</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}

      {field.fieldType !== "select" && field.fieldType !== "textarea" ? (
        <input
          type={
            field.fieldType === "number"
              ? "number"
              : field.fieldType === "date"
                ? "date"
                : "text"
          }
          {...commonProps}
        />
      ) : null}
    </div>
  );
}
