import { Suspense } from "react";
import { CatalogController } from "@/components/catalog/CatalogController";
import { CatalogView, type CatalogViewProps } from "@/components/catalog/CatalogView";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { categories } from "@/data/tours";
import { DEFAULT_FILTERS } from "@/lib/catalog-filters";
import { getDictionary } from "@/lib/dictionaries";
import { fill, plural } from "@/lib/format";
import { localizedPath, type Locale } from "@/lib/i18n";
import { getTourCards } from "@/lib/tour-view";
import { whatsappUrl } from "@/lib/whatsapp";

/** Полный каталог /tours: сетка карточек с фильтрами (docs/tz-main.md, раздел 3.4) */
export function CatalogPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const cards = getTourCards(locale);

  const viewProps: Omit<CatalogViewProps, "filters" | "onFiltersChange"> = {
    locale,
    cards,
    tabs: [{ id: "all", label: t.catalog.all }, ...categories.map((item) => ({ id: item.id, label: item.label[locale] }))],
    whatsappHref: whatsappUrl(t.whatsapp.consult),
    labels: {
      categories: t.a11y.categories,
      filters: t.catalog.filters,
      found: t.catalog.found,
      emptyTitle: t.catalog.emptyTitle,
      emptyText: t.catalog.emptyText,
      clearCollection: t.catalog.clearCollection,
      collections: { sunset: t.ride.sectors.sunset.title },
      message: t.cta.message,
      card: { book: t.cta.book, details: t.cta.details, disclaimer: t.price.disclaimer, newTab: t.a11y.newTab },
    },
  };

  return (
    <PageShell locale={locale}>
      <section aria-labelledby="catalog-title" className="bg-deep pb-12 pt-32 text-on-dark lg:pb-16 lg:pt-40">
        <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
          <Breadcrumbs
            label={t.a11y.breadcrumbs}
            items={[{ label: t.nav.home, href: localizedPath(locale, "/") }, { label: t.nav.tours }]}
          />
          <h1 id="catalog-title" className="display mt-8 max-w-4xl text-display-xl">
            {t.catalog.pageTitle}
          </h1>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-mist">
            {fill(t.catalog.pageIntro, { count: fill(plural(locale, cards.length, t.catalog.routes), { n: cards.length }) })}
          </p>
        </div>
      </section>

      <Suspense fallback={<CatalogView {...viewProps} filters={DEFAULT_FILTERS} />}>
        <CatalogController {...viewProps} />
      </Suspense>
    </PageShell>
  );
}
