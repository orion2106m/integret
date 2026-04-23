import type { Supplier } from "../../types/supplier.types";
import { ContractStatusBadge } from "../shared/ContractStatusBadge";
import { EntityStatusBadge } from "../shared/EntityStatusBadge";

function maskDocument(value: string): string {
  if (value.length <= 4) return value;
  return `${"*".repeat(Math.max(value.length - 4, 1))}${value.slice(-4)}`;
}

function maskAccount(value: string): string {
  if (value.length <= 4) return value;
  return `${value.slice(0, 2)}${"*".repeat(Math.max(value.length - 4, 1))}${value.slice(-2)}`;
}

interface SupplierTableProps {
  suppliers: Supplier[];
}

export function SupplierTable({ suppliers }: SupplierTableProps) {
  return (
    <div className="overflow-auto rounded-lg border border-slate-200">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-slate-50 text-left text-slate-700">
          <tr>
            <th className="px-4 py-3 font-semibold">Proveedor</th>
            <th className="px-4 py-3 font-semibold">Documento</th>
            <th className="px-4 py-3 font-semibold">Categoria</th>
            <th className="px-4 py-3 font-semibold">Cuenta bancaria</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
            <th className="px-4 py-3 font-semibold">Contrato</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{supplier.fullName}</td>
              <td className="px-4 py-3">
                {maskDocument(supplier.documentNumber)}
              </td>
              <td className="px-4 py-3">{supplier.category}</td>
              <td className="px-4 py-3">
                {maskAccount(supplier.bankAccount.accountNumber)}
              </td>
              <td className="px-4 py-3">
                <EntityStatusBadge status={supplier.status} />
              </td>
              <td className="px-4 py-3">
                {supplier.contractReference ? (
                  <ContractStatusBadge
                    status={supplier.contractReference.contractStatus}
                  />
                ) : (
                  <span className="text-slate-400">Sin contrato</span>
                )}
              </td>
            </tr>
          ))}

          {suppliers.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-center text-slate-500" colSpan={6}>
                No hay proveedores para los filtros seleccionados.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
