import { Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Sidebar, { sidebarNavIcons } from "../components/shell/Sidebar";
import Topbar from "../components/shell/Topbar";
import { useSidebar } from "../hooks/useSidebar";
import { useShellStore } from "../store/shellStore";

export default function MainLayout() {
  const { collapsed, toggle } = useSidebar();
  const { user, role } = useAuth();
  const tenantActivo = useShellStore((state) => state.tenantActivo);
  const usuario = useShellStore((state) => state.usuario);
  const alertCount = useShellStore(
    (state) => state.alertas.filter((item) => !item.leida).length,
  );

  const canSeeSystem = role === "super_admin" || role === "admin";
  const canSeeModuleNav = true;

  const sidebarSections = [
    {
      label: "Principal",
      items: [
        {
          key: "dashboard",
          label: "Dashboard",
          to: "/",
          icon: sidebarNavIcons.dashboard,
          tooltip: "Ir al dashboard principal",
        },
      ],
    },
    {
      label: "Módulos",
      items: canSeeModuleNav
        ? [
            {
              key: "assistance",
              label: "Asistencia",
              to: "/assistance",
              icon: sidebarNavIcons.assistance,
              badge: "Activo",
              badgeTone: "success" as const,
            },
            {
              key: "registration",
              label: "Registro",
              to: "/registration",
              icon: sidebarNavIcons.registration,
              badge: "Activo",
              badgeTone: "success" as const,
            },
            {
              key: "filed",
              label: "Radicado",
              to: "/filed",
              icon: sidebarNavIcons.filed,
              badge: "Config",
              badgeTone: "warning" as const,
            },
            {
              key: "contact",
              label: "Contacto",
              to: "/contact",
              icon: sidebarNavIcons.contact,
              badge: "Config",
              badgeTone: "warning" as const,
            },
            {
              key: "contracts",
              label: "Contratos",
              to: "/contracts",
              icon: sidebarNavIcons.contracts,
              badge: "Próximo",
              badgeTone: "disabled" as const,
              disabled: true,
            },
            {
              key: "billing",
              label: "Facturación",
              to: "/billing",
              icon: sidebarNavIcons.billing,
              badge: "Próximo",
              badgeTone: "disabled" as const,
              disabled: true,
            },
          ]
        : [],
    },
    {
      label: "Sistema",
      items: canSeeSystem
        ? [
            {
              key: "settings",
              label: "Configuración",
              to: "/settings",
              icon: sidebarNavIcons.settings,
            },
            {
              key: "alerts",
              label: "Alertas",
              icon: sidebarNavIcons.alerts,
              badge: alertCount > 0 ? String(alertCount) : undefined,
              badgeTone: "warning" as const,
              disabled: true,
              tooltip: "Panel de alertas disponible en el lateral superior",
            },
          ]
        : [],
    },
  ].filter((section) => section.items.length > 0);

  return (
    // 1. h-full en lugar de h-screen — #root ya tiene height:100% en globals.css
    <div className="h-full w-full flex overflow-hidden bg-[var(--color-bg-base)] text-[var(--color-text)]">
      <Sidebar
        collapsed={collapsed}
        sections={sidebarSections}
        onToggle={toggle}
      />

      {/* 2. Columna central: flex-col, h-full, min-w-0 crítico para flex shrink */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {/* 3. Topbar sin wrapper div extra — ocupa ancho completo sin padding lateral */}
        <Topbar
          tenantName={tenantActivo.nombre}
          userName={usuario?.nombre ?? user?.nombre ?? "Usuario"}
          userRole={usuario?.rol ?? role ?? "user"}
          avatarInitials={
            usuario?.avatarIniciales ?? user?.avatarIniciales ?? "U"
          }
        />

        {/* 4. main con padding reducido */}
        <main className="flex-1 overflow-y-auto px-5 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
