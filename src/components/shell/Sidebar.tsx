import {
  type LucideIcon,
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  FileSignature,
  FileText,
  LayoutDashboard,
  Phone,
  Settings,
  UserCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Badge } from "../ui/Badge";

type SidebarBadgeTone = "success" | "warning" | "disabled";

interface SidebarNavItem {
  key: string;
  label: string;
  to?: string;
  icon: LucideIcon;
  badge?: string;
  badgeTone?: SidebarBadgeTone;
  disabled?: boolean;
  tooltip?: string;
}

interface SidebarSection {
  label: string;
  items: SidebarNavItem[];
}

export interface SidebarProps {
  collapsed: boolean;
  sections: SidebarSection[];
  onToggle: () => void;
}

function ZenithMark() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[var(--color-border-accent)] bg-[var(--color-accent-muted)] text-[var(--color-accent)] shadow-[var(--shadow-accent)]">
      <span className="text-[11px] font-bold tracking-[0.18em]">Z</span>
    </div>
  );
}

function NavIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon className="h-4.5 w-4.5 stroke-[1.8]" aria-hidden="true" />;
}

function SidebarItemRow({
  item,
  collapsed,
}: {
  item: SidebarNavItem;
  collapsed: boolean;
}) {
  const baseClasses =
    "group flex h-10 items-center gap-3 rounded-[var(--radius-sm)] px-3 text-sm font-medium transition-colors duration-150";
  const activeClasses =
    "border-l-2 border-[var(--color-accent)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]";
  const idleClasses =
    "border-l-2 border-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]";

  const inner = (
    <>
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-[8px] ${collapsed ? "mx-auto" : "bg-[var(--color-accent-muted)] text-[var(--color-accent)]"}`}
      >
        <NavIcon icon={item.icon} />
      </span>
      {!collapsed ? (
        <>
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {item.badge ? (
            <Badge
              tone={
                item.badgeTone === "success"
                  ? "success"
                  : item.badgeTone === "warning"
                    ? "warning"
                    : "disabled"
              }
              className="ml-auto text-[10px] px-1.5 py-0.5 rounded-sm"
            >
              {item.badge}
            </Badge>
          ) : null}
        </>
      ) : null}
    </>
  );

  if (item.disabled || !item.to) {
    return (
      <div
        title={item.tooltip ?? item.label}
        aria-disabled="true"
        className={`${baseClasses} cursor-not-allowed opacity-50 ${idleClasses}`}
      >
        {inner}
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      title={item.tooltip ?? item.label}
      className={({ isActive }) =>
        `${baseClasses} ${isActive ? activeClasses : idleClasses}`
      }
    >
      {inner}
    </NavLink>
  );
}

export default function Sidebar({
  collapsed,
  sections,
  onToggle,
}: SidebarProps) {
  return (
    <aside
      className="surface-1 flex h-full flex-col overflow-hidden transition-[width] duration-[200ms] ease-[cubic-bezier(0.2,0,0,1)]"
      style={{
        width: collapsed ? "52px" : "220px",
      }}
    >
      <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] px-3 py-3">
        <div
          className={`flex min-w-0 items-center gap-3 ${collapsed ? "justify-center" : ""}`}
        >
          <ZenithMark />
          {!collapsed ? (
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                Plataforma Zenith
              </p>
              <p className="truncate text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-text-primary)]">
                Shell
              </p>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] border border-transparent text-[var(--color-text-secondary)] transition-colors duration-150 hover:border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
          aria-label={collapsed ? "Expandir navegación" : "Colapsar navegación"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="border-b border-[var(--color-border)] px-3 py-3">
        <div
          className={`flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}
        >
          <span className="relative flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[var(--color-success)]">
            <span className="absolute h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--color-success)] opacity-40" />
          </span>
          {!collapsed ? (
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              Zenith Software
            </span>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-2 py-4">
        {sections.map((section) => (
          <div key={section.label} className="space-y-2">
            {!collapsed ? (
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                {section.label}
              </p>
            ) : null}

            <div className="space-y-1">
              {section.items.map((item) => (
                <SidebarItemRow
                  key={item.key}
                  item={item}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export const sidebarNavIcons = {
  dashboard: LayoutDashboard,
  assistance: Clock3,
  registration: UserCheck,
  filed: FileText,
  contact: Phone,
  contracts: FileSignature,
  billing: CreditCard,
  settings: Settings,
  alerts: Bell,
} as const;
