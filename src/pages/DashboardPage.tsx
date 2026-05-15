import { Activity, Users, Workflow } from "lucide-react";
import ModuleCard from "../components/shell/ModuleCard";
import { Card } from "../components/ui/Card";
import type { ModuleDefinition } from "../types/shell.types";

type ProgressTone = "accent" | "success" | "info";

interface DashboardStat {
  titulo: string;
  valor: string;
  descripcion: string;
  progreso: number;
  tono: ProgressTone;
  icon: typeof Workflow;
}

const modules: Array<
  ModuleDefinition & {
    meta: string;
    disabled?: boolean;
    statusTone: "success" | "warning" | "disabled";
  }
> = [
  {
    key: "assistance",
    nombre: "Asistencia",
    descripcion: "Control de turnos y disponibilidad operativa.",
    ruta: "/assistance",
    icono: "assistance",
    acento: "violet",
    estado: "Activo",
    statusTone: "success",
    meta: "243 registros · Última actividad: hace 2h",
  },
  {
    key: "registration",
    nombre: "Registro",
    descripcion: "Gestión de clientes, perfiles y solicitudes.",
    ruta: "/registration",
    icono: "registration",
    acento: "teal",
    estado: "Activo",
    statusTone: "success",
    meta: "118 solicitudes · Última actividad: hace 18m",
  },
  {
    key: "filed",
    nombre: "Radicado",
    descripcion: "Trazabilidad y seguimiento documental.",
    ruta: "/filed",
    icono: "filed",
    acento: "violet",
    estado: "Config",
    statusTone: "warning",
    meta: "27 procesos · Última actividad: ayer",
  },
  {
    key: "contact",
    nombre: "Contacto",
    descripcion: "Canales de interacción y soporte comercial.",
    ruta: "/contact",
    icono: "contact",
    acento: "teal",
    estado: "Config",
    statusTone: "warning",
    meta: "84 interacciones · Última actividad: hace 3h",
  },
  {
    key: "contracts",
    nombre: "Contratos",
    descripcion: "Gestión contractual y vigencias.",
    ruta: "/contracts",
    icono: "contracts",
    acento: "violet",
    estado: "Próximo",
    statusTone: "disabled",
    meta: "Módulo en cola para la siguiente iteración",
    disabled: true,
  },
  {
    key: "billing",
    nombre: "Facturación",
    descripcion: "Ciclos de cobro, recaudo y conciliación.",
    ruta: "/billing",
    icono: "billing",
    acento: "teal",
    estado: "Próximo",
    statusTone: "disabled",
    meta: "Módulo en cola para la siguiente iteración",
    disabled: true,
  },
];

const stats: DashboardStat[] = [
  {
    titulo: "Módulos activos",
    valor: "06",
    descripcion: "Conectados al shell",
    progreso: 82,
    tono: "accent",
    icon: Workflow,
  },
  {
    titulo: "Usuarios conectados",
    valor: "--",
    descripcion: "Disponible con autenticación",
    progreso: 26,
    tono: "success",
    icon: Users,
  },
  {
    titulo: "Eventos del sistema",
    valor: "--",
    descripcion: "Sin eventos recientes",
    progreso: 18,
    tono: "info",
    icon: Activity,
  },
];

function ProgressBar({
  progress,
  tone,
}: {
  progress: number;
  tone: ProgressTone;
}) {
  const toneClass =
    tone === "accent"
      ? "bg-[var(--color-accent)]"
      : tone === "success"
        ? "bg-[var(--color-success)]"
        : "bg-[var(--color-info)]";

  return (
    <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--color-bg-elevated)]">
      <span
        className={`block h-full rounded-full ${toneClass}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function MetricCard({
  titulo,
  valor,
  descripcion,
  progreso,
  tono,
  icon: Icon,
}: DashboardStat) {
  return (
    <Card className="p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
            {titulo}
          </p>
          <p className="mt-2 text-[32px] font-bold leading-none text-[var(--color-accent)]">
            {valor}
          </p>
          <p className="mt-1.5 text-[13px] text-[var(--color-text-secondary)]">
            {descripcion}
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--color-border)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]">
          <Icon className="h-4 w-4 stroke-[1.8]" aria-hidden="true" />
        </div>
      </div>
      <ProgressBar progress={progreso} tone={tono} />
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <section className="w-full space-y-3">
      {/* Header mínimo */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-secondary)]">
          Zenith Shell
        </p>
        <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Panel principal
        </h1>
        <p className="text-[13px] text-[var(--color-text-secondary)]">
          Accede a los módulos administrativos, operativos y contables del
          ecosistema Zenith.
        </p>
      </div>

      {/* Métricas */}
      <div className="grid w-full grid-cols-3 gap-3">
        {stats.map((item) => (
          <MetricCard key={item.titulo} {...item} />
        ))}
      </div>

      {/* Separador */}
      <div className="flex items-center gap-3 border-t border-[var(--color-border)] pt-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
          Módulos del ecosistema
        </p>
      </div>

      {/* Grid de módulos */}
      <div className="grid w-full grid-cols-3 gap-3">
        {modules.map((module) => (
          <ModuleCard
            key={module.key}
            title={module.nombre}
            description={module.descripcion}
            to={module.ruta}
            icon={module.icono}
            accent={module.acento}
            status={module.estado}
            statusTone={module.statusTone}
            meta={module.meta}
            disabled={module.disabled}
          />
        ))}
      </div>
    </section>
  );
}
