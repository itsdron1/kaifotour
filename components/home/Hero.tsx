import { ArrowRight, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { HeroBackdrop } from "@/components/home/HeroBackdrop";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ScrollMorphHero } from "@/components/ui/scroll-morph-hero";
import { resolveMedia } from "@/data/media";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { getTourCards } from "@/lib/tour-view";
import { whatsappUrl } from "@/lib/whatsapp";

export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  // Все опубликованные туры из data/tours.ts, по карточке на тур: Nusa Lembongan и Sumba скрыты через published: false
  const cards = getTourCards(locale);

  const bookAction = (
    <ButtonLink
      href={whatsappUrl(t.whatsapp.general)}
      external
      newTabLabel={t.a11y.newTab}
      icon={<WhatsappLogo size={18} aria-hidden="true" />}
    >
      {t.cta.book}
    </ButtonLink>
  );

  const exploreAction = (
    <a href="#tours" className="kicker group inline-flex items-center justify-center gap-2 px-3 py-3.5 text-on-dark">
      <span className="link-underline pb-0.5">{t.cta.explore}</span>
      <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );

  return (
    <ScrollMorphHero
      labelledBy="hero-title"
      cards={cards}
      backdrop={<HeroBackdrop image={resolveMedia("hero", locale)} />}
      intro={
        <div className="flex flex-col items-center">
          <h1 id="hero-title" className="display text-balance text-on-dark">
            {t.hero.title}
          </h1>
          <p className="kicker mt-4 text-sand">{t.hero.subtitle}</p>
        </div>
      }
      scrollHint={t.hero.scrollHint}
      content={
        <div className="flex flex-col items-center">
          <p className="display text-balance text-display-md text-on-dark">{t.hero.captionLeft}</p>
          <p className="mt-4 max-w-[28rem] text-[0.9375rem] leading-relaxed text-on-dark/80">{t.hero.captionRight}</p>
        </div>
      }
      primaryAction={bookAction}
      secondaryAction={exploreAction}
      cardLabels={{
        book: t.cta.book,
        details: t.cta.details,
        newTab: t.a11y.newTab,
        close: t.a11y.closeCard,
      }}
    />
  );
}
