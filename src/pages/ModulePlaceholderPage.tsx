import { ArrowLeftRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";

export interface ModulePlaceholderPageProps {
  moduleName?: string;
}

export default function ModulePlaceholderPage({
  moduleName = "Módulo",
}: ModulePlaceholderPageProps) {
  return (
    <section className="flex min-h-[calc(100vh-160px)] items-center justify-center p-4">
      <Card className="surface-elevated w-full max-w-xl p-6 text-center md:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </div>
        <Badge tone="accent" className="mt-4">
          En progreso
        </Badge>
        <h2 className="mt-4 text-[28px] font-bold leading-tight text-[var(--color-text-primary)]">
          {moduleName}
        </h2>
        <p className="mt-3 text-[15px] text-[var(--color-text-secondary)]">
          Este módulo está en construcción. El shell ya está preparado para
          integrarlo sin afectar la navegación global.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-border-accent)] bg-[var(--color-accent)] px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-[var(--color-accent-hover)]"
        >
          <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
          Volver al dashboard
        </Link>
      </Card>
    </section>
  );
}
