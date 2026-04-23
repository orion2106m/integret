import { useEffect, useMemo, useState } from "react";

export function useEntitySearch(delayMs = 350) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, delayMs);

    return () => window.clearTimeout(timeout);
  }, [delayMs, query]);

  const isSearching = useMemo(
    () => query.trim() !== debouncedQuery.trim(),
    [query, debouncedQuery],
  );

  return {
    query,
    debouncedQuery,
    setQuery,
    isSearching,
  };
}
