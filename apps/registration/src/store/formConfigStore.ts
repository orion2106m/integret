import { create } from "zustand";
import { formConfigService } from "../services/formConfigService";
import type {
  ClientType,
  EntityType,
  FormConfig,
} from "../types/formConfig.types";

interface FormConfigStoreState {
  config: FormConfig | null;
  loading: boolean;
  source: string | null;
  placement: string | null;
  error: string | null;
  loadConfig: (
    tenantId: string,
    entityType: EntityType,
    clientType?: ClientType,
  ) => Promise<void>;
  saveConfig: (tenantId: string, config: FormConfig) => Promise<void>;
}

export const useFormConfigStore = create<FormConfigStoreState>((set) => ({
  config: null,
  source: null,
  placement: null,
  loading: false,
  error: null,

  async loadConfig(tenantId, entityType, clientType) {
    set({ loading: true, error: null });
    try {
      const response = await formConfigService.getActive(
        tenantId,
        entityType,
        clientType,
      );
      set({
        config: response.config,
        source: response.source,
        placement: response.placement,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "No fue posible cargar la configuracion",
      });
    }
  },

  async saveConfig(tenantId, config) {
    set({ loading: true, error: null });
    try {
      const saved = await formConfigService.save(tenantId, config);
      set({ config: saved, loading: false });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "No fue posible guardar la configuracion",
      });
    }
  },
}));
