import { Outlet } from "react-router-dom";
import Sidebar from "../components/shell/Sidebar";
import Topbar from "../components/shell/Topbar";
import { useSidebar } from "../hooks/useSidebar";
import { useShellStore } from "../store/shellStore";
import type { SidebarItem } from "../types/shell.types";

const sidebarItems: SidebarItem[] = [
  { key: "dashboard", etiqueta: "Dashboard", ruta: "/", icono: "dashboard" },
  {
    key: "assistance",
    etiqueta: "Asistencia",
    ruta: "/assistance",
    icono: "assistance",
  },
  {
    key: "registration",
    etiqueta: "Registro",
    ruta: "/registration",
    icono: "registration",
  },
  { key: "filed", etiqueta: "Radicado", ruta: "/filed", icono: "filed" },
  { key: "contact", etiqueta: "Contacto", ruta: "/contact", icono: "contact" },
  {
    key: "contracts",
    etiqueta: "Contratos",
    ruta: "/contracts",
    icono: "contracts",
  },
  {
    key: "billing",
    etiqueta: "Facturación",
    ruta: "/billing",
    icono: "billing",
  },
];

export default function MainLayout() {
  const { collapsed, toggle } = useSidebar();
  const tenantActivo = useShellStore((state) => state.tenantActivo);
  const usuario = useShellStore((state) => state.usuario);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar collapsed={collapsed} items={sidebarItems} onToggle={toggle} />

      <div className="flex min-h-screen flex-1 flex-col gap-5 px-4 py-4 md:px-6 md:py-5">
        <Topbar
          tenantName={tenantActivo.nombre}
          userName={usuario.nombre}
          userRole={usuario.rol}
          avatarInitials={usuario.avatarIniciales}
        />

        <main className="shell-page flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
