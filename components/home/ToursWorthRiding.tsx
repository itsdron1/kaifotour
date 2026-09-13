import { ToursExplorer } from "@/components/home/ToursExplorer";
import { Reveal } from "@/components/ui/Reveal";
import { categories } from "@/data/tours";
import { getDictionary } from "@/lib/dictionaries";
import { fill, plural } from "@/lib/format";
import { localizedPath, type Locale } from "@/lib/i18n";
import { getTourCards } from "@/lib/tour-view";

/** Каталог на главной в подаче «Tours Worth Riding»: тёмный фон, нумерованный список и карточки-открытки */
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
        <Reveal>
          <h2 id="tours-title" className="display text-display-xl">
            {t.catalog.homeTitle}
          </h2>
          <p className="mt-4 text-lg text-mist">{fill(plural(locale, cards.length, t.catalog.routes), { n: cards.length })}</p>
        </Reveal>

        <ToursExplorer
          cards={cards}
          tabs={tabs}
          catalogHref={localizedPath(locale, "/tours")}
          labels={{
            categories: t.a11y.categories,
            toursList: t.a11y.toursList,
            exploreAll: t.cta.exploreAll,
            book: t.cta.book,
            details: t.cta.details,
            disclaimer: t.price.disclaimer,
            newTab: t.a11y.newTab,
          }}
        />
      </div>
    </section>
  );
}
