import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

let supabaseClient: SupabaseClient | null = null;

if (supabaseUrl && supabasePublishableKey) {
  supabaseClient = createClient(supabaseUrl, supabasePublishableKey);
} else {
  console.info(
    "[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Using mock fallback where available.",
  );
}

export const supabase = supabaseClient;

export function getSupabaseErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;
    if ("message" in err) {
      return String(err.message);
    }
  }

  return "An unknown error occurred";
}
