import type { ClientStatus } from "../../types/client.types";
import type { SupplierStatus } from "../../types/supplier.types";

type EntityStatus = ClientStatus | SupplierStatus;

const labelMap: Record<EntityStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
  suspended: "Suspendido",
  blacklisted: "Lista negra",
};

const classMap: Record<EntityStatus, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-700",
  suspended: "bg-yellow-100 text-yellow-800",
  blacklisted: "bg-red-100 text-red-700",
};

interface EntityStatusBadgeProps {
  status: EntityStatus;
}

export function EntityStatusBadge({ status }: EntityStatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${classMap[status]}`}
    >
      {labelMap[status]}
    </span>
  );
}
