import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-6">
      <Card className="anim-fade-up w-full max-w-lg p-8 text-center">
        <p className="text-sm uppercase tracking-wide text-[var(--color-text-muted)]">
          Error 404
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--color-text)]">
          Página no encontrada
        </h1>
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
          La ruta solicitada no existe o fue movida a otro módulo.
        </p>
        <Button className="mt-6" onClick={() => navigate("/")}>
          Regresar al dashboard
        </Button>
      </Card>
    </section>
  );
}
