import {
  Bell,
  ChevronDown,
  LogIn,
  LogOut,
  MoonStar,
  Settings2,
  SunMedium,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { LoginModal } from "../../modals/LoginModal";
import { useModal } from "../../modals/useModal";
import { useShellStore } from "../../store/shellStore";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export interface TopbarProps {
  tenantName: string;
  userName: string;
  userRole: string;
  avatarInitials: string;
}

function AlertDrawerContent() {
  const alertas = useShellStore((state) => state.alertas);
  const markAlertaAsRead = useShellStore((state) => state.markAlertaAsRead);
  const clearAlertas = useShellStore((state) => state.clearAlertas);

  if (alertas.length === 0) {
    return (
      <div className="rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-sm text-[var(--color-text-secondary)]">
        No hay alertas activas.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">
          {alertas.filter((alerta) => !alerta.leida).length} sin leer
        </p>
        <button
          type="button"
          className="text-sm font-medium text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
          onClick={clearAlertas}
        >
          Limpiar todo
        </button>
      </div>

      <div className="space-y-3">
        {alertas.map((alerta) => (
          <button
            key={alerta.id}
            type="button"
            className="focus-ring w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 text-left transition-colors duration-150 hover:bg-[var(--color-bg-elevated)]"
            onClick={() => markAlertaAsRead(alerta.id)}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                {alerta.titulo}
              </p>
              <Badge
                tone={
                  alerta.severidad === "success"
                    ? "success"
                    : alerta.severidad === "warning"
                      ? "warning"
                      : alerta.severidad === "danger"
                        ? "danger"
                        : "info"
                }
              >
                {alerta.severidad}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {alerta.detalle}
            </p>
            <p className="mt-2 text-xs text-[var(--color-text-disabled)]">
              {new Date(alerta.creadoEn).toLocaleString()}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function ShellBrand({ tenantName }: Pick<TopbarProps, "tenantName">) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="relative flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[var(--color-success)]">
        <span className="absolute h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--color-success)] opacity-40" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
          Zenith Software
        </p>
        <h1 className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
          {tenantName}
        </h1>
      </div>
    </div>
  );
}

function ThemeToggle() {
  const theme = useShellStore((state) => state.tema);
  const toggleTema = useShellStore((state) => state.toggleTema);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTema}
      aria-label="Cambiar tema"
      className="min-w-[120px] justify-start"
    >
      {theme === "dark" ? (
        <SunMedium className="h-4 w-4" />
      ) : (
        <MoonStar className="h-4 w-4" />
      )}
      {theme === "dark" ? "Modo claro" : "Modo oscuro"}
    </Button>
  );
}

function AuthenticatedTopbar({
  tenantName,
  userName,
  userRole,
  avatarInitials,
}: TopbarProps) {
  const { role, signOut } = useAuth();
  const { drawer } = useModal();
  const alertCount = useShellStore(
    (state) => state.alertas.filter((item) => !item.leida).length,
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsProfileOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    // CORRECCIÓN: sin rounded-*, sin shadow-card, borde solo abajo
    // flex-shrink-0 garantiza que el topbar nunca se comprima
    <header className="flex-shrink-0 flex min-h-12 w-full items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-2.5">
      <ShellBrand tenantName={tenantName} />

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            drawer({
              title:
                role === "super_admin"
                  ? "Alertas del sistema"
                  : "Alertas y actividad",
              description:
                role === "super_admin"
                  ? "Incidentes y reportes recibidos en tiempo real."
                  : "Seguimiento de eventos relevantes para tu sesión.",
              side: "right",
              body: <AlertDrawerContent />,
              size: "md",
            })
          }
        >
          <Bell className="h-4 w-4" />
          Alertas
          {alertCount > 0 ? <Badge tone="accent">{alertCount}</Badge> : null}
        </Button>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen((v) => !v)}
            className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-transparent px-3 py-2 text-left transition-colors duration-150 hover:border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)]"
            aria-expanded={isProfileOpen}
            aria-haspopup="menu"
          >
            <div className="text-right">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {userName}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {userRole}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-accent-muted)] text-sm font-semibold text-[var(--color-accent)] shadow-[var(--shadow-accent)]">
              {avatarInitials}
            </div>
            <ChevronDown className="h-4 w-4 text-[var(--color-text-secondary)]" />
          </button>

          {isProfileOpen ? (
            <div className="surface-elevated absolute right-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-[var(--radius-md)]">
              <div className="border-b border-[var(--color-border)] px-4 py-3">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {userName}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {userRole}
                </p>
              </div>
              <div className="p-2">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text-primary)] transition-colors duration-150 hover:bg-[var(--color-bg-elevated)]"
                >
                  <UserRound className="h-4 w-4 text-[var(--color-text-secondary)]" />
                  Mi Perfil
                </button>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text-primary)] transition-colors duration-150 hover:bg-[var(--color-bg-elevated)]"
                >
                  <Settings2 className="h-4 w-4 text-[var(--color-text-secondary)]" />
                  Configuración
                </button>
                <div className="my-2 border-t border-[var(--color-border)]" />
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    setIsProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-error)] transition-colors duration-150 hover:bg-[rgba(248,113,113,0.1)]"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default function Topbar(props: TopbarProps) {
  const { isAuthenticated } = useAuth();
  const { alert } = useModal();

  if (!isAuthenticated) {
    return (
      // CORRECCIÓN: sin rounded-*, borde solo abajo, ancho completo
      <header className="flex-shrink-0 flex min-h-12 w-full items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-2.5">
        <ShellBrand tenantName={props.tenantName} />
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            alert({
              title: "Iniciar sesión",
              body: <LoginModal />,
              dismissible: true,
            })
          }
        >
          <LogIn className="h-4 w-4" />
          Iniciar sesión
        </Button>
      </header>
    );
  }

  return <AuthenticatedTopbar {...props} />;
}
