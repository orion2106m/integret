import type { FormSectionConfig } from "../../types/formConfig.types";
import { DynamicField } from "./DynamicField";

interface DynamicSectionProps {
  section: FormSectionConfig;
  values: Record<string, string>;
  disabled?: boolean;
  onChange: (fieldId: string, value: string) => void;
}

export function DynamicSection({
  section,
  values,
  disabled,
  onChange,
}: DynamicSectionProps) {
  if (!section.enabled) return null;

  return (
    <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-base font-semibold text-slate-800">
        {section.title}
      </h3>
      <div className="grid gap-3 md:grid-cols-2">
        {section.fields
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((field) => (
            <DynamicField
              key={field.id}
              field={field}
              value={values[field.id] ?? ""}
              disabled={disabled}
              onChange={onChange}
            />
          ))}
      </div>
    </section>
  );
}
