import { ToursCircle } from "@/components/home/ToursCircle";
import { categories } from "@/data/tours";
import { getDictionary } from "@/lib/dictionaries";
import { fill, plural } from "@/lib/format";
import { localizedPath, type Locale } from "@/lib/i18n";
import { getTourCards } from "@/lib/tour-view";

/** Каталог на главной: открытки туров стоят по кругу вокруг заголовка секции */
export function ToursWorthRiding({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const cards = getTourCards(locale);
  const tabs = [
    { id: "all", label: t.catalog.all },
    ...categories.map((category) => ({ id: category.id, label: category.label[locale] })),
  ];

  return (
    <section id="tours" aria-labelledby="tours-title" className="bg-deep py-20 text-on-dark lg:py-28">
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
        <ToursCircle
          cards={cards}
          tabs={tabs}
          catalogHref={localizedPath(locale, "/tours")}
          titleId="tours-title"
          title={t.catalog.homeTitle}
          countLabel={fill(plural(locale, cards.length, t.catalog.routes), { n: cards.length })}
          labels={{
            categories: t.a11y.categories,
            toursList: t.a11y.toursList,
            exploreAll: t.cta.exploreAll,
            book: t.cta.book,
            details: t.cta.details,
            newTab: t.a11y.newTab,
            close: t.a11y.closeCard,
          }}
        />
      </div>
    </section>
  );
}
