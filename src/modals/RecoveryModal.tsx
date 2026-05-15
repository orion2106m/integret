import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { supabaseClient } from "../lib/supabaseClient";

export function RecoveryModal() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        },
      );

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (err) {
      // Generic error message to prevent username enumeration
      setError(
        "Si esa cuenta existe, recibirás un enlace de recuperación en tu email.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6 text-green-600"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text)]">
          Revisa tu email
        </h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          Si {email} está registrado en Zenith, recibirás un enlace para
          restablecer tu contraseña en los próximos minutos.
        </p>
        <p className="text-xs text-[var(--color-text-subtle)]">
          No olvides revisar tu carpeta de spam.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Decorative background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-2xl"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Modal content */}
      <motion.div
        className="relative bg-[var(--color-bg-elevated)] rounded-2xl p-8 shadow-xl border border-[var(--color-surface-3)]"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            Recuperar contraseña
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Ingresa tu email para recibir un enlace de recuperación
          </p>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-600 dark:text-amber-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="recovery-email"
              className="block text-sm font-medium text-[var(--color-text)]"
            >
              Email
            </label>
            <input
              id="recovery-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              className="mt-1 w-full px-4 py-2 bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] border border-[var(--color-surface-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-all disabled:opacity-50"
              aria-label="Email address"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
