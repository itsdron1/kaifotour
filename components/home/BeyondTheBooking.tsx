import { StoryStack } from "@/components/home/StoryStack";
import { Reveal } from "@/components/ui/Reveal";
import { publishedTours } from "@/data/tours";
import { getDictionary } from "@/lib/dictionaries";
import { plural } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { getStoryCards } from "@/lib/story-view";

/**
 * Секция о моментах поездки (docs/editorial-style.md, раздел 4).
 * Число маршрутов считается из data/tours.ts, остальные цифры — данные заказчика.
 */
export function BeyondTheBooking({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const routeCount = publishedTours.length;
  const stats = [
    t.stories.stats.years,
    { value: String(routeCount), label: plural(locale, routeCount, t.stories.catalogStat) },
    t.stories.stats.activities,
    t.stories.stats.guests,
  ];

  return (
    <section id="stories" aria-labelledby="stories-title" className="overflow-hidden bg-paper py-20 lg:py-28">
      <div className="mx-auto grid max-w-page gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="lg:col-span-7">
          <Reveal>
            <h2 id="stories-title" className="display max-w-[26ch] text-balance text-display-lg">
              {t.stories.title}
            </h2>
            <p className="mt-8 max-w-prose text-lg leading-relaxed text-label">{t.stories.intro}</p>
          </Reveal>

          <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse border-t border-divider pt-5">
                <dt className="kicker mt-3 text-[0.75rem] leading-snug text-label">{stat.label}</dt>
                <dd className="display text-5xl text-accent-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Reveal className="lg:col-span-5 lg:pt-4" delay={0.1}>
          <StoryStack stories={getStoryCards(locale)} labels={t.stories.stack} />
        </Reveal>
      </div>
    </section>
  );
}
