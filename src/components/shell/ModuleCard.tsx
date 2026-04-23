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
}

function ModuleIconView({ icon }: { icon: ModuleIcon }) {
  const common = "h-5 w-5";

  if (icon === "assistance") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 5h16v14H4z" />
        <path d="M8 9h8m-8 4h6" />
      </svg>
    );
  }

  if (icon === "registration") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M7 3h10v18H7z" />
        <path d="M10 7h4m-4 4h4m-4 4h4" />
      </svg>
    );
  }

  if (icon === "filed") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v4h4" />
      </svg>
    );
  }

  if (icon === "contact") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="8" r="3" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    );
  }

  if (icon === "contracts") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M5 4h14v16H5z" />
        <path d="M8 8h8m-8 4h8m-8 4h5" />
      </svg>
    );
  }

  if (icon === "billing") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 7h16v10H4z" />
        <path d="M4 11h16" />
      </svg>
    );
  }

  return (
    <svg
      className={common}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 13h8V3H3zm10 8h8v-6h-8zM3 21h8v-6H3zm10-8h8V3h-8z" />
    </svg>
  );
}

export default function ModuleCard({
  title,
  description,
  to,
  icon,
  accent,
  status,
}: ModuleCardProps) {
  const accentClass =
    accent === "violet"
      ? "text-[var(--color-accent-violet)]"
      : "text-[var(--color-accent-teal)]";
  const accentBorderClass =
    accent === "violet"
      ? "border-[rgba(108,99,255,0.3)]"
      : "border-[rgba(78,205,196,0.3)]";
  const badgeTone = accent === "violet" ? "violet" : "teal";

  return (
    <Card
      className={`anim-fade-up border-l-2 p-4 transition-colors duration-200 hover:bg-[var(--color-surface-2)] ${accentBorderClass}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={`inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] ${accentClass}`}
        >
          <ModuleIconView icon={icon} />
        </div>
        <Badge tone={badgeTone}>{status}</Badge>
      </div>

      <h3 className="text-base font-semibold text-[var(--color-text)]">
        {title}
      </h3>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        {description}
      </p>

      <Link
        to={to}
        className={`mt-4 inline-flex items-center text-sm font-semibold ${accentClass}`}
      >
        Entrar
        <svg
          className="ml-1 h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      </Link>
    </Card>
  );
}
