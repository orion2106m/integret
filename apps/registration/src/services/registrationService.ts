import {
  getSupabaseErrorMessage,
  supabase,
} from "../utils/supabase";
import type {
  FormConfigResolution,
  RegistrationFormData,
  RegistrationRecord,
  RegistrationStatus,
} from "../types/registration.types";

const REGISTRATION_TABLE = "registrations";
const registrationMockDbByTenant = new Map<string, RegistrationRecord[]>();

function ensureTenantCollection(tenantId: string): RegistrationRecord[] {
  const existing = registrationMockDbByTenant.get(tenantId);
  if (existing) return existing;

  const initialized: RegistrationRecord[] = [];
  registrationMockDbByTenant.set(tenantId, initialized);
  return initialized;
}

function nowIso(): string {
  return new Date().toISOString();
}

function usesMockMode(): boolean {
  return !supabase;
}

function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      "Supabase no esta configurado. Configure variables VITE_SUPABASE_*",
    );
  }

  return supabase;
}

/**
 * Service para gestionar registros con awareness de tenant
 * Implementa reglas de negocio:
 * - Unicidad de documento por tenant
 * - Documento no editable en actualización
 * - Motivación obligatoria para estados restringidos
 */
export const registrationService = {
  /**
   * Obtiene la configuración del origen de datos para un tenant
   * client company => tenant-isolated-db
   * resto => zenith-main-db
   */
  resolveFormConfig(tenantId: string): FormConfigResolution {
    const isClientCompany = tenantId.startsWith("client-");

    return {
      origin: isClientCompany ? "tenant-isolated-db" : "zenith-main-db",
      tableName: REGISTRATION_TABLE,
      schema: isClientCompany ? `tenant_${tenantId}` : "public",
    };
  },

  /**
   * Crea un nuevo registro de cliente
   */
  async createRegistration(
    tenantId: string,
    data: RegistrationFormData,
    userId: string,
  ): Promise<RegistrationRecord> {
    if (usesMockMode()) {
      const tenantData = ensureTenantCollection(tenantId);
      const duplicate = tenantData.find(
        (item) => item.documento === data.documento,
      );
      if (duplicate) {
        throw new Error(
          `El documento ${data.documento} ya está registrado en este tenant`,
        );
      }

      const now = nowIso();
      const created: RegistrationRecord = {
        id: crypto.randomUUID(),
        tenant_id: tenantId,
        ...data,
        estado: "borrador",
        created_at: now,
        updated_at: now,
        created_by: userId,
        updated_by: userId,
      };

      tenantData.unshift(created);
      return created;
    }

    const client = getSupabaseClient();

    // Verificar unicidad de documento por tenant
    const { data: existing, error: queryError } = await client
      .from(REGISTRATION_TABLE)
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("documento", data.documento)
      .maybeSingle();

    if (queryError) {
      throw new Error(
        `Error checking document uniqueness: ${getSupabaseErrorMessage(queryError)}`,
      );
    }

    if (existing) {
      throw new Error(
        `El documento ${data.documento} ya está registrado en este tenant`,
      );
    }

    // Crear registro
    const now = new Date().toISOString();
    const { data: created, error: createError } = await client
      .from(REGISTRATION_TABLE)
      .insert({
        tenant_id: tenantId,
        ...data,
        estado: "borrador",
        created_at: now,
        updated_at: now,
        created_by: userId,
        updated_by: userId,
      })
      .select()
      .single();

    if (createError) {
      throw new Error(
        `Error creating registration: ${getSupabaseErrorMessage(createError)}`,
      );
    }

    return created as RegistrationRecord;
  },

  /**
   * Obtiene un registro específico
   */
  async getRegistration(
    tenantId: string,
    recordId: string,
  ): Promise<RegistrationRecord | null> {
    if (usesMockMode()) {
      const tenantData = ensureTenantCollection(tenantId);
      return tenantData.find((item) => item.id === recordId) ?? null;
    }

    const client = getSupabaseClient();

    const { data, error } = await client
      .from(REGISTRATION_TABLE)
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("id", recordId)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Error fetching registration: ${getSupabaseErrorMessage(error)}`,
      );
    }

    return data as RegistrationRecord | null;
  },

  /**
   * Obtiene todos los registros de un tenant
   */
  async listRegistrationsByTenant(
    tenantId: string,
    filters?: {
      estado?: RegistrationStatus;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ data: RegistrationRecord[]; count: number }> {
    if (usesMockMode()) {
      const tenantData = ensureTenantCollection(tenantId);
      let data = [...tenantData];

      if (filters?.estado) {
        data = data.filter((item) => item.estado === filters.estado);
      }

      const total = data.length;
      const offset = filters?.offset ?? 0;
      const limit = filters?.limit ?? total;
      data = data.slice(offset, offset + limit);

      return { data, count: total };
    }

    const client = getSupabaseClient();

    let query = client
      .from(REGISTRATION_TABLE)
      .select("*", { count: "exact" })
      .eq("tenant_id", tenantId);

    if (filters?.estado) {
      query = query.eq("estado", filters.estado);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1,
      );
    }

    query = query.order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw new Error(
        `Error listing registrations: ${getSupabaseErrorMessage(error)}`,
      );
    }

    return {
      data: (data || []) as RegistrationRecord[],
      count: count || 0,
    };
  },

  /**
   * Actualiza un registro
   * Restricciones:
   * - El documento no puede ser editado
   * - Si el nuevo estado es restringido, se requiere motivo
   */
  async updateRegistration(
    tenantId: string,
    recordId: string,
    updates: Partial<RegistrationFormData> & {
      estado?: RegistrationStatus;
      motivo_rechazo?: string;
    },
    userId: string,
  ): Promise<RegistrationRecord> {
    if (usesMockMode()) {
      const tenantData = ensureTenantCollection(tenantId);
      const index = tenantData.findIndex((item) => item.id === recordId);
      if (index < 0) {
        throw new Error("Registration not found");
      }

      const current = tenantData[index];
      if (updates.documento && updates.documento !== current.documento) {
        throw new Error("El documento no puede ser modificado");
      }

      if (
        (updates.estado === "rechazado" || updates.estado === "archivado") &&
        !updates.motivo_rechazo
      ) {
        throw new Error(
          `Se requiere un motivo para cambiar el estado a ${updates.estado}`,
        );
      }

      const updated: RegistrationRecord = {
        ...current,
        ...updates,
        documento: current.documento,
        updated_at: nowIso(),
        updated_by: userId,
      };

      tenantData[index] = updated;
      return updated;
    }

    // Obtener registro actual
    const current = await this.getRegistration(tenantId, recordId);
    if (!current) {
      throw new Error("Registration not found");
    }

    // Validar que el documento no se cambie
    if (updates.documento && updates.documento !== current.documento) {
      throw new Error("El documento no puede ser modificado");
    }

    // Validar motivo para estados restringidos
    if (updates.estado === "rechazado" || updates.estado === "archivado") {
      if (!updates.motivo_rechazo) {
        throw new Error(
          `Se requiere un motivo para cambiar el estado a ${updates.estado}`,
        );
      }
    }

    // Actualizar
    const now = new Date().toISOString();
    const client = getSupabaseClient();

    const { data: updated, error: updateError } = await client
      .from(REGISTRATION_TABLE)
      .update({
        ...updates,
        updated_at: now,
        updated_by: userId,
      })
      .eq("tenant_id", tenantId)
      .eq("id", recordId)
      .select()
      .single();

    if (updateError) {
      throw new Error(
        `Error updating registration: ${getSupabaseErrorMessage(updateError)}`,
      );
    }

    return updated as RegistrationRecord;
  },

  /**
   * Cambia el estado de un registro
   */
  async changeStatus(
    tenantId: string,
    recordId: string,
    newStatus: RegistrationStatus,
    motivo?: string,
    userId?: string,
  ): Promise<RegistrationRecord> {
    const updates: Record<string, unknown> = { estado: newStatus };

    if (motivo) {
      updates.motivo_rechazo = motivo;
    }

    return this.updateRegistration(
      tenantId,
      recordId,
      updates as Parameters<typeof this.updateRegistration>[2],
      userId || "system",
    );
  },

  /**
   * Elimina un registro (solo en estado borrador)
   */
  async deleteRegistration(
    tenantId: string,
    recordId: string,
  ): Promise<boolean> {
    if (usesMockMode()) {
      const tenantData = ensureTenantCollection(tenantId);
      const index = tenantData.findIndex((item) => item.id === recordId);
      if (index < 0) {
        throw new Error("Registration not found");
      }

      if (tenantData[index].estado !== "borrador") {
        throw new Error("Solo se pueden eliminar registros en estado borrador");
      }

      tenantData.splice(index, 1);
      return true;
    }

    const current = await this.getRegistration(tenantId, recordId);
    if (!current) {
      throw new Error("Registration not found");
    }

    if (current.estado !== "borrador") {
      throw new Error("Solo se pueden eliminar registros en estado borrador");
    }

    const client = getSupabaseClient();

    const { error } = await client
      .from(REGISTRATION_TABLE)
      .delete()
      .eq("tenant_id", tenantId)
      .eq("id", recordId);

    if (error) {
      throw new Error(
        `Error deleting registration: ${getSupabaseErrorMessage(error)}`,
      );
    }

    return true;
  },
};
