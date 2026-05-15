import {
  type LucideIcon,
  ArrowRight,
  Clock3,
  CreditCard,
  FileSignature,
  FileText,
  LayoutDashboard,
  Phone,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { AccentTone, ModuleIcon } from "../../types/shell.types";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

export interface ModuleCardProps {
  title: string;
  description: string;
  to: string;
  icon: ModuleIcon;
  accent: AccentTone;
  status: string;
  statusTone?: "success" | "warning" | "disabled" | "info";
  meta: string;
  disabled?: boolean;
}

function ModuleIconView({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon className="h-4 w-4 stroke-[1.8]" aria-hidden="true" />;
}

function resolveIcon(icon: ModuleIcon): LucideIcon {
  switch (icon) {
    case "assistance":
      return Clock3;
    case "registration":
      return UserCheck;
    case "filed":
      return FileText;
    case "contact":
      return Phone;
    case "contracts":
      return FileSignature;
    case "billing":
      return CreditCard;
    default:
      return LayoutDashboard;
  }
}

export default function ModuleCard({
  title,
  description,
  to,
  icon,
  accent,
  status,
  statusTone = status === "Próximo"
    ? "disabled"
    : status === "Config"
      ? "warning"
      : "success",
  meta,
  disabled = false,
}: ModuleCardProps) {
  const AccentIcon = resolveIcon(icon);
  const accentClass =
    accent === "violet"
      ? "text-[var(--color-accent)]"
      : "text-[var(--color-info)]";

  const statusToneClass =
    statusTone === "success"
      ? "success"
      : statusTone === "warning"
        ? "warning"
        : statusTone === "info"
          ? "info"
          : "disabled";

  const cardClasses = disabled
    ? "p-3 opacity-45"
    : "p-3 transition-colors duration-150 hover:bg-[var(--color-bg-elevated)]";

  return (
    <Card className={`${cardClasses} flex flex-col gap-2`}>
      {/* Fila superior: icono + badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] border border-[var(--color-border)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]">
          <ModuleIconView icon={AccentIcon} />
        </div>
        <Badge tone={statusToneClass}>{status}</Badge>
      </div>

      {/* Título */}
      <h3 className="truncate text-[14px] font-semibold text-[var(--color-text-primary)]">
        {title}
      </h3>

      {/* Descripción — 1 línea */}
      <p className="text-[12px] text-[var(--color-text-secondary)] truncate">
        {description}
      </p>

      {/* Meta */}
      <p className="text-[11px] text-[var(--color-text-disabled)] truncate">
        {meta}
      </p>

      {/* CTA */}
      {disabled ? (
        <div className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-text-disabled)]">
          Próximo <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
      ) : (
        <Link
          to={to}
          className={`inline-flex items-center gap-1 text-[12px] font-semibold transition-colors duration-150 hover:text-[var(--color-accent-hover)] ${accentClass}`}
        >
          Entrar <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      )}
    </Card>
  );
}
