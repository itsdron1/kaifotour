"use client";

import { useSearchParams } from "next/navigation";
import { CatalogView, type CatalogViewProps } from "@/components/catalog/CatalogView";
import { parseFilters, serializeFilters, type CatalogFilters } from "@/lib/catalog-filters";

/** Фильтры читаются из query-строки и пишутся обратно через history.replaceState (синхронизируется с роутером Next.js) */
export function CatalogController(props: Omit<CatalogViewProps, "filters" | "onFiltersChange">) {
  const searchParams = useSearchParams();
  const filters = parseFilters(searchParams);

  function handleFiltersChange(next: CatalogFilters) {
    const query = serializeFilters(next);
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }

  return <CatalogView {...props} filters={filters} onFiltersChange={handleFiltersChange} />;
}
