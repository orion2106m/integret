import { useFormConfig } from "../../hooks/useFormConfig";
import type { ClientType } from "../../types/formConfig.types";
import { DynamicForm } from "../shared/DynamicForm";

interface ClientBaseFormProps {
  tenantId: string;
  clientType: ClientType;
  onSubmit: (values: Record<string, string>) => Promise<void>;
}

export function ClientBaseForm({
  tenantId,
  clientType,
  onSubmit,
}: ClientBaseFormProps) {
  const { config, loading, error, source, placement } = useFormConfig(
    tenantId,
    "client",
    clientType,
  );

  if (loading || !config) {
    return <p className="text-sm text-slate-500">Cargando configuracion...</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">
        Conexion: {source ?? "mock"} | Ubicacion: {placement ?? "shared-db"}
      </p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <DynamicForm
        config={config}
        submitLabel="Guardar cliente"
        onSubmit={onSubmit}
      />
    </div>
  );
}
