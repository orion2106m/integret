import { useEffect, useState } from "react";
import FormModal from "../components/shared/FormModal";
import RegistrationForm from "../components/shared/RegistrationForm";
import RegistrationList from "../components/shared/RegistrationList";
import { registrationService } from "../services/registrationService";
import { useRegistrationStore } from "../store/registrationStore";
import type {
  RegistrationFormData,
  RegistrationRecord,
} from "../types/registration.types";

interface RegistrationPageProps {
  tenantId: string;
  userId: string;
}

export default function RegistrationPage({
  tenantId,
  userId,
}: RegistrationPageProps) {
  const {
    records,
    isLoading,
    error,
    showForm,
    formMode,
    currentRecord,
    setRecords,
    setIsLoading,
    setError,
    setShowForm,
    setFormMode,
    setCurrentRecord,
  } = useRegistrationStore();

  const [localError, setLocalError] = useState<string | null>(null);

  // Cargar registros
  useEffect(() => {
    loadRecords();
  }, [tenantId]);

  const loadRecords = async () => {
    try {
      setIsLoading(true);
      setLocalError(null);
      const result = await registrationService.listRegistrationsByTenant(
        tenantId,
        { limit: 20 },
      );
      setRecords(result.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error cargando registros";
      setLocalError(message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setCurrentRecord(null);
    setFormMode("create");
    setShowForm(true);
  };

  const handleEdit = (record: RegistrationRecord) => {
    setCurrentRecord(record);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormMode(null);
    setCurrentRecord(null);
  };

  const handleFormSubmit = async (data: RegistrationFormData) => {
    try {
      setIsLoading(true);
      setLocalError(null);

      if (formMode === "create") {
        await registrationService.createRegistration(tenantId, data, userId);
      } else if (formMode === "edit" && currentRecord) {
        await registrationService.updateRegistration(
          tenantId,
          currentRecord.id,
          data,
          userId,
        );
      }

      handleCancel();
      await loadRecords();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al guardar";
      setLocalError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (record: RegistrationRecord) => {
    if (
      !window.confirm(
        "¿Está seguro de que desea eliminar este registro? Esta acción no se puede deshacer.",
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      setLocalError(null);
      await registrationService.deleteRegistration(tenantId, record.id);
      await loadRecords();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al eliminar";
      setLocalError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[linear-gradient(130deg,rgba(108,99,255,0.18),rgba(78,205,196,0.12)_52%,rgba(255,255,255,0.03))] p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[rgba(108,99,255,0.22)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-10 h-32 w-32 rounded-full bg-[rgba(78,205,196,0.2)] blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            Modulo de Administración
          </p>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Gestión de Registros
          </h1>
          <p className="mt-3 max-w-2xl text-base text-[var(--color-text-muted)] md:text-lg">
            Panel administrativo para gestionar registros de clientes, perfiles
            y solicitudes con validaciones en tiempo real y estadísticas en
            vivo.
          </p>
        </div>
      </header>

      {/* Error Alert */}
      {(localError || error) && (
        <div className="rounded-xl border border-[rgba(255,107,107,0.45)] bg-[rgba(255,107,107,0.12)] p-4 anim-fade-up">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-[#ffb0b0] flex-shrink-0 mt-0.5"
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
            <p className="text-sm text-[#ffb0b0]">{localError || error}</p>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 anim-fade-up">
        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateNew}
            disabled={isLoading || showForm}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--color-accent-violet)] to-[#5d5ae6] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(108,99,255,0.34)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(108,99,255,0.5)] disabled:opacity-50 disabled:hover:translate-y-0"
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nuevo Registro
          </button>
        </div>
        <button
          onClick={loadRecords}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 py-2.5 text-sm font-medium transition-all hover:bg-[var(--color-surface)] hover:brightness-110 disabled:opacity-50"
        >
          <svg
            className={`h-4 w-4 transition-transform ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isLoading ? "Sincronizando..." : "Actualizar"}
        </button>
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={showForm}
        title={formMode === "create" ? "Nuevo Registro" : "Editar Registro"}
        subtitle={
          formMode === "create"
            ? "Completa el formulario para crear un nuevo registro"
            : "Actualiza la información del registro"
        }
        onClose={handleCancel}
      >
        <RegistrationForm
          initialData={currentRecord}
          isLoading={isLoading}
          mode={formMode || "create"}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      </FormModal>

      {/* List Section */}
      <section className="space-y-3 anim-fade-up mt-4">
        <div className="flex items-center justify-between px-1 pt-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            Registros
          </h2>
          <span className="text-xs text-[var(--color-text-muted)]">
            {records.length} {records.length === 1 ? "registro" : "registros"}
          </span>
        </div>
        <RegistrationList
          records={records}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={(_, status) => {
            // TODO: Implementar cambio de estado
            console.log("Change status to:", status);
          }}
        />
      </section>
    </div>
  );
}
