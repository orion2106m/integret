import {
  emulateConnection,
  getConnectionLabel,
} from "../config/registrationRuntime";
import type {
  Client,
  ClientFilters,
  CreateClientInput,
  UpdateClientInput,
} from "../types/client.types";

const clientDbByTenant = new Map<string, Client[]>();

function ensureTenant(tenantId: string): Client[] {
  const existing = clientDbByTenant.get(tenantId);
  if (existing) return existing;

  const initialized: Client[] = [];
  clientDbByTenant.set(tenantId, initialized);
  return initialized;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 20,
): { data: T[]; total: number } {
  const safePage = Math.max(page, 1);
  const safePageSize = Math.max(pageSize, 1);
  const start = (safePage - 1) * safePageSize;
  return {
    data: items.slice(start, start + safePageSize),
    total: items.length,
  };
}

export const clientService = {
  async create(input: CreateClientInput): Promise<Client> {
    await emulateConnection("clients.create");
    const tenantClients = ensureTenant(input.tenantId);
    const duplicate = tenantClients.find(
      (client) =>
        normalize(client.documentNumber) === normalize(input.documentNumber),
    );

    if (duplicate) {
      throw new Error(
        "Ya existe un cliente con ese numero de documento para este tenant",
      );
    }

    const now = new Date().toISOString();
    const newClient: Client = {
      id: crypto.randomUUID(),
      tenantId: input.tenantId,
      clientType: input.clientType,
      fullName: input.fullName,
      documentType: input.documentType,
      documentNumber: input.documentNumber,
      address: input.address,
      phone: input.phone,
      email: input.email,
      status: "active",
      contractReference: undefined,
      customFields: input.customFields,
      createdAt: now,
      updatedAt: now,
    };

    tenantClients.push(newClient);
    return newClient;
  },

  async update(
    tenantId: string,
    id: string,
    input: UpdateClientInput,
  ): Promise<Client> {
    await emulateConnection("clients.update");
    const tenantClients = ensureTenant(tenantId);
    const index = tenantClients.findIndex((client) => client.id === id);
    if (index < 0) throw new Error("Cliente no encontrado");

    const current = tenantClients[index];
    if (input.status && input.status !== "active" && !input.statusReason) {
      throw new Error(
        "Debe registrar un motivo para cambiar a Inactivo o Suspendido",
      );
    }

    const updated: Client = {
      ...current,
      ...input,
      documentNumber: current.documentNumber,
      updatedAt: new Date().toISOString(),
    };

    tenantClients[index] = updated;
    return updated;
  },

  async getById(tenantId: string, id: string): Promise<Client | null> {
    await emulateConnection("clients.getById");
    const tenantClients = ensureTenant(tenantId);
    return tenantClients.find((client) => client.id === id) ?? null;
  },

  async list(
    tenantId: string,
    filters: ClientFilters = {},
  ): Promise<{ data: Client[]; total: number }> {
    await emulateConnection("clients.list");
    const tenantClients = ensureTenant(tenantId);
    const query = normalize(filters.query ?? "");

    const filtered = tenantClients.filter((client) => {
      const matchesQuery =
        query.length === 0 ||
        normalize(client.fullName).includes(query) ||
        normalize(client.documentNumber).includes(query) ||
        normalize(client.email).includes(query);

      const matchesStatus =
        !filters.status ||
        filters.status === "all" ||
        client.status === filters.status;

      const matchesType =
        !filters.clientType ||
        filters.clientType === "all" ||
        client.clientType === filters.clientType;

      return matchesQuery && matchesStatus && matchesType;
    });

    filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return paginate(filtered, filters.page, filters.pageSize);
  },

  getConnectionLabel() {
    return getConnectionLabel();
  },
};
