import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { resolveMedia } from "@/data/media";
import { publishedTours } from "@/data/tours";
import { getDictionary } from "@/lib/dictionaries";
import { plural } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

/**
 * «Beyond the Booking / Into the Moment» (docs/editorial-style.md, раздел 4).
 * Цифры компании: только плейсхолдеры [X] до получения данных от заказчика.
 * Число маршрутов считается из data/tours.ts, это не выдуманная цифра.
 */
export function BeyondTheBooking({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const routeCount = publishedTours.length;
  const stats = [...t.stories.stats, { value: String(routeCount), label: plural(locale, routeCount, t.stories.catalogStat) }];

  return (
    <section id="stories" aria-labelledby="stories-title" className="overflow-hidden bg-paper py-20 lg:py-28">
      <div className="mx-auto grid max-w-page gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="lg:col-span-7">
          <Reveal>
            <h2 id="stories-title" className="text-display-xl">
              <span className="display block">{t.stories.titleTop}</span>
              <span className="display -mt-[0.1em] block pl-[10%] text-secondary">{t.stories.titleBottom}</span>
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
          <figure className="relative mx-auto max-w-md rotate-[1.5deg] bg-sand p-4 pb-6 shadow-postcard lg:mr-0">
            <Photo
              image={resolveMedia("story", locale)}
              sizes="(min-width: 1024px) 28rem, 90vw"
              className="aspect-[4/5] w-full"
            />
            <figcaption className="px-2 pt-5">
              <p className="kicker text-[0.75rem] text-ink/75">{t.stories.storyLabel}</p>
              <blockquote className="display mt-3 text-2xl leading-snug text-ink">{t.stories.storyQuote}</blockquote>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="kicker mt-6 inline-flex items-center gap-2 text-secondary"
              >
                <InstagramLogo size={16} aria-hidden="true" />
                <span className="link-underline">{t.stories.storyLink}</span>
                <span className="sr-only">({t.a11y.newTab})</span>
              </a>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
