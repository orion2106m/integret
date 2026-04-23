import type { ReactNode } from "react";

export type ThemeMode = "dark" | "light";
export type AccentTone = "violet" | "teal";

export interface Tenant {
  id: string;
  nombre: string;
  slug: string;
}

export interface ShellUser {
  id: string;
  nombre: string;
  rol: string;
  avatarIniciales: string;
}

export interface ShellStoreState {
  tenantActivo: Tenant;
  usuario: ShellUser;
  tema: ThemeMode;
  setTenantActivo: (tenant: Tenant) => void;
  setUsuario: (usuario: ShellUser) => void;
  setTema: (tema: ThemeMode) => void;
}

export interface SidebarItem {
  key: string;
  etiqueta: string;
  ruta: string;
  icono: ModuleIcon;
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
}

export interface StatCard {
  titulo: string;
  valor: string;
  descripcion: string;
}

export interface LayoutChildrenProps {
  children?: ReactNode;
}
