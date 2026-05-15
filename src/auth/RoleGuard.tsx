import type { ReactNode } from "react";
import type { UserRole } from "../types/shell.types";
import { useAuth } from "./useAuth";

export interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
}: RoleGuardProps) {
  const { hasRole } = useAuth();

  if (!hasRole(...allowedRoles)) {
    return fallback;
  }

  return children;
}
