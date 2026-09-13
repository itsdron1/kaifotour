import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { TourCard } from "@/components/catalog/TourCard";
import { publishedTours, type Tour } from "@/data/tours";
import { getDictionary } from "@/lib/dictionaries";
import { localizedPath, type Locale } from "@/lib/i18n";
import { toTourCard } from "@/lib/tour-view";

const RELATED_LIMIT = 3;

export function RelatedTours({ locale, tour }: { locale: Locale; tour: Tour }) {
  const t = getDictionary(locale);
  const sameCategory = publishedTours.filter((item) => item.category === tour.category && item.slug !== tour.slug);
  const otherCategories = publishedTours.filter((item) => item.category !== tour.category);
  const related = [...sameCategory, ...otherCategories].slice(0, RELATED_LIMIT).map((item) => toTourCard(item, locale));

  return (
    <section aria-labelledby="related-title" className="bg-paper py-16 lg:py-24">
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="related-title" className="display text-display-lg">
            {t.tour.related}
          </h2>
          <Link href={localizedPath(locale, "/tours")} className="kicker group inline-flex items-center gap-2 py-2 text-ink">
            <span className="link-underline">{t.cta.exploreAll}</span>
            <ArrowRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        <ul className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
          {related.map((card) => (
            <li key={card.slug}>
              <TourCard
                card={card}
                labels={{ book: t.cta.book, details: t.cta.details, disclaimer: t.price.disclaimer, newTab: t.a11y.newTab }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
