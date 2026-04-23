import type {
  FormConfig,
  FormFieldConfig,
  FormSectionConfig,
} from "../types/formConfig.types";

function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

function mergeFields(
  baseFields: FormFieldConfig[],
  tenantFields: FormFieldConfig[],
): FormFieldConfig[] {
  const tenantFieldById = new Map(
    tenantFields.map((field) => [field.id, field]),
  );

  const merged = baseFields.map((field) => {
    const override = tenantFieldById.get(field.id);
    if (!override) return field;

    if (field.baseField) {
      return {
        ...field,
        ...override,
        required: true,
        baseField: true,
      };
    }

    return { ...field, ...override };
  });

  const baseFieldIds = new Set(baseFields.map((field) => field.id));
  const customTenantFields = tenantFields.filter(
    (field) => !baseFieldIds.has(field.id),
  );

  return sortByOrder([...merged, ...customTenantFields]);
}

export function mergeFormConfig(
  base: FormConfig,
  tenant?: FormConfig,
): FormConfig {
  if (!tenant) return base;

  const tenantSectionById = new Map(
    tenant.sections.map((section) => [section.id, section]),
  );

  const mergedSections: FormSectionConfig[] = base.sections.map(
    (baseSection) => {
      const tenantSection = tenantSectionById.get(baseSection.id);

      if (!tenantSection) return baseSection;

      return {
        ...baseSection,
        ...tenantSection,
        fields: mergeFields(baseSection.fields, tenantSection.fields),
      };
    },
  );

  const baseSectionIds = new Set(base.sections.map((section) => section.id));
  const tenantOnlySections = tenant.sections.filter(
    (section) => !baseSectionIds.has(section.id),
  );

  return {
    ...base,
    ...tenant,
    sections: sortByOrder([...mergedSections, ...tenantOnlySections]),
    updatedAt: new Date().toISOString(),
  };
}
