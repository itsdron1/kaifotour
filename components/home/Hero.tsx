import { ArrowDown, ArrowRight, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { Fragment } from "react";
import { HeroBackdrop } from "@/components/home/HeroBackdrop";
import { HeroMedia } from "@/components/home/HeroMedia";
import { buttonClassName, ButtonLink } from "@/components/ui/ButtonLink";
import { ScrollMorphHero } from "@/components/ui/scroll-morph-hero";
import { resolveMedia } from "@/data/media";
import { getDictionary } from "@/lib/dictionaries";
import { fill, plural } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { getTourCards } from "@/lib/tour-view";
import { whatsappUrl } from "@/lib/whatsapp";

const DECK_ID = "tours-deck";

/** Строка словаря с **выделением** → текст с выделенными словами */
function emphasize(text: string) {
  return text.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-medium text-on-dark">
        {part}
      </strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

/**
 * Начало главной. Первый экран — призыв и две кнопки: «Выбрать тур» ведёт к общему списку туров (#tours),
 * «Задать вопрос» открывает WhatsApp. Внизу — строка о том, что всё уже подготовлено.
 * Вторым экраном идёт колода туров: карточки слетаются в круг, а при прокрутке круг становится дугой.
 */
export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  // Все опубликованные туры из data/tours.ts, по карточке на тур: Nusa Lembongan и Sumba скрыты через published: false
  const cards = getTourCards(locale);
  const image = resolveMedia("hero", locale);

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
    <>
      <section
        data-placement="hero"
        aria-labelledby="hero-title"
        className="relative isolate flex min-h-[max(100svh,40rem)] flex-col overflow-hidden bg-deep text-on-dark"
      >
        <HeroMedia />

        <div className="mx-auto flex w-full max-w-page flex-1 flex-col items-center justify-center px-5 pt-24 text-center sm:px-8 lg:px-12">
          {/* Лёгкая тень держит мелкую строку на светлых сценах видео */}
          <p className="kicker text-sand [text-shadow:0_1px_10px_rgb(var(--color-surface-dark)/0.85)]">{t.hero.subtitle}</p>
          <h1 id="hero-title" className="display mt-5 max-w-[16ch] text-balance text-display-2xl">
            {t.hero.title}
          </h1>
          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            {/* Сразу к общему списку туров (секция #tours). Обычная ссылка-якорь: плавный скролл даёт scroll-behavior у html */}
            <a href="#tours" className={buttonClassName("primary", "w-full sm:w-auto")}>
              <ArrowDown size={18} aria-hidden="true" />
              <span>{t.hero.chooseTour}</span>
            </a>
            <ButtonLink
              href={whatsappUrl(t.whatsapp.question)}
              external
              newTabLabel={t.a11y.newTab}
              variant="outline-dark"
              icon={<WhatsappLogo size={18} aria-hidden="true" />}
              // Подложка: у кнопки-контура нет своей заливки, а за ней идут светлые сцены видео
              className="w-full bg-deep/45 sm:w-auto"
            >
              {t.hero.askQuestion}
            </ButtonLink>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-page flex-col items-center px-5 pb-8 pt-12 text-center sm:px-8 lg:px-12 lg:pb-10">
          <span aria-hidden="true" className="h-px w-16 bg-accent" />
          <p className="mt-5 max-w-[40rem] text-balance text-[0.9375rem] leading-relaxed text-on-dark/85 sm:text-base">
            {emphasize(t.hero.ready)}
          </p>
          <a href={`#${DECK_ID}`} className="kicker group mt-6 inline-flex items-center gap-2 text-mist">
            <span>{t.hero.scrollHint}</span>
            <ArrowDown size={14} aria-hidden="true" className="animate-bounce motion-reduce:animate-none" />
          </a>
        </div>
      </section>

      <ScrollMorphHero
        id={DECK_ID}
        labelledBy="deck-title"
        cards={cards}
        backdrop={<HeroBackdrop image={image} />}
        intro={
          <div className="flex flex-col items-center">
            <h2 id="deck-title" className="display text-balance text-on-dark">
              {t.hero.deckTitle}
            </h2>
            <p className="kicker mt-4 text-sand">{fill(plural(locale, cards.length, t.hero.deckCount), { n: cards.length })}</p>
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
    </>
  );
}
