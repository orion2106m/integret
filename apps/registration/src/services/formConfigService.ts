import {
  clientCompanyDefaultConfig,
  clientNaturalDefaultConfig,
} from "../config/clientDefaultConfig";
import {
  emulateConnection,
  getConnectionLabel,
  getDataPlacement,
} from "../config/registrationRuntime";
import { supplierDefaultConfig } from "../config/supplierDefaultConfig";
import type {
  ClientType,
  EntityType,
  FormConfig,
} from "../types/formConfig.types";
import { mergeFormConfig } from "../utils/mergeFormConfig";

type ConfigSource = "mock" | "supabase";

const tenantConfigStore = new Map<string, FormConfig[]>();

function buildKey(
  tenantId: string,
  entityType: EntityType,
  clientType?: ClientType,
): string {
  return `${tenantId}:${entityType}:${clientType ?? "n/a"}`;
}

function getDefaults(
  entityType: EntityType,
  clientType?: ClientType,
): FormConfig {
  if (entityType === "supplier") return supplierDefaultConfig;
  return clientType === "company"
    ? clientCompanyDefaultConfig
    : clientNaturalDefaultConfig;
}

function resolveConfigSource(
  entityType: EntityType,
  clientType?: ClientType,
): ConfigSource {
  void entityType;
  void clientType;
  return getConnectionLabel() as ConfigSource;
}

export const formConfigService = {
  async getActive(
    tenantId: string,
    entityType: EntityType,
    clientType?: ClientType,
  ): Promise<{ config: FormConfig; source: ConfigSource; placement: string }> {
    await emulateConnection("formConfig.getActive");
    const source = resolveConfigSource(entityType, clientType);
    const base = getDefaults(entityType, clientType);
    const placement = getDataPlacement(entityType, clientType);

    const key = buildKey(tenantId, entityType, clientType);
    const currentConfigs = tenantConfigStore.get(key) ?? [];
    const tenantOverride = currentConfigs[currentConfigs.length - 1];

    return {
      source,
      placement,
      config: mergeFormConfig({ ...base, tenantId }, tenantOverride),
    };
  },

  async save(tenantId: string, config: FormConfig): Promise<FormConfig> {
    await emulateConnection("formConfig.save");
    const key = buildKey(tenantId, config.entityType, config.clientType);
    const existing = tenantConfigStore.get(key) ?? [];
    const next = {
      ...config,
      tenantId,
      updatedAt: new Date().toISOString(),
    };

    tenantConfigStore.set(key, [...existing, next]);
    return next;
  },
};
