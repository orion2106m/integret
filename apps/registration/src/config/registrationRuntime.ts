export type RegistrationConnectionMode = "mock" | "supabase";
export type RegistrationTenantModel = "shared" | "hybrid" | "isolated";
export type RegistrationDataPlacement = "shared-db" | "tenant-db";

const DEFAULT_CONNECTION_MODE: RegistrationConnectionMode = "mock";
const DEFAULT_TENANT_MODEL: RegistrationTenantModel = "hybrid";
const DEFAULT_MOCK_LATENCY_MS = 140;

function readEnvValue(key: string): string | undefined {
  const env = import.meta.env as Record<string, string | undefined>;
  const value = env[key];
  return value?.trim() || undefined;
}

function readNumberEnvValue(key: string, fallback: number): number {
  const raw = readEnvValue(key);
  if (!raw) return fallback;

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export const registrationRuntime = {
  connectionMode:
    (readEnvValue("VITE_REGISTRATION_CONNECTION_MODE") as
      | RegistrationConnectionMode
      | undefined) ?? DEFAULT_CONNECTION_MODE,
  tenantModel:
    (readEnvValue("VITE_REGISTRATION_TENANT_MODEL") as
      | RegistrationTenantModel
      | undefined) ?? DEFAULT_TENANT_MODEL,
  mockLatencyMs: readNumberEnvValue(
    "VITE_REGISTRATION_MOCK_LATENCY_MS",
    DEFAULT_MOCK_LATENCY_MS,
  ),
  supabaseUrl: readEnvValue("VITE_SUPABASE_URL"),
  supabaseAnonKey: readEnvValue("VITE_SUPABASE_ANON_KEY"),
};

export function isSupabaseConfigured(): boolean {
  return Boolean(
    registrationRuntime.supabaseUrl && registrationRuntime.supabaseAnonKey,
  );
}

export function getDataPlacement(
  entityType: "client" | "supplier",
  clientType?: "natural" | "company",
): RegistrationDataPlacement {
  if (registrationRuntime.tenantModel === "shared") {
    return "shared-db";
  }

  if (registrationRuntime.tenantModel === "isolated") {
    return "tenant-db";
  }

  if (entityType === "client" && clientType === "company") {
    return "tenant-db";
  }

  return "shared-db";
}

export function getConnectionLabel(): RegistrationConnectionMode {
  if (
    registrationRuntime.connectionMode === "supabase" &&
    isSupabaseConfigured()
  ) {
    return "supabase";
  }

  return "mock";
}

export async function emulateConnection(action: string): Promise<void> {
  const latency =
    registrationRuntime.connectionMode === "supabase"
      ? Math.max(registrationRuntime.mockLatencyMs, 240)
      : registrationRuntime.mockLatencyMs;
  await new Promise((resolve) => globalThis.setTimeout(resolve, latency));

  if (
    registrationRuntime.connectionMode === "supabase" &&
    !isSupabaseConfigured()
  ) {
    console.info(
      `[registration] ${action}: using mock fallback because Supabase env is missing`,
    );
  }
}
