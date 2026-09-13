import type { DurationBucket, Environment, TourCategory } from "@/data/tours";
import type { PriceBucket, TourCardData } from "@/lib/tour-view";

/**
 * Фильтры каталога (docs/tz-main.md, раздел 3.4): тип активности, вода / суша,
 * цена, длительность и сортировка. Состояние живёт в query-строке URL,
 * поэтому отфильтрованной выдачей можно поделиться ссылкой.
 */

export type CategoryFilter = "all" | TourCategory;
export type EnvironmentFilter = "any" | Environment;
export type PriceFilter = "any" | PriceBucket;
export type DurationFilter = "any" | DurationBucket;
export type SortOrder = "popular" | "price-asc" | "price-desc";

export interface CatalogFilters {
  category: CategoryFilter;
  /** Подборка из коллажа «How We Ride & Explore», например sunset */
  collection: string | null;
  environment: EnvironmentFilter;
  price: PriceFilter;
  duration: DurationFilter;
  sort: SortOrder;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  category: "all",
  collection: null,
  environment: "any",
  price: "any",
  duration: "any",
  sort: "popular",
};

const CATEGORY_VALUES: readonly CategoryFilter[] = ["all", "ocean", "offroad", "day-tours", "rides"];
const ENVIRONMENT_VALUES: readonly EnvironmentFilter[] = ["any", "water", "land"];
const PRICE_VALUES: readonly PriceFilter[] = ["any", "under-500k", "500k-1500k", "over-1500k", "on-request"];
const DURATION_VALUES: readonly DurationFilter[] = ["any", "hours", "full-day", "extended"];
const SORT_VALUES: readonly SortOrder[] = ["popular", "price-asc", "price-desc"];
const COLLECTION_VALUES: readonly string[] = ["sunset"];

function pick<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

export function parseFilters(params: { get(name: string): string | null }): CatalogFilters {
  const collection = params.get("collection");
  return {
    category: pick(params.get("category"), CATEGORY_VALUES, "all"),
    collection: collection && COLLECTION_VALUES.includes(collection) ? collection : null,
    environment: pick(params.get("environment"), ENVIRONMENT_VALUES, "any"),
    price: pick(params.get("price"), PRICE_VALUES, "any"),
    duration: pick(params.get("duration"), DURATION_VALUES, "any"),
    sort: pick(params.get("sort"), SORT_VALUES, "popular"),
  };
}

export function serializeFilters(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.collection) params.set("collection", filters.collection);
  if (filters.environment !== "any") params.set("environment", filters.environment);
  if (filters.price !== "any") params.set("price", filters.price);
  if (filters.duration !== "any") params.set("duration", filters.duration);
  if (filters.sort !== "popular") params.set("sort", filters.sort);
  return params.toString();
}

/** Есть ли активные фильтры, сужающие выдачу (сортировка не считается) */
export function hasActiveFilters(filters: CatalogFilters): boolean {
  return serializeFilters({ ...filters, sort: "popular" }) !== "";
}

export function applyFilters(cards: TourCardData[], filters: CatalogFilters): TourCardData[] {
  const list = cards.filter(
    (card) =>
      (filters.category === "all" || card.category === filters.category) &&
      (!filters.collection || card.collections.includes(filters.collection)) &&
      (filters.environment === "any" || card.environment === filters.environment) &&
      (filters.price === "any" || card.priceBucket === filters.price) &&
      (filters.duration === "any" || card.duration === filters.duration),
  );

  // «Популярные» = порядок каталога из data/tours.ts, пока нет реальных данных о спросе
  if (filters.sort === "popular") return list;

  const direction = filters.sort === "price-asc" ? 1 : -1;
  return [...list].sort((a, b) => {
    if (a.priceFromIDR === null && b.priceFromIDR === null) return 0;
    if (a.priceFromIDR === null) return 1;
    if (b.priceFromIDR === null) return -1;
    return (a.priceFromIDR - b.priceFromIDR) * direction;
  });
}
