import ModuleCard from "../components/shell/ModuleCard";
import { Card } from "../components/ui/Card";
import type { ModuleDefinition, StatCard } from "../types/shell.types";

const modules: ModuleDefinition[] = [
  {
    key: "assistance",
    nombre: "Asistencia",
    descripcion: "Control de turnos y disponibilidad operativa.",
    ruta: "/assistance",
    icono: "assistance",
    acento: "violet",
    estado: "Activo",
  },
  {
    key: "registration",
    nombre: "Registro",
    descripcion: "Gestión de clientes, perfiles y solicitudes.",
    ruta: "/registration",
    icono: "registration",
    acento: "teal",
    estado: "Activo",
  },
  {
    key: "filed",
    nombre: "Radicado",
    descripcion: "Trazabilidad y seguimiento documental.",
    ruta: "/filed",
    icono: "filed",
    acento: "violet",
    estado: "Configuración",
  },
  {
    key: "contact",
    nombre: "Contacto",
    descripcion: "Canales de interacción y soporte comercial.",
    ruta: "/contact",
    icono: "contact",
    acento: "teal",
    estado: "Configuración",
  },
  {
    key: "contracts",
    nombre: "Contratos",
    descripcion: "Gestión contractual y vigencias.",
    ruta: "/contracts",
    icono: "contracts",
    acento: "violet",
    estado: "Próximo",
  },
  {
    key: "billing",
    nombre: "Facturación",
    descripcion: "Ciclos de cobro, recaudo y conciliación.",
    ruta: "/billing",
    icono: "billing",
    acento: "teal",
    estado: "Próximo",
  },
];

const stats: StatCard[] = [
  {
    titulo: "Módulos activos",
    valor: "06",
    descripcion: "Conectados al shell",
  },
  {
    titulo: "Usuarios conectados",
    valor: "--",
    descripcion: "Disponible cuando llegue autenticación",
  },
  {
    titulo: "Eventos del sistema",
    valor: "--",
    descripcion: "Pendiente de instrumentación",
  },
];

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <header className="surface-1 anim-fade-up rounded-[var(--radius-md)] p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
          Zenith shell
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[var(--color-text)] md:text-3xl">
          Panel principal
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-muted)]">
          Accede rápidamente a los módulos administrativos, operativos y
          contables del ecosistema Zenith.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item, idx) => (
          <Card key={item.titulo} className="anim-fade-up p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
              {item.titulo}
            </p>
            <p className="mt-3 text-2xl font-semibold text-[var(--color-text)]">
              {item.valor}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {item.descripcion}
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
              <span
                className={`block h-full rounded-full ${idx % 2 === 0 ? "bg-[var(--color-accent-violet)]" : "bg-[var(--color-accent-teal)]"}`}
                style={{ width: idx === 0 ? "82%" : "26%" }}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <ModuleCard
            key={module.key}
            title={module.nombre}
            description={module.descripcion}
            to={module.ruta}
            icon={module.icono}
            accent={module.acento}
            status={module.estado}
          />
        ))}
      </div>
    </section>
  );
}
