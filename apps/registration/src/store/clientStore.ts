import { create } from "zustand";
import { clientService } from "../services/clientService";
import type {
  Client,
  ClientFilters,
  CreateClientInput,
  UpdateClientInput,
} from "../types/client.types";

interface ClientStoreState {
  items: Client[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchClients: (tenantId: string, filters?: ClientFilters) => Promise<void>;
  createClient: (input: CreateClientInput) => Promise<Client>;
  updateClient: (
    tenantId: string,
    id: string,
    input: UpdateClientInput,
  ) => Promise<Client>;
}

export const useClientStore = create<ClientStoreState>((set) => ({
  items: [],
  total: 0,
  loading: false,
  error: null,

  async fetchClients(tenantId, filters) {
    set({ loading: true, error: null });
    try {
      const response = await clientService.list(tenantId, filters);
      set({ items: response.data, total: response.total, loading: false });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "No fue posible cargar clientes",
      });
    }
  },

  async createClient(input) {
    set({ error: null });
    const created = await clientService.create(input);
    set((state) => ({
      items: [created, ...state.items],
      total: state.total + 1,
    }));
    return created;
  },

  async updateClient(tenantId, id, input) {
    set({ error: null });
    const updated = await clientService.update(tenantId, id, input);
    set((state) => ({
      items: state.items.map((client) => (client.id === id ? updated : client)),
    }));
    return updated;
  },
}));
