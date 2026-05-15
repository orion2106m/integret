import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  const commonSecurity = {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "DENY",
  } as Record<string, string>;

  // Don't set a strict inline-blocking CSP for the dev server.
  // Vite injects an inline preamble that must be allowed during development.
  const serverHeaders = {
    ...commonSecurity,
  };

  // For preview (serving a built bundle locally), set CSP only in production mode.
  const previewHeaders = isProd
    ? {
        ...commonSecurity,
        "Content-Security-Policy": csp,
      }
    : {
        ...commonSecurity,
      };

  return {
    plugins: [react()],
    server: {
      headers: serverHeaders,
    },
    preview: {
      headers: previewHeaders,
    },
    esbuild: isProd ? { drop: ["console", "debugger"] } : undefined,
  };
});
