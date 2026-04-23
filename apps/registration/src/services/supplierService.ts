import {
  emulateConnection,
  getConnectionLabel,
} from "../config/registrationRuntime";
import type {
  CreateSupplierInput,
  Supplier,
  SupplierFilters,
  UpdateSupplierInput,
} from "../types/supplier.types";

const supplierDbByTenant = new Map<string, Supplier[]>();

function ensureTenant(tenantId: string): Supplier[] {
  const existing = supplierDbByTenant.get(tenantId);
  if (existing) return existing;

  const initialized: Supplier[] = [];
  supplierDbByTenant.set(tenantId, initialized);
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

export const supplierService = {
  async create(input: CreateSupplierInput): Promise<Supplier> {
    await emulateConnection("suppliers.create");
    const tenantSuppliers = ensureTenant(input.tenantId);
    const duplicate = tenantSuppliers.find(
      (supplier) =>
        normalize(supplier.documentNumber) === normalize(input.documentNumber),
    );

    if (duplicate) {
      throw new Error(
        "Ya existe un proveedor con ese numero de documento para este tenant",
      );
    }

    const now = new Date().toISOString();
    const newSupplier: Supplier = {
      id: crypto.randomUUID(),
      tenantId: input.tenantId,
      fullName: input.fullName,
      documentType: input.documentType,
      documentNumber: input.documentNumber,
      address: input.address,
      phone: input.phone,
      email: input.email,
      category: input.category,
      paymentTerms: input.paymentTerms,
      bankAccount: input.bankAccount,
      status: "active",
      statusReason: undefined,
      contractReference: undefined,
      createdAt: now,
      updatedAt: now,
    };

    tenantSuppliers.push(newSupplier);
    return newSupplier;
  },

  async update(
    tenantId: string,
    id: string,
    input: UpdateSupplierInput,
  ): Promise<Supplier> {
    await emulateConnection("suppliers.update");
    const tenantSuppliers = ensureTenant(tenantId);
    const index = tenantSuppliers.findIndex((supplier) => supplier.id === id);
    if (index < 0) throw new Error("Proveedor no encontrado");

    const current = tenantSuppliers[index];
    if (input.status === "blacklisted" && !input.statusReason) {
      throw new Error("Debe registrar un motivo para enviar a lista negra");
    }

    const updated: Supplier = {
      ...current,
      ...input,
      documentNumber: current.documentNumber,
      updatedAt: new Date().toISOString(),
    };

    tenantSuppliers[index] = updated;
    return updated;
  },

  async getById(tenantId: string, id: string): Promise<Supplier | null> {
    await emulateConnection("suppliers.getById");
    const tenantSuppliers = ensureTenant(tenantId);
    return tenantSuppliers.find((supplier) => supplier.id === id) ?? null;
  },

  async list(
    tenantId: string,
    filters: SupplierFilters = {},
  ): Promise<{ data: Supplier[]; total: number }> {
    await emulateConnection("suppliers.list");
    const tenantSuppliers = ensureTenant(tenantId);
    const query = normalize(filters.query ?? "");

    const filtered = tenantSuppliers.filter((supplier) => {
      const matchesQuery =
        query.length === 0 ||
        normalize(supplier.fullName).includes(query) ||
        normalize(supplier.documentNumber).includes(query) ||
        normalize(supplier.email).includes(query);

      const matchesStatus =
        !filters.status ||
        filters.status === "all" ||
        supplier.status === filters.status;

      const matchesCategory =
        !filters.category ||
        filters.category === "all" ||
        supplier.category === filters.category;

      const matchesContract =
        filters.hasActiveContract === undefined ||
        (filters.hasActiveContract
          ? supplier.contractReference?.contractStatus === "active"
          : supplier.contractReference?.contractStatus !== "active");

      return (
        matchesQuery && matchesStatus && matchesCategory && matchesContract
      );
    });

    filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return paginate(filtered, filters.page, filters.pageSize);
  },

  getConnectionLabel() {
    return getConnectionLabel();
  },
};
