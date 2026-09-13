import { Check, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { PageShell } from "@/components/layout/PageShell";
import { BookingPanel } from "@/components/tour/BookingPanel";
import { MobileBookingBar } from "@/components/tour/MobileBookingBar";
import { RelatedTours } from "@/components/tour/RelatedTours";
import { TourGallery } from "@/components/tour/TourGallery";
import { VariantCard } from "@/components/tour/VariantCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Photo } from "@/components/ui/Photo";
import { resolveMedia } from "@/data/media";
import type { Tour } from "@/data/tours";
import { cn } from "@/lib/cn";
import { getDictionary } from "@/lib/dictionaries";
import { localizedPath, type Locale } from "@/lib/i18n";
import { jsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { toTourCard } from "@/lib/tour-view";
import { whatsappUrl } from "@/lib/whatsapp";

/** Шаблон страницы тура /tours/[slug] для всех опубликованных туров */
export function TourPage({ locale, tour }: { locale: Locale; tour: Tour }) {
  const t = getDictionary(locale);
  const card = toTourCard(tour, locale);
  const heroImage = resolveMedia(tour.image, locale);
  const gallery = [tour.image, ...tour.gallery].map((key) => resolveMedia(key, locale));
  const homeHref = localizedPath(locale, "/");
  const catalogHref = localizedPath(locale, "/tours");

  const facts = [
    { label: t.tour.duration, value: card.durationLabel },
    {
      label: t.tour.difficulty,
      value: tour.difficulty ? t.tour.difficultyLevels[tour.difficulty] : t.tour.difficultyLevels.unknown,
      note: tour.difficultyNote?.[locale],
    },
    { label: t.tour.price, value: card.priceLabel, accent: true },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        name: tour.title,
        description: tour.lead[locale],
        url: `${site.url}${card.href}`,
        image: heroImage.src,
        provider: {
          "@type": "TravelAgency",
          name: site.name,
          url: site.url,
          telephone: site.whatsapp.display,
          email: site.email,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t.nav.home, item: `${site.url}${homeHref}` },
          { "@type": "ListItem", position: 2, name: t.nav.tours, item: `${site.url}${catalogHref}` },
          { "@type": "ListItem", position: 3, name: tour.title, item: `${site.url}${card.href}` },
        ],
      },
    ],
  };

  return (
    <PageShell
      locale={locale}
      after={
        <MobileBookingBar
          priceLabel={card.priceLabel}
          disclaimer={t.price.disclaimer}
          bookHref={card.bookHref}
          bookLabel={t.cta.bookShort}
          newTabLabel={t.a11y.newTab}
        />
      }
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />

      <article>
        <header className="relative isolate flex min-h-[78svh] flex-col justify-end overflow-hidden bg-deep text-on-dark">
          <Photo image={heroImage} sizes="100vw" preload className="absolute inset-0 -z-10" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-deep via-deep/50 to-deep/25" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-deep/75 via-deep/25 to-transparent" />

          <div className="mx-auto w-full max-w-page px-5 pb-10 pt-32 sm:px-8 lg:px-12 lg:pb-14">
            <Breadcrumbs
              label={t.a11y.breadcrumbs}
              items={[{ label: t.nav.home, href: homeHref }, { label: t.nav.tours, href: catalogHref }, { label: tour.title }]}
            />
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <p className="kicker text-accent">{card.kicker}</p>
              {card.badgeLabel ? (
                <span className="kicker border border-accent px-2 py-1 text-[0.6875rem] text-accent">{card.badgeLabel}</span>
              ) : null}
            </div>
            <h1 className="display mt-4 max-w-5xl text-display-2xl">{tour.title}</h1>

            <dl className="mt-10 grid max-w-4xl gap-6 border-t border-on-dark/20 pt-6 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="kicker text-[0.75rem] text-mist">{fact.label}</dt>
                  <dd
                    className={cn(
                      "mt-2 text-xl",
                      fact.accent ? "font-condensed font-semibold uppercase tracking-caps text-accent" : "font-medium text-on-dark",
                    )}
                  >
                    {fact.value}
                    {fact.note ? <span className="mt-1 block text-sm font-normal text-mist">{fact.note}</span> : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <div className="bg-paper">
          <div className="mx-auto grid max-w-page gap-14 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12 lg:py-24">
            <div className="lg:col-span-7 xl:col-span-8">
              <p className="max-w-prose text-xl leading-relaxed text-ink sm:text-2xl sm:leading-relaxed">{tour.lead[locale]}</p>

              <section aria-labelledby="includes-title" className="mt-14">
                <h2 id="includes-title" className="display text-display-md">
                  {t.tour.includes}
                </h2>
                <ul className="mt-6 grid border-t border-divider sm:grid-cols-2 sm:gap-x-10">
                  {tour.includes[locale].map((item) => (
                    <li key={item} className="flex gap-3 border-b border-divider py-4 text-lg leading-snug">
                      <Check size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-secondary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {tour.variants.length > 0 ? (
                <section aria-labelledby="variants-title" className="mt-16">
                  <h2 id="variants-title" className="display text-display-md">
                    {t.tour.variants}
                  </h2>
                  <div className="mt-6 grid gap-6">
                    {tour.variants.map((variant) => (
                      <VariantCard key={variant.id} variant={variant} locale={locale} />
                    ))}
                  </div>
                </section>
              ) : null}

              <TourGallery images={gallery} title={t.tour.gallery} />
            </div>

            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-28">
                <BookingPanel locale={locale} tour={tour} bookHref={card.bookHref} />
              </div>
            </aside>
          </div>
        </div>
      </article>

      <section aria-labelledby="consult-title" className="bg-sand">
        <div className="mx-auto flex max-w-page flex-col gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-12 lg:py-20">
          <div>
            <h2 id="consult-title" className="display text-display-lg">
              {t.tour.consultTitle}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/80">{t.tour.consultText}</p>
          </div>
          <ButtonLink
            href={whatsappUrl(t.whatsapp.consult)}
            external
            newTabLabel={t.a11y.newTab}
            variant="dark"
            icon={<WhatsappLogo size={18} aria-hidden="true" />}
            className="self-start lg:self-auto"
          >
            {t.cta.consult}
          </ButtonLink>
        </div>
      </section>

      <RelatedTours locale={locale} tour={tour} />
    </PageShell>
  );
}
