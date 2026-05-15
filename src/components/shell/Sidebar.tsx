import { NavLink } from "react-router-dom";
import type { ModuleIcon, SidebarItem } from "../../types/shell.types";

export interface SidebarProps {
  collapsed: boolean;
  items: SidebarItem[];
  onToggle: () => void;
}

function BrandMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="8"
        height="8"
        rx="1.6"
        fill="var(--color-accent-violet)"
      />
      <rect
        x="13"
        y="3"
        width="8"
        height="8"
        rx="1.6"
        fill="var(--color-accent-teal)"
      />
      <rect
        x="3"
        y="13"
        width="8"
        height="8"
        rx="1.6"
        fill="var(--color-accent-teal)"
      />
      <rect
        x="13"
        y="13"
        width="8"
        height="8"
        rx="1.6"
        fill="var(--color-accent-violet)"
      />
    </svg>
  );
}

function Icon({ name }: { name: ModuleIcon }) {
  const common = "h-5 w-5";

  switch (name) {
    case "dashboard":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M3 13h8V3H3zm10 8h8v-6h-8zM3 21h8v-6H3zm10-8h8V3h-8z" />
        </svg>
      );
    case "assistance":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M4 5h16v14H4z" />
          <path d="M8 9h8m-8 4h6" />
        </svg>
      );
    case "registration":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M7 3h10v18H7z" />
          <path d="M10 7h4m-4 4h4m-4 4h4" />
        </svg>
      );
    case "filed":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v4h4" />
        </svg>
      );
    case "contact":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="3" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      );
    case "contracts":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M5 4h14v16H5z" />
          <path d="M8 8h8m-8 4h8m-8 4h5" />
        </svg>
      );
    case "billing":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M4 7h16v10H4z" />
          <path d="M4 11h16" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({ collapsed, items, onToggle }: SidebarProps) {
  return (
    <aside
      className="surface-1 relative flex h-screen flex-col py-3 transition-[width] duration-300"
      style={{
        width: collapsed
          ? "var(--sidebar-collapsed)"
          : "var(--sidebar-expanded)",
      }}
    >
      <div className="mb-4 border-b border-[var(--color-border)] px-2 pb-3">
        <div className="mb-2 flex items-center justify-between">
          <div
            className={`flex min-w-0 items-center gap-2 ${collapsed ? "justify-center" : ""}`}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--color-surface-2)]">
              <BrandMark />
            </span>
            <div className={collapsed ? "hidden" : "block"}>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                Plataforma
              </p>
              <p className="-mt-0.5 text-sm font-semibold uppercase tracking-[0.1em] text-[var(--color-text)]">
                Zenith
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
            aria-label={
              collapsed ? "Expandir navegación" : "Colapsar navegación"
            }
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {collapsed ? (
                <path d="M9 18 15 12 9 6" />
              ) : (
                <path d="M15 18 9 12l6-6" />
              )}
            </svg>
          </button>
        </div>

        <p
          className={`text-[11px] text-[var(--color-text-muted)] ${collapsed ? "hidden" : "block"}`}
        >
          Shell administrativo
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {items.map((item) => (
          <NavLink
            key={item.key}
            to={item.ruta}
            className={({ isActive }) =>
              `anim-slide-in flex h-10 items-center gap-3 rounded-[var(--radius-sm)] px-2 text-sm transition-colors ${
                isActive
                  ? "bg-[rgba(108,99,255,0.18)] text-[var(--color-accent-violet)]"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
              }`
            }
          >
            <span className="inline-flex h-5 w-5 items-center justify-center">
              <Icon name={item.icono} />
            </span>
            <span className={collapsed ? "hidden" : "truncate"}>
              {item.etiqueta}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
