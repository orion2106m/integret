import { format } from "date-fns";
import type {
  RegistrationRecord,
  RegistrationStatus,
} from "../../types/registration.types";

interface RegistrationListProps {
  records: RegistrationRecord[];
  isLoading?: boolean;
  onEdit?: (record: RegistrationRecord) => void;
  onDelete?: (record: RegistrationRecord) => void;
  onStatusChange?: (
    record: RegistrationRecord,
    newStatus: RegistrationStatus,
  ) => void;
}

const statusBadgeStyle: Record<RegistrationStatus, React.CSSProperties> = {
  borrador: {
    background: "rgba(160,160,180,0.15)",
    color: "var(--color-text-muted)",
  },
  pendiente_revision: { background: "rgba(255,193,7,0.15)", color: "#ffc107" },
  rechazado: {
    background: "rgba(255,107,107,0.15)",
    color: "var(--color-danger)",
  },
  aprobado: {
    background: "rgba(78,205,196,0.15)",
    color: "var(--color-accent-teal)",
  },
  archivado: {
    background: "rgba(160,160,180,0.10)",
    color: "var(--color-text-muted)",
  },
};

const statusLabels: Record<RegistrationStatus, string> = {
  borrador: "Borrador",
  pendiente_revision: "Pendiente Revisión",
  rechazado: "Rechazado",
  aprobado: "Aprobado",
  archivado: "Archivado",
};

export default function RegistrationList({
  records,
  isLoading = false,
  onEdit,
  onDelete,
  onStatusChange,
}: RegistrationListProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          Cargando registros...
        </p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center anim-fade-up">
        <p className="text-[var(--color-text-muted)]">
          No hay registros disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] anim-fade-up">
      <table className="w-full min-w-[860px]">
        <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
              Documento
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
              Nombre
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
              Email
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
              Estado
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
              Creado
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="text-left">
          {records.map((record, index) => (
            <tr
              key={record.id}
              className="border-b border-[var(--color-border)] transition-colors duration-200 hover:bg-[rgba(108,99,255,0.08)] align-middle"
              style={{ animationDelay: `${index * 45}ms` }}
            >
              <td className="px-6 py-4 text-sm text-[var(--color-text)] align-middle text-center">
                {record.tipo_documento}: {record.documento}
              </td>
              <td className="px-6 py-4 text-sm text-[var(--color-text)] align-middle text-center">
                {record.nombre} {record.apellido}
              </td>
              <td className="px-6 py-4 text-sm text-[var(--color-text-muted)] align-middle text-center">
                {record.email}
              </td>
              <td className="px-6 py-4 text-sm align-middle text-center">
                <span
                  style={statusBadgeStyle[record.estado]}
                  className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                >
                  {statusLabels[record.estado]}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-[var(--color-text-muted)] align-middle text-center">
                {format(new Date(record.created_at), "dd/MM/yyyy HH:mm")}
              </td>
              <td className="px-6 py-4 text-sm align-middle text-center">
                <div className="flex justify-center gap-2">
                  {onEdit && record.estado === "borrador" && (
                    <button
                      onClick={() => onEdit(record)}
                      className="rounded-md px-2 py-1 text-[var(--color-accent-violet)] transition hover:bg-[rgba(108,99,255,0.15)] align-middle"
                    >
                      Editar
                    </button>
                  )}
                  {onDelete && record.estado === "borrador" && (
                    <button
                      onClick={() => onDelete(record)}
                      className="rounded-md px-2 py-1 text-[var(--color-danger)] transition hover:bg-[rgba(255,107,107,0.14)] align-middle"
                    >
                      Eliminar
                    </button>
                  )}
                  {onStatusChange && record.estado === "borrador" && (
                    <button
                      onClick={() =>
                        onStatusChange(record, "pendiente_revision")
                      }
                      className="rounded-md px-2 py-1 text-[var(--color-accent-teal)] transition hover:bg-[rgba(78,205,196,0.14)] align-middle"
                    >
                      Enviar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
