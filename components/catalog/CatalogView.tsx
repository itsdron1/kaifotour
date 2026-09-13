"use client";

import { CaretDown, WhatsappLogo, X } from "@phosphor-icons/react";
import { useId } from "react";
import { TourCard, type TourCardLabels } from "@/components/catalog/TourCard";
import { ButtonLink, buttonClassName } from "@/components/ui/ButtonLink";
import {
  applyFilters,
  DEFAULT_FILTERS,
  hasActiveFilters,
  type CatalogFilters,
  type DurationFilter,
  type EnvironmentFilter,
  type PriceFilter,
  type SortOrder,
} from "@/lib/catalog-filters";
import { cn } from "@/lib/cn";
import type { Dictionary } from "@/lib/dictionaries";
import { fill, plural, type PluralForms } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { TourCardData } from "@/lib/tour-view";

export interface CatalogLabels {
  categories: string;
  filters: Dictionary["catalog"]["filters"];
  found: PluralForms;
  emptyTitle: string;
  emptyText: string;
  clearCollection: string;
  collections: Record<string, string>;
  message: string;
  card: TourCardLabels;
}

export interface CatalogViewProps {
  locale: Locale;
  cards: TourCardData[];
  tabs: { id: string; label: string }[];
  labels: CatalogLabels;
  whatsappHref: string;
  filters: CatalogFilters;
  onFiltersChange?: (filters: CatalogFilters) => void;
}

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

function SelectField<T extends string>({ label, value, options, onChange }: SelectFieldProps<T>) {
  const id = useId();
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="kicker text-[0.75rem] text-label">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className="w-full appearance-none border border-steel bg-paper px-4 py-3 pr-11 text-base text-ink transition-colors duration-300 hover:border-ink focus:border-secondary"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <CaretDown size={16} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink" />
      </div>
    </div>
  );
}

export function CatalogView({ locale, cards, tabs, labels, whatsappHref, filters, onFiltersChange }: CatalogViewProps) {
  const f = labels.filters;
  const results = applyFilters(cards, filters);
  const filtered = hasActiveFilters(filters);

  function update(patch: Partial<CatalogFilters>) {
    onFiltersChange?.({ ...filters, ...patch });
  }

  const reset = () => onFiltersChange?.(DEFAULT_FILTERS);

  return (
    <div>
      <div className="sticky top-16 z-20 bg-secondary lg:top-[72px]">
        <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
          <div role="group" aria-label={labels.categories} className="-mx-1 flex gap-1 overflow-x-auto py-1">
            {tabs.map((tab) => {
              const selected = tab.id === filters.category;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => update({ category: tab.id as CatalogFilters["category"] })}
                  className={cn(
                    "kicker shrink-0 px-4 py-3.5 transition-colors duration-300",
                    selected ? "bg-deep text-accent" : "text-on-dark/85 hover:text-on-dark",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-page px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="grid gap-5 border-b border-divider pb-8 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField<EnvironmentFilter>
            label={f.environment}
            value={filters.environment}
            onChange={(environment) => update({ environment })}
            options={[
              { value: "any", label: f.environmentAny },
              { value: "water", label: f.water },
              { value: "land", label: f.land },
            ]}
          />
          <SelectField<PriceFilter>
            label={f.price}
            value={filters.price}
            onChange={(price) => update({ price })}
            options={[
              { value: "any", label: f.priceAny },
              { value: "under-500k", label: f.priceUnder500 },
              { value: "500k-1500k", label: f.price500to1500 },
              { value: "over-1500k", label: f.priceOver1500 },
              { value: "on-request", label: f.priceOnRequest },
            ]}
          />
          <SelectField<DurationFilter>
            label={f.duration}
            value={filters.duration}
            onChange={(duration) => update({ duration })}
            options={[
              { value: "any", label: f.durationAny },
              { value: "hours", label: f.hours },
              { value: "full-day", label: f.fullDay },
              { value: "extended", label: f.extended },
            ]}
          />
          <SelectField<SortOrder>
            label={f.sort}
            value={filters.sort}
            onChange={(sort) => update({ sort })}
            options={[
              { value: "popular", label: f.popular },
              { value: "price-asc", label: f.priceAsc },
              { value: "price-desc", label: f.priceDesc },
            ]}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <p aria-live="polite" className="text-label">
            {fill(plural(locale, results.length, labels.found), { n: results.length })}
          </p>
          {filters.collection ? (
            <button
              type="button"
              onClick={() => update({ collection: null })}
              className="kicker inline-flex items-center gap-2 border border-secondary px-3 py-2 text-secondary transition-colors hover:bg-secondary hover:text-on-dark"
            >
              {labels.collections[filters.collection] ?? filters.collection}
              <X size={14} aria-hidden="true" />
              <span className="sr-only">{labels.clearCollection}</span>
            </button>
          ) : null}
          {filtered ? (
            <button type="button" onClick={reset} className="kicker link-underline ml-auto text-secondary">
              {f.reset}
            </button>
          ) : null}
        </div>

        {results.length > 0 ? (
          <ul className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((card) => (
              <li key={card.slug}>
                <TourCard card={card} labels={labels.card} headingLevel="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 border border-divider px-6 py-16 text-center sm:px-12">
            <p className="display text-display-md">{labels.emptyTitle}</p>
            <p className="mx-auto mt-4 max-w-md text-lg text-label">{labels.emptyText}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button type="button" onClick={reset} className={buttonClassName("outline-light")}>
                {f.reset}
              </button>
              <ButtonLink
                href={whatsappHref}
                external
                newTabLabel={labels.card.newTab}
                icon={<WhatsappLogo size={18} aria-hidden="true" />}
              >
                {labels.message}
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
