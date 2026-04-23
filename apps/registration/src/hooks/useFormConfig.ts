import { useEffect } from "react";
import { useFormConfigStore } from "../store/formConfigStore";
import type { ClientType, EntityType } from "../types/formConfig.types";

export function useFormConfig(
  tenantId: string,
  entityType: EntityType,
  clientType?: ClientType,
) {
  const { config, source, placement, loading, error, loadConfig, saveConfig } =
    useFormConfigStore();

  useEffect(() => {
    void loadConfig(tenantId, entityType, clientType);
  }, [tenantId, entityType, clientType, loadConfig]);

  return {
    config,
    source,
    placement,
    loading,
    error,
    saveConfig: (nextTenantId: string) => {
      if (!config) return Promise.resolve();
      return saveConfig(nextTenantId, config);
    },
    reload: () => loadConfig(tenantId, entityType, clientType),
  };
}
