import { create } from "zustand";
import type { ShellStoreState } from "../types/shell.types";

const defaultTenant = {
  id: "tenant-zenith-demo",
  nombre: "Zenith Operaciones",
  slug: "zenith-operaciones",
};

const defaultUser = {
  id: "user-01",
  nombre: "Laura Martínez",
  rol: "Administradora",
  avatarIniciales: "LM",
};

export const useShellStore = create<ShellStoreState>((set) => ({
  tenantActivo: defaultTenant,
  usuario: defaultUser,
  tema: "dark",
  setTenantActivo: (tenantActivo) => set({ tenantActivo }),
  setUsuario: (usuario) => set({ usuario }),
  setTema: (tema) => set({ tema }),
}));
