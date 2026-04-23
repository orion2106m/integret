import { useEffect, useMemo, useState } from "react";
import { useSupplierStore } from "../store/supplierStore";
import type { SupplierFilters } from "../types/supplier.types";
import { useEntitySearch } from "./useEntitySearch";

export function useSuppliers(tenantId: string) {
  const [status, setStatus] = useState<SupplierFilters["status"]>("all");
  const [category, setCategory] = useState<SupplierFilters["category"]>("all");
  const [hasActiveContract, setHasActiveContract] = useState<
    boolean | undefined
  >(undefined);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { query, debouncedQuery, setQuery, isSearching } = useEntitySearch(300);
  const {
    items,
    total,
    loading,
    error,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
  } = useSupplierStore();

  const filters = useMemo<SupplierFilters>(
    () => ({
      query: debouncedQuery,
      status,
      category,
      hasActiveContract,
      page,
      pageSize,
    }),
    [debouncedQuery, status, category, hasActiveContract, page],
  );

  useEffect(() => {
    void fetchSuppliers(tenantId, filters);
  }, [tenantId, fetchSuppliers, filters]);

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
    category,
    setCategory,
    hasActiveContract,
    setHasActiveContract,
    page,
    setPage,
    pageSize,
    createSupplier,
    updateSupplier,
    refresh: () => fetchSuppliers(tenantId, filters),
  };
}
