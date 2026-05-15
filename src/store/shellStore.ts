import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShellStoreState, ShellUser } from "../types/shell.types";

const defaultTenant = {
  id: "tenant-zenith-demo",
  nombre: "Zenith Operaciones",
  slug: "zenith-operaciones",
};

const defaultUser: ShellUser = {
  id: "user-01",
  email: "laura.martinez@zenith.local",
  nombre: "Laura Martínez",
  rol: "admin",
  avatarIniciales: "LM",
};

export const useShellStore = create<ShellStoreState>()(
  persist(
    (set) => ({
      tenantActivo: defaultTenant,
      usuario: defaultUser,
      tema: "dark",
      sidebarCollapsed: false,
      alertas: [],
      setTenantActivo: (tenantActivo) => set({ tenantActivo }),
      setUsuario: (usuario) => set({ usuario }),
      setTema: (tema) => set({ tema }),
      toggleTema: () =>
        set((state) => ({ tema: state.tema === "dark" ? "light" : "dark" })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      toggleSidebarCollapsed: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      addAlerta: (alerta) =>
        set((state) => ({ alertas: [alerta, ...state.alertas].slice(0, 12) })),
      markAlertaAsRead: (id) =>
        set((state) => ({
          alertas: state.alertas.map((alerta) =>
            alerta.id === id ? { ...alerta, leida: true } : alerta,
          ),
        })),
      clearAlertas: () => set({ alertas: [] }),
    }),
    {
      name: "zenith-shell-preferences",
      partialize: (state) => ({
        tema: state.tema,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);
