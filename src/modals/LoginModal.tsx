import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import type { SignInCredentials } from "../auth/AuthContext";
import { useAuth } from "../auth/useAuth";

export function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const credentials: SignInCredentials = { email: email.trim(), password };
      await signIn(credentials);
      // Modal will close automatically when session changes
    } catch (err) {
      // Generic error message to prevent username enumeration (OWASP A07)
      setError("Credenciales incorrectas o cuenta desactivada.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Decorative background with animated gradient */}
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
            Ingresar
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Accede a tu cuenta de Zenith
          </p>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-600 dark:text-red-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--color-text)]"
            >
              Email
            </label>
            <input
              id="email"
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

          {/* Password field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--color-text)]"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="mt-1 w-full px-4 py-2 bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] border border-[var(--color-surface-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-all disabled:opacity-50"
              aria-label="Password"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={isLoading}
          >
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 text-center text-sm">
          <button
            type="button"
            onClick={() => {
              // Open recovery modal via modal manager
              // For now, just show a placeholder
              alert(
                "Recuperación de contraseña aún no implementada. Por favor, contacta a soporte.",
              );
            }}
            className="text-[var(--color-focus)] hover:underline transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </motion.div>
    </div>
  );
}
