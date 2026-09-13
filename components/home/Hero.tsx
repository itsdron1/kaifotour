import { ArrowRight, ArrowUpRight, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { HeroBackdrop } from "@/components/home/HeroBackdrop";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Photo } from "@/components/ui/Photo";
import { resolveMedia } from "@/data/media";
import { getPublishedTour } from "@/data/tours";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { toTourCard } from "@/lib/tour-view";
import { whatsappUrl } from "@/lib/whatsapp";

/** Тур на карточке-полароиде в hero */
const FEATURED_TOUR_SLUG = "batur-sunrise-trekking";

export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const featuredTour = getPublishedTour(FEATURED_TOUR_SLUG);
  const featured = featuredTour ? toTourCard(featuredTour, locale) : null;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden bg-deep text-on-dark"
    >
      <HeroBackdrop image={resolveMedia("hero", locale)} />

      <div className="mx-auto grid w-full max-w-page flex-1 grid-cols-1 content-between gap-y-10 px-5 pb-10 pt-24 sm:px-8 lg:grid-cols-12 lg:gap-x-8 lg:px-12 lg:pb-14 lg:pt-28">
        <p className="max-w-[17rem] text-[0.9375rem] leading-relaxed text-on-dark/80 lg:col-span-4">
          {t.hero.captionLeft}
        </p>

        {featured ? (
          <Link
            href={featured.href}
            className="group relative hidden w-60 rotate-[4deg] justify-self-end bg-paper p-3 pb-4 text-ink shadow-postcard transition-transform duration-350 ease-editorial hover:-translate-y-1.5 hover:rotate-[1deg] lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:mt-4 lg:block lg:self-start"
          >
            <Photo image={featured.image} sizes="15rem" className="aspect-[4/5] w-full" />
            <span className="kicker mt-3 block text-[0.6875rem] text-secondary">{featured.kicker}</span>
            <span className="display mt-1.5 block text-[1.375rem] leading-tight">{featured.title}</span>
            <span className="mt-2 flex items-center justify-between gap-3 font-condensed text-[0.8125rem] font-semibold uppercase tracking-caps text-accent-ink">
              {featured.priceLabel}
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        ) : null}

        <div className="flex flex-col gap-8 lg:col-span-12 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h1 id="hero-title" className="display max-w-[20ch] text-balance text-display-2xl text-on-dark">
            {t.hero.title}
          </h1>
          <div className="flex shrink-0 flex-col gap-6 lg:items-end lg:text-right">
            <p className="max-w-[20rem] text-[0.9375rem] leading-relaxed text-on-dark/80">{t.hero.captionRight}</p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-4 lg:flex-col-reverse lg:items-end lg:gap-1">
              <a href="#tours" className="kicker group inline-flex items-center justify-center gap-2 px-3 py-3.5 text-on-dark">
                <span className="link-underline pb-0.5">{t.cta.explore}</span>
                <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <ButtonLink
                href={whatsappUrl(t.whatsapp.general)}
                external
                newTabLabel={t.a11y.newTab}
                icon={<WhatsappLogo size={18} aria-hidden="true" />}
              >
                {t.cta.book}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
