import { SupplierTable } from "../components/suppliers/SupplierTable";
import { useSuppliers } from "../hooks/useSuppliers";

interface SupplierListPageProps {
  tenantId: string;
}

export function SupplierListPage({ tenantId }: SupplierListPageProps) {
  const {
    items,
    total,
    loading,
    error,
    query,
    setQuery,
    status,
    setStatus,
    category,
    setCategory,
  } = useSuppliers(tenantId);

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Proveedores</h2>
        <p className="text-sm text-slate-600">Total: {total}</p>
      </header>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="Buscar por nombre, documento o correo"
          aria-label="Buscar proveedores"
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
          <option value="blacklisted">Lista negra</option>
        </select>

        <select
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={category ?? "all"}
          onChange={(event) =>
            setCategory(event.target.value as typeof category)
          }
          aria-label="Filtrar por categoria"
        >
          <option value="all">Todas las categorias</option>
          <option value="goods">Bienes</option>
          <option value="services">Servicios</option>
          <option value="both">Ambos</option>
        </select>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Cargando...</p> : null}

      <SupplierTable suppliers={items} />
    </div>
  );
}
