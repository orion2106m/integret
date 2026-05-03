import { useMemo } from "react";
import type { RegistrationRecord } from "../../types/registration.types";

interface AdminDashboardProps {
  records: RegistrationRecord[];
  isLoading?: boolean;
}

interface StatCard {
  label: string;
  value: number;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

export default function AdminDashboard({
  records,
  isLoading = false,
}: AdminDashboardProps) {
  const stats = useMemo(() => {
    const borradores = records.filter((r) => r.estado === "borrador").length;
    const pendientes = records.filter(
      (r) => r.estado === "pendiente_revision",
    ).length;
    const aprobados = records.filter((r) => r.estado === "aprobado").length;
    const rechazados = records.filter((r) => r.estado === "rechazado").length;
    const archivados = records.filter((r) => r.estado === "archivado").length;

    const errorRate =
      records.length > 0 ? Math.round((rechazados / records.length) * 100) : 0;

    return {
      borradores,
      pendientes,
      aprobados,
      rechazados,
      archivados,
      total: records.length,
      errorRate,
    };
  }, [records]);

  const statCards: StatCard[] = [
    {
      label: "En Progreso",
      value: stats.borradores,
      color: "text-[#4ecdc4]",
      bgColor: "bg-[rgba(78,205,196,0.12)]",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      label: "Pendientes Revisión",
      value: stats.pendientes,
      color: "text-[#f0ad4e]",
      bgColor: "bg-[rgba(240,173,78,0.12)]",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Aprobados",
      value: stats.aprobados,
      color: "text-[#5cb85c]",
      bgColor: "bg-[rgba(92,184,92,0.12)]",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    {
      label: "Rechazados",
      value: stats.rechazados,
      color: "text-[#d9534f]",
      bgColor: "bg-[rgba(217,83,79,0.12)]",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text)]">
            Panel Administrativo
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Estadísticas en vivo de registros y actividad
          </p>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#4ecdc4]" />
            Sincronizando...
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`transform transition-all duration-300 hover:scale-105 anim-fade-up`}
          >
            <article
              className={`relative overflow-hidden rounded-2xl border border-[var(--color-border)] p-6 backdrop-blur-sm hover:border-[rgba(108,99,255,0.5)] ${stat.bgColor}`}
            >
              {/* Background Gradient */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-16 w-16 rounded-full blur-2xl" />

              {/* Icon */}
              <div className={`inline-flex rounded-lg p-2 ${stat.bgColor}`}>
                <span className={`${stat.color}`}>{stat.icon}</span>
              </div>

              {/* Content */}
              <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                {stat.label}
              </p>
              <p className={`mt-2 text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </p>

              {/* Trend Indicator */}
              <div className="mt-2 text-xs text-[var(--color-text-muted)]">
                {stat.value > 0 ? (
                  <span className="text-[#4ecdc4]">
                    ↑ {stat.value} {stat.value === 1 ? "registro" : "registros"}
                  </span>
                ) : (
                  <span>Sin registros</span>
                )}
              </div>
            </article>
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Total Summary */}
        <article className="rounded-2xl border border-[var(--color-border)] bg-[linear-gradient(135deg,rgba(108,99,255,0.12),rgba(78,205,196,0.12))] p-6 anim-fade-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                Total de Registros
              </p>
              <p className="mt-2 text-4xl font-bold text-[var(--color-accent-violet)]">
                {stats.total}
              </p>
            </div>
            <div className="rounded-lg bg-[rgba(108,99,255,0.2)] p-3">
              <svg
                className="h-8 w-8 text-[#6c63ff]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Aprobados
              </p>
              <p className="mt-1 text-lg font-semibold text-[#5cb85c]">
                {stats.aprobados}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Archivados
              </p>
              <p className="mt-1 text-lg font-semibold text-[var(--color-text-muted)]">
                {stats.archivados}
              </p>
            </div>
          </div>
        </article>

        {/* Error Rate */}
        <article className="rounded-2xl border border-[var(--color-border)] bg-[linear-gradient(135deg,rgba(217,83,79,0.1),rgba(240,173,78,0.1))] p-6 anim-fade-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                Tasa de Error
              </p>
              <p className="mt-2 text-4xl font-bold text-[#d9534f]">
                {stats.errorRate}%
              </p>
            </div>
            <div className="rounded-lg bg-[rgba(217,83,79,0.2)] p-3">
              <svg
                className="h-8 w-8 text-[#d9534f]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-[var(--color-text-muted)]">
              {stats.rechazados} de {stats.total} registros rechazados
            </p>
            {/* Progress Bar */}
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
              <div
                className="h-full bg-gradient-to-r from-[#d9534f] to-[#f0ad4e] transition-all duration-500"
                style={{ width: `${stats.errorRate}%` }}
              />
            </div>
          </div>
        </article>
      </div>

      {/* Activity Status */}
      <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 anim-fade-up">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
          Estado de Actividad
        </h3>
        <div className="space-y-3">
          {[
            {
              name: "En Progreso",
              count: stats.borradores,
              color: "bg-[#4ecdc4]",
              percentage: (stats.borradores / stats.total) * 100 || 0,
            },
            {
              name: "Pendiente Revisión",
              count: stats.pendientes,
              color: "bg-[#f0ad4e]",
              percentage: (stats.pendientes / stats.total) * 100 || 0,
            },
            {
              name: "Aprobado",
              count: stats.aprobados,
              color: "bg-[#5cb85c]",
              percentage: (stats.aprobados / stats.total) * 100 || 0,
            },
            {
              name: "Rechazado",
              count: stats.rechazados,
              color: "bg-[#d9534f]",
              percentage: (stats.rechazados / stats.total) * 100 || 0,
            },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <span className="min-w-[140px] text-sm font-medium text-[var(--color-text-muted)]">
                {item.name}
              </span>
              <div className="flex-1 overflow-hidden rounded-full bg-[var(--color-surface-2)] h-2">
                <div
                  className={`h-full transition-all duration-500 ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="min-w-[40px] text-right text-sm font-medium text-[var(--color-text)]">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
