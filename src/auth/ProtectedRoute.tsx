import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Card } from "../components/ui/Card";
import type { UserRole } from "../types/shell.types";
import { useAuth } from "./useAuth";

export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  allowGuests?: boolean;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  allowGuests = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isAuthenticated && !allowGuests) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (!isAuthenticated && allowGuests) {
    return <>{children}</>;
  }

  if (allowedRoles && allowedRoles.length > 0 && !hasRole(...allowedRoles)) {
    return (
      // CORRECCIÓN: era min-h-screen — cambiado a h-full para no romper el layout
      <div className="flex h-full w-full items-center justify-center p-6">
        <Card className="surface-elevated w-full max-w-lg p-6 text-center md:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]">
            <ShieldAlert className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
            Acceso restringido
          </p>
          <h2 className="mt-2 text-[28px] font-bold leading-tight text-[var(--color-text-primary)]">
            Este módulo no está disponible con tu acceso actual.
          </h2>
          <p className="mt-3 text-[15px] text-[var(--color-text-secondary)]">
            La ruta existe, pero tu rol no tiene permiso para verla todavía.
          </p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
