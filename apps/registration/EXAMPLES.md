/\*\*

- Ejemplo de uso del módulo de Registro
- Este archivo muestra cómo integrar el módulo en tu aplicación
  \*/

// ============================================================
// OPCIÓN 1: Usar la página completa
// ============================================================

import { useShellStore } from "@/store/shellStore";
import RegistrationPage from "@/apps/registration/src/pages/RegistrationPage";

export function Option1_CompleteModule() {
const { usuario } = useShellStore((state) => ({
usuario: state.usuario,
}));

return (
<RegistrationPage 
      tenantId="tenant-zenith-demo"
      userId={usuario.id}
    />
);
}

// ============================================================
// OPCIÓN 2: Usar solo el formulario
// ============================================================

import { useState } from "react";
import { registrationService } from "@/apps/registration/src/services/registrationService";
import RegistrationForm from "@/apps/registration/src/components/shared/RegistrationForm";
import type { RegistrationFormData } from "@/apps/registration/src/types/registration.types";

export function Option2_FormOnly() {
const [loading, setLoading] = useState(false);

const handleSubmit = async (data: RegistrationFormData) => {
setLoading(true);
try {
await registrationService.createRegistration(
"tenant-zenith-demo",
data,
"user-01"
);
alert("Registro guardado exitosamente");
} catch (error) {
alert(`Error: ${error instanceof Error ? error.message : "Desconocido"}`);
} finally {
setLoading(false);
}
};

return (
<RegistrationForm
      mode="create"
      isLoading={loading}
      onSubmit={handleSubmit}
    />
);
}

// ============================================================
// OPCIÓN 3: Usar solo el listado
// ============================================================

import { useEffect } from "react";
import RegistrationList from "@/apps/registration/src/components/shared/RegistrationList";
import type { RegistrationRecord } from "@/apps/registration/src/types/registration.types";

export function Option3_ListOnly() {
const [records, setRecords] = useState<RegistrationRecord[]>([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
const loadRecords = async () => {
setLoading(true);
try {
const { data } = await registrationService.listRegistrationsByTenant(
"tenant-zenith-demo",
{ limit: 20 }
);
setRecords(data);
} finally {
setLoading(false);
}
};

    loadRecords();

}, []);

const handleEdit = (record: RegistrationRecord) => {
console.log("Edit record:", record);
// Implementar lógica de edición
};

const handleDelete = async (record: RegistrationRecord) => {
if (window.confirm("¿Eliminar este registro?")) {
try {
await registrationService.deleteRegistration(
"tenant-zenith-demo",
record.id
);
setRecords(records.filter((r) => r.id !== record.id));
} catch (error) {
alert(`Error: ${error instanceof Error ? error.message : "Desconocido"}`);
}
}
};

return (
<RegistrationList
      records={records}
      isLoading={loading}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
);
}

// ============================================================
// OPCIÓN 4: Integración avanzada con Zustand
// ============================================================

import { useRegistrationStore } from "@/apps/registration/src/store/registrationStore";

export function Option4_AdvancedWithStore() {
const store = useRegistrationStore();

const handleLoadRecords = async () => {
store.setIsLoading(true);
store.setError(null);

    try {
      const { data, count } = await registrationService.listRegistrationsByTenant(
        "tenant-zenith-demo"
      );
      store.setRecords(data);
      store.setTotalCount(count);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      store.setError(message);
    } finally {
      store.setIsLoading(false);
    }

};

const handleStatusChange = async (newStatus: "rechazado" | "aprobado") => {
if (!store.currentRecord) return;

    const motivo = newStatus === "rechazado"
      ? window.prompt("Motivo del rechazo:")
      : undefined;

    if (newStatus === "rechazado" && !motivo) return;

    try {
      await registrationService.changeStatus(
        "tenant-zenith-demo",
        store.currentRecord.id,
        newStatus,
        motivo,
        "user-01"
      );
      await handleLoadRecords();
    } catch (error) {
      store.setError(error instanceof Error ? error.message : "Error desconocido");
    }

};

return (
<div className="space-y-4 p-6">
<button
        onClick={handleLoadRecords}
        disabled={store.isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
{store.isLoading ? "Cargando..." : "Cargar Registros"}
</button>

      {store.error && (
        <div className="p-4 bg-red-50 text-red-800 rounded">
          {store.error}
        </div>
      )}

      <div className="space-y-2">
        {store.records.map((record) => (
          <div key={record.id} className="p-4 border rounded">
            <p className="font-semibold">
              {record.nombre} {record.apellido}
            </p>
            <p className="text-sm text-gray-600">
              {record.tipo_documento}: {record.documento}
            </p>
            <p className="text-sm">
              Estado: <span className="font-medium">{record.estado}</span>
            </p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  store.setCurrentRecord(record);
                  handleStatusChange("aprobado");
                }}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Aprobar
              </button>
              <button
                onClick={() => {
                  store.setCurrentRecord(record);
                  handleStatusChange("rechazado");
                }}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Rechazar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

);
}

// ============================================================
// VALIDACIÓN DE DATOS
// ============================================================

import { validateRegistrationForm } from "@/apps/registration/src/schemas/registrationSchema";

export function ValidationExample() {
const testData = {
documento: "123", // Demasiado corto
tipo_documento: "CC",
nombre: "Juan",
apellido: "Pérez",
email: "invalid-email", // Email inválido
telefono: "123", // Teléfono muy corto
};

const { valid, errors } = validateRegistrationForm(testData);

console.log("Valid:", valid);
console.log("Errors:", errors);
// Output:
// Valid: false
// Errors: {
// documento: "El documento debe tener al menos 6 caracteres",
// email: "Email inválido",
// telefono: "Teléfono inválido"
// }
}

// ============================================================
// MANEJO DE ERRORES
// ============================================================

import { getSupabaseErrorMessage } from "../src/utils/supabase";

export async function ErrorHandlingExample() {
try {
// Simular error
throw new Error("Documento ya existe para este tenant");
} catch (error) {
const message = getSupabaseErrorMessage(error);
console.error("Error:", message);
}
}
