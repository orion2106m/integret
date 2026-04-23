export type EntityType = "client" | "supplier";
export type ClientType = "natural" | "company";

export type FieldType =
  | "text"
  | "email"
  | "phone"
  | "select"
  | "date"
  | "number"
  | "textarea";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FormFieldConfig {
  id: string;
  label: string;
  fieldType: FieldType;
  required: boolean;
  editable: boolean;
  baseField?: boolean;
  order: number;
  placeholder?: string;
  options?: FieldOption[];
  defaultValue?: string | number;
}

export interface FormSectionConfig {
  id: string;
  title: string;
  enabled: boolean;
  order: number;
  fields: FormFieldConfig[];
}

export interface FormConfig {
  tenantId: string;
  entityType: EntityType;
  clientType?: ClientType;
  sections: FormSectionConfig[];
  updatedAt: string;
}
