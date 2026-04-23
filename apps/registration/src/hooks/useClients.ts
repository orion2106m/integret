import { useEffect, useMemo, useState } from "react";
import { useClientStore } from "../store/clientStore";
import type { ClientFilters } from "../types/client.types";
import { useEntitySearch } from "./useEntitySearch";

export function useClients(tenantId: string) {
  const [status, setStatus] = useState<ClientFilters["status"]>("all");
  const [clientType, setClientType] =
    useState<ClientFilters["clientType"]>("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { query, debouncedQuery, setQuery, isSearching } = useEntitySearch(350);
  const {
    items,
    total,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
  } = useClientStore();

  const filters = useMemo<ClientFilters>(
    () => ({
      query: debouncedQuery,
      status,
      clientType,
      page,
      pageSize,
    }),
    [debouncedQuery, status, clientType, page],
  );

  useEffect(() => {
    void fetchClients(tenantId, filters);
  }, [tenantId, fetchClients, filters]);

  return {
    items,
    total,
    loading,
    error,
    query,
    setQuery,
    isSearching,
    status,
    setStatus,
    clientType,
    setClientType,
    page,
    setPage,
    pageSize,
    createClient,
    updateClient,
    refresh: () => fetchClients(tenantId, filters),
  };
}
