import { useMemo, useState } from "react";
import { ClientFormPage } from "../pages/ClientFormPage";
import { ClientListPage } from "../pages/ClientListPage";
import { SupplierFormPage } from "../pages/SupplierFormPage";
import { SupplierListPage } from "../pages/SupplierListPage";

type RouteKey =
  | "clients-list"
  | "clients-new"
  | "suppliers-list"
  | "suppliers-new";

const routeLabels: Record<RouteKey, string> = {
  "clients-list": "Clientes - Listado",
  "clients-new": "Clientes - Nuevo",
  "suppliers-list": "Proveedores - Listado",
  "suppliers-new": "Proveedores - Nuevo",
};

export function RegistrationRouter() {
  const [tenantId, setTenantId] = useState("tenant-demo-01");
  const [route, setRoute] = useState<RouteKey>("clients-list");

  const content = useMemo(() => {
    if (route === "clients-list") return <ClientListPage tenantId={tenantId} />;
    if (route === "clients-new") return <ClientFormPage tenantId={tenantId} />;
    if (route === "suppliers-list")
      return <SupplierListPage tenantId={tenantId} />;
    return <SupplierFormPage tenantId={tenantId} />;
  }, [route, tenantId]);

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-4">
      <header className="space-y-3 rounded-xl bg-slate-900 p-4 text-white">
        <h1 className="text-2xl font-bold">Registration Module</h1>
        <p className="text-sm text-slate-200">
          Gestion de Clientes y Proveedores con soporte multi-tenant
        </p>

        <div className="max-w-sm">
          <label
            htmlFor="tenantId"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300"
          >
            Tenant activo
          </label>
          <input
            id="tenantId"
            value={tenantId}
            onChange={(event) => setTenantId(event.target.value)}
            className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white"
          />
        </div>
      </header>

      <nav className="grid gap-2 md:grid-cols-4">
        {(Object.keys(routeLabels) as RouteKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setRoute(key)}
            className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
              route === key
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {routeLabels[key]}
          </button>
        ))}
      </nav>

      <section>{content}</section>
    </main>
  );
}
