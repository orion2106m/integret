/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REGISTRATION_CONNECTION_MODE?: "mock" | "supabase";
  readonly VITE_REGISTRATION_TENANT_MODEL?: "shared" | "hybrid" | "isolated";
  readonly VITE_REGISTRATION_MOCK_LATENCY_MS?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
