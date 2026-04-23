import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-6">
      <div className="surface-1 w-full max-w-md rounded-[var(--radius-lg)] p-6 text-center">
        <h1 className="text-xl font-semibold text-[var(--color-text)]">
          Autenticación pendiente
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Este layout está listo para integrar el flujo de acceso cuando el
          módulo de autenticación esté disponible.
        </p>
      </div>
      <Outlet />
    </div>
  );
}
