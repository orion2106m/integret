import { create } from "zustand";
import { supplierService } from "../services/supplierService";
import type {
  CreateSupplierInput,
  Supplier,
  SupplierFilters,
  UpdateSupplierInput,
} from "../types/supplier.types";

interface SupplierStoreState {
  items: Supplier[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchSuppliers: (
    tenantId: string,
    filters?: SupplierFilters,
  ) => Promise<void>;
  createSupplier: (input: CreateSupplierInput) => Promise<Supplier>;
  updateSupplier: (
    tenantId: string,
    id: string,
    input: UpdateSupplierInput,
  ) => Promise<Supplier>;
}

export const useSupplierStore = create<SupplierStoreState>((set) => ({
  items: [],
  total: 0,
  loading: false,
  error: null,

  async fetchSuppliers(tenantId, filters) {
    set({ loading: true, error: null });
    try {
      const response = await supplierService.list(tenantId, filters);
      set({ items: response.data, total: response.total, loading: false });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "No fue posible cargar proveedores",
      });
    }
  },

  async createSupplier(input) {
    set({ error: null });
    const created = await supplierService.create(input);
    set((state) => ({
      items: [created, ...state.items],
      total: state.total + 1,
    }));
    return created;
  },

  async updateSupplier(tenantId, id, input) {
    set({ error: null });
    const updated = await supplierService.update(tenantId, id, input);
    set((state) => ({
      items: state.items.map((supplier) =>
        supplier.id === id ? updated : supplier,
      ),
    }));
    return updated;
  },
}));
