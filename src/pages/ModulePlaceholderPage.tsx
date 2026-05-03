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
    <section className="anim-fade-up flex min-h-[calc(100vh-160px)] items-center justify-center p-4">
      <Card className="w-full max-w-xl p-6 text-center md:p-8">
        <Badge tone="violet">En progreso</Badge>
        <h2 className="mt-4 text-2xl font-semibold text-[var(--color-text)]">
          {moduleName}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Este módulo está en construcción. El shell ya está preparado para
          integrarlo sin afectar la navegación global.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent-violet)] px-4 text-sm font-medium text-white hover:brightness-110"
        >
          Volver al dashboard
        </Link>
      </Card>
    </section>
  );
}
