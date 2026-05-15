import type { ReactNode } from "react";

export type ThemeMode = "dark" | "light";
export type AccentTone = "violet" | "teal";
export type UserRole = "super_admin" | "admin" | "user";
export type AlertSeverity = "info" | "success" | "warning" | "danger";

export interface Tenant {
  id: string;
  nombre: string;
  slug: string;
}

export interface ShellUser {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  avatarIniciales: string;
}

export interface ShellAlert {
  id: string;
  titulo: string;
  detalle: string;
  severidad: AlertSeverity;
  creadoEn: string;
  leida: boolean;
  rolOrigen?: UserRole;
}

export interface ShellStoreState {
  tenantActivo: Tenant;
  usuario: ShellUser | null;
  tema: ThemeMode;
  sidebarCollapsed: boolean;
  alertas: ShellAlert[];
  setTenantActivo: (tenant: Tenant) => void;
  setUsuario: (usuario: ShellUser | null) => void;
  setTema: (tema: ThemeMode) => void;
  toggleTema: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  addAlerta: (alerta: ShellAlert) => void;
  markAlertaAsRead: (id: string) => void;
  clearAlertas: () => void;
}

export interface SidebarItem {
  key: string;
  etiqueta: string;
  ruta: string;
  icono: ModuleIcon;
  allowedRoles?: UserRole[];
}

export type ModuleIcon =
  | "dashboard"
  | "assistance"
  | "registration"
  | "filed"
  | "contact"
  | "contracts"
  | "billing";

export interface ModuleDefinition {
  key: string;
  nombre: string;
  descripcion: string;
  ruta: string;
  icono: ModuleIcon;
  acento: AccentTone;
  estado: string;
  allowedRoles?: UserRole[];
}

export interface StatCard {
  titulo: string;
  valor: string;
  descripcion: string;
}

export interface LayoutChildrenProps {
  children?: ReactNode;
}
