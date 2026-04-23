import { useState } from "react";
import { ClientBaseForm } from "../components/clients/ClientBaseForm";
import { useClientStore } from "../store/clientStore";
import type { ClientType } from "../types/formConfig.types";

interface ClientFormPageProps {
  tenantId: string;
}

export function ClientFormPage({ tenantId }: ClientFormPageProps) {
  const [clientType, setClientType] = useState<ClientType>("natural");
  const [feedback, setFeedback] = useState<string | null>(null);
  const { createClient } = useClientStore();

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Nuevo cliente</h2>
      </header>

      <div className="max-w-xs">
        <label
          className="mb-1 block text-sm font-medium text-slate-700"
          htmlFor="clientType"
        >
          Tipo de cliente
        </label>
        <select
          id="clientType"
          value={clientType}
          onChange={(event) => setClientType(event.target.value as ClientType)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="natural">Persona natural</option>
          <option value="company">Empresa</option>
        </select>
      </div>

      {feedback ? (
        <p className="rounded-md bg-emerald-50 p-2 text-sm text-emerald-700">
          {feedback}
        </p>
      ) : null}

      <ClientBaseForm
        tenantId={tenantId}
        clientType={clientType}
        onSubmit={async (values) => {
          await createClient({
            tenantId,
            clientType,
            fullName: values.fullName,
            documentType: values.documentType as
              | "CC"
              | "CE"
              | "PP"
              | "NIT"
              | "RUT",
            documentNumber: values.documentNumber,
            address: values.address,
            phone: values.phone,
            email: values.email,
            customFields: values,
          });

          setFeedback("Cliente registrado correctamente");
        }}
      />
    </div>
  );
}
