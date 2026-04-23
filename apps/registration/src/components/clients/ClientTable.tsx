import type { Client } from "../../types/client.types";
import { ContractStatusBadge } from "../shared/ContractStatusBadge";
import { EntityStatusBadge } from "../shared/EntityStatusBadge";

function maskDocument(value: string): string {
  if (value.length <= 4) return value;
  return `${"*".repeat(Math.max(value.length - 4, 1))}${value.slice(-4)}`;
}

interface ClientTableProps {
  clients: Client[];
}

export function ClientTable({ clients }: ClientTableProps) {
  return (
    <div className="overflow-auto rounded-lg border border-slate-200">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-slate-50 text-left text-slate-700">
          <tr>
            <th className="px-4 py-3 font-semibold">Nombre</th>
            <th className="px-4 py-3 font-semibold">Documento</th>
            <th className="px-4 py-3 font-semibold">Correo</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
            <th className="px-4 py-3 font-semibold">Contrato</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{client.fullName}</td>
              <td className="px-4 py-3">
                {maskDocument(client.documentNumber)}
              </td>
              <td className="px-4 py-3">{client.email}</td>
              <td className="px-4 py-3">
                <EntityStatusBadge status={client.status} />
              </td>
              <td className="px-4 py-3">
                {client.contractReference ? (
                  <ContractStatusBadge
                    status={client.contractReference.contractStatus}
                  />
                ) : (
                  <span className="text-slate-400">Sin contrato</span>
                )}
              </td>
            </tr>
          ))}

          {clients.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                No hay clientes para los filtros seleccionados.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
