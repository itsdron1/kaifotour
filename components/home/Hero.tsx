import { ArrowRight, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { HeroBackdrop } from "@/components/home/HeroBackdrop";
import { HeroTourStack, type HeroStackCard } from "@/components/home/HeroTourStack";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { resolveMedia } from "@/data/media";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { getTourCards } from "@/lib/tour-view";
import { whatsappUrl } from "@/lib/whatsapp";

export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  // Все опубликованные туры из data/tours.ts: Nusa Lembongan и Sumba скрыты через published: false
  const stackCards: HeroStackCard[] = getTourCards(locale).map(({ slug, href, title, kicker, priceLabel, image }) => ({
    slug,
    href,
    title,
    kicker,
    priceLabel,
    image,
  }));

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden bg-deep text-on-dark"
    >
      <HeroBackdrop image={resolveMedia("hero", locale)} />

      <div className="relative mx-auto flex w-full max-w-page flex-1 flex-col justify-between gap-10 px-5 pb-10 pt-24 sm:px-8 lg:px-12 lg:pb-14 lg:pt-28">
        <p className="max-w-[17rem] text-[0.9375rem] leading-relaxed text-on-dark/80">{t.hero.captionLeft}</p>

        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between xl:gap-12">
            <h1 id="hero-title" className="display max-w-[20ch] text-balance text-display-2xl text-on-dark">
              {t.hero.title}
            </h1>
            <div className="flex shrink-0 flex-col gap-6 xl:items-end xl:text-right">
              <p className="max-w-[20rem] text-[0.9375rem] leading-relaxed text-on-dark/80">{t.hero.captionRight}</p>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-4 xl:flex-col-reverse xl:items-end xl:gap-1">
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

          {/* Колода туров: на мобильных и планшетах под текстом, с 1024px справа поверх фото.
              На невысоких экранах от 1024px скрыта, чтобы не наезжать на заголовок и CTA. */}
          <div className="lg:absolute lg:right-20 lg:top-24 lg:hidden lg:[@media(min-height:680px)]:block">
            <HeroTourStack
              cards={stackCards}
              labels={{
                region: t.hero.stackLabel,
                previous: t.hero.prevTour,
                next: t.hero.nextTour,
                status: t.hero.stackStatus,
                openTour: t.hero.openTour,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
