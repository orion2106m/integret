import type { FormConfig } from "../types/formConfig.types";

export const clientNaturalDefaultConfig: FormConfig = {
  tenantId: "default",
  entityType: "client",
  clientType: "natural",
  updatedAt: new Date(0).toISOString(),
  sections: [
    {
      id: "base-info",
      title: "Informacion basica",
      enabled: true,
      order: 1,
      fields: [
        {
          id: "fullName",
          label: "Nombre completo",
          fieldType: "text",
          required: true,
          editable: true,
          baseField: true,
          order: 1,
        },
        {
          id: "documentType",
          label: "Tipo de documento",
          fieldType: "select",
          required: true,
          editable: true,
          baseField: true,
          order: 2,
          options: [
            { label: "CC", value: "CC" },
            { label: "CE", value: "CE" },
            { label: "PP", value: "PP" },
            { label: "NIT", value: "NIT" },
          ],
        },
        {
          id: "documentNumber",
          label: "Numero de documento",
          fieldType: "text",
          required: true,
          editable: false,
          baseField: true,
          order: 3,
        },
        {
          id: "address",
          label: "Direccion",
          fieldType: "text",
          required: true,
          editable: true,
          baseField: true,
          order: 4,
        },
        {
          id: "phone",
          label: "Celular",
          fieldType: "phone",
          required: true,
          editable: true,
          baseField: true,
          order: 5,
        },
        {
          id: "email",
          label: "Correo electronico",
          fieldType: "email",
          required: true,
          editable: true,
          baseField: true,
          order: 6,
        },
      ],
    },
    {
      id: "custom-fields",
      title: "Campos personalizados",
      enabled: true,
      order: 2,
      fields: [],
    },
  ],
};

export const clientCompanyDefaultConfig: FormConfig = {
  ...clientNaturalDefaultConfig,
  clientType: "company",
  sections: [
    {
      ...clientNaturalDefaultConfig.sections[0],
      fields: clientNaturalDefaultConfig.sections[0].fields.map((field) =>
        field.id === "fullName"
          ? { ...field, label: "Razon social" }
          : field.id === "phone"
            ? { ...field, label: "Celular / Telefono" }
            : field,
      ),
    },
    ...clientNaturalDefaultConfig.sections.slice(1),
  ],
};
