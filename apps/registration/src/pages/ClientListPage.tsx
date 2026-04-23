import { ClientTable } from "../components/clients/ClientTable";
import { useClients } from "../hooks/useClients";

interface ClientListPageProps {
  tenantId: string;
}

export function ClientListPage({ tenantId }: ClientListPageProps) {
  const {
    items,
    total,
    loading,
    error,
    query,
    setQuery,
    status,
    setStatus,
    clientType,
    setClientType,
  } = useClients(tenantId);

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Clientes</h2>
        <p className="text-sm text-slate-600">Total: {total}</p>
      </header>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="Buscar por nombre, documento o correo"
          aria-label="Buscar clientes"
        />

        <select
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={status ?? "all"}
          onChange={(event) => setStatus(event.target.value as typeof status)}
          aria-label="Filtrar por estado"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="suspended">Suspendido</option>
        </select>

        <select
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={clientType ?? "all"}
          onChange={(event) =>
            setClientType(event.target.value as typeof clientType)
          }
          aria-label="Filtrar por tipo de cliente"
        >
          <option value="all">Todos los tipos</option>
          <option value="natural">Persona natural</option>
          <option value="company">Empresa</option>
        </select>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Cargando...</p> : null}

      <ClientTable clients={items} />
    </div>
  );
}
