import type { ContractStatus } from "../../types/contract.types";

const labelMap: Record<ContractStatus, string> = {
  draft: "Borrador",
  active: "Activo",
  suspended: "Suspendido",
  expired: "Vencido",
  terminated: "Terminado",
};

const classMap: Record<ContractStatus, string> = {
  draft: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  suspended: "bg-yellow-100 text-yellow-700",
  expired: "bg-orange-100 text-orange-700",
  terminated: "bg-gray-200 text-gray-700",
};

interface ContractStatusBadgeProps {
  status: ContractStatus;
}

export function ContractStatusBadge({ status }: ContractStatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${classMap[status]}`}
    >
      {labelMap[status]}
    </span>
  );
}
