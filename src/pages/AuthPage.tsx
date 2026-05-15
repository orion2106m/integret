import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { sanitizeEmail, sanitizeText } from "../utils/sanitizer";

const passwordPolicy = [
  "Al menos 12 caracteres",
  "1 letra mayúscula y 1 minúscula",
  "1 número",
  "1 símbolo",
  "Sin reutilizar contraseñas corporativas comunes",
];

export default function AuthPage() {
  const { isAuthenticated, loading, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={(location.state as { from?: string } | null)?.from ?? "/"}
        replace
      />
    );
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center p-4 md:p-8">
      <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-1 overflow-hidden rounded-[var(--radius-lg)] p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            Zenith access control
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--color-text)] md:text-5xl">
            Shell enterprise para orquestar todos los módulos.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-[var(--color-text-muted)] md:text-base">
            Acceso protegido por rol, alertas en tiempo real para super_admin y
            un sistema visual preparado para operar en modo claro u oscuro.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {passwordPolicy.map((rule) => (
              <div
                key={rule}
                className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text-muted)]"
              >
                {rule}
              </div>
            ))}
          </div>
        </div>

        <Card className="p-6 md:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
              Iniciar sesión
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
              Accede al panel Zenith
            </h2>
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setErrorMessage(null);
              setIsSubmitting(true);

              try {
                if (password.length < 12) {
                  throw new Error(
                    "La contraseña no cumple la política mínima de seguridad.",
                  );
                }

                await signIn({
                  email: sanitizeEmail(email),
                  password: sanitizeText(password),
                });
              } catch (error) {
                setErrorMessage(
                  error instanceof Error
                    ? error.message
                    : "No fue posible iniciar sesión.",
                );
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <label className="block text-sm font-medium text-[var(--color-text)]">
              Correo corporativo
              <input
                className="focus-ring mt-2 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)]"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@zenith.io"
                autoComplete="email"
              />
            </label>

            <label className="block text-sm font-medium text-[var(--color-text)]">
              Contraseña
              <input
                className="focus-ring mt-2 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)]"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                minLength={12}
              />
            </label>

            {errorMessage ? (
              <div className="rounded-[var(--radius-sm)] border border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.12)] px-4 py-3 text-sm text-[var(--color-danger)]">
                {errorMessage}
              </div>
            ) : null}

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Validando acceso..." : "Entrar al shell"}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
