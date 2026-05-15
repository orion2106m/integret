import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined;

const cookieStorage = {
  getItem(key: string) {
    if (typeof document === "undefined") {
      return null;
    }

    const match = document.cookie.match(
      new RegExp(`(?:^|; )${encodeURIComponent(key)}=([^;]*)`),
    );

    return match ? decodeURIComponent(match[1]) : null;
  },
  setItem(key: string, value: string) {
    if (typeof document === "undefined") {
      return;
    }

    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; Path=/; SameSite=Lax${secure}`;
  },
  removeItem(key: string) {
    if (typeof document === "undefined") {
      return;
    }

    document.cookie = `${encodeURIComponent(key)}=; Path=/; Max-Age=0; SameSite=Lax`;
  },
};

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase configuration is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
  );
}

export const supabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    storage: cookieStorage,
  },
});
