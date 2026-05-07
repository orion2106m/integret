/**
 * Tipos para el módulo de Registro
 * Gestión de clientes, perfiles y solicitudes con awareness de tenant
 */

export type RegistrationStatus =
  | "borrador"
  | "pendiente_revision"
  | "rechazado"
  | "aprobado"
  | "archivado";

export interface RegistrationRecord {
  id: string;
  tenant_id: string;

  // Datos del cliente
  documento: string;
  tipo_documento: "CC" | "NIT" | "CE" | "PA";
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;

  // Datos de la empresa
  empresa_nombre?: string;
  empresa_documento?: string;

  // Estado y auditoría
  estado: RegistrationStatus;
  motivo_rechazo?: string;
  observaciones?: string;

  // Metadatos
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface RegistrationFormData {
  documento: string;
  tipo_documento: "CC" | "NIT" | "CE" | "PA";
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  empresa_nombre?: string;
  empresa_documento?: string;
  observaciones?: string;
}

export interface RegistrationError {
  field: keyof RegistrationFormData;
  message: string;
}

export interface RegistrationValidationResult {
  valid: boolean;
  errors: RegistrationError[];
}

/**
 * Configuración de origen de datos para formularios
 */
export type DataSourceOrigin = "zenith-main-db" | "tenant-isolated-db";

export interface FormConfigResolution {
  origin: DataSourceOrigin;
  schema?: string;
  tableName: string;
}

/**
 * Estados restringidos que requieren motivación
 */
export const RESTRICTED_STATUSES: RegistrationStatus[] = [
  "rechazado",
  "archivado",
];

export function requiresMotive(status: RegistrationStatus): boolean {
  return RESTRICTED_STATUSES.includes(status);
}
