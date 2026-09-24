import { MapPin, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { ReviewStack } from "@/components/home/ReviewStack";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary } from "@/lib/dictionaries";
import { cn } from "@/lib/cn";
import { fill } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { directionsUrl, getReviewCards } from "@/lib/reviews";
import { site } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Раздел «Отзывы»: сетка маленьких карточек и карта точки KAIFO.
 * Карточки собираются из data/reviews.ts и, если подключён Google, из профиля компании.
 * Пока отзывов нет ни там, ни там, слева стоит короткое приглашение оставить отзыв.
 */
export async function Reviews({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const { cards, rating } = await getReviewCards(locale);
  const address = site.address[locale];
  const reviewUrl = site.googleMaps.reviewUrl;
  const hasMap = site.googleMaps.embedSrc.length > 0;
  const fromGoogle = cards.some((card) => card.source === "google");
  const ratingValue = rating
    ? rating.value.toLocaleString(locale === "ru" ? "ru-RU" : "en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
    : null;

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-paper py-20 lg:py-28">
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker text-secondary">{t.reviews.kicker}</p>
            <h2 id="reviews-title" className="display mt-4 max-w-[18ch] text-balance text-display-lg">
              {t.reviews.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {rating ? (
              <p className="flex items-center gap-2 border border-divider px-4 py-2.5 font-condensed text-sm font-semibold uppercase tracking-caps text-ink">
                {rating.url ? (
                  <a href={rating.url} target="_blank" rel="noopener noreferrer" className="link-underline">
                    {fill(t.reviews.ratingBadge, { value: ratingValue ?? rating.value, count: rating.count })}
                    <span className="sr-only">({t.a11y.newTab})</span>
                  </a>
                ) : (
                  fill(t.reviews.ratingBadge, { value: ratingValue ?? rating.value, count: rating.count })
                )}
              </p>
            ) : null}
            {reviewUrl ? (
              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="kicker inline-flex items-center gap-2 py-2 text-secondary"
              >
                <span className="link-underline">{t.reviews.leaveReview}</span>
                <span className="sr-only">({t.a11y.newTab})</span>
              </a>
            ) : null}
          </div>
        </Reveal>

        <div className={cn("mt-12 grid gap-10 lg:gap-12", hasMap && "lg:grid-cols-12")}>
          <div className={cn(hasMap && "lg:col-span-7")}>
            {cards.length > 0 ? (
              <>
                <ReviewStack
                  reviews={cards}
                  labels={{
                    badge: t.reviews.badge,
                    rated: t.reviews.rated,
                    translated: t.reviews.translated,
                    original: t.reviews.original,
                    newTab: t.a11y.newTab,
                    title: t.reviews.stackTitle,
                    pause: t.reviews.pause,
                    play: t.reviews.play,
                    prev: t.reviews.prev,
                    next: t.reviews.next,
                    position: t.reviews.position,
                  }}
                />
                {fromGoogle ? <p className="mt-6 text-xs text-label">{t.reviews.fromGoogle}</p> : null}
              </>
            ) : (
              <Reveal className="flex max-h-[260px] flex-col justify-center border border-divider bg-paper p-6 sm:p-8">
                <p className="display text-balance text-[clamp(1.375rem,1.1rem+0.8vw,1.75rem)] leading-snug">
                  {t.reviews.emptyText}
                </p>
                <div className="mt-6">
                  {reviewUrl ? (
                    <ButtonLink href={reviewUrl} external newTabLabel={t.a11y.newTab}>
                      {t.reviews.leaveReview}
                    </ButtonLink>
                  ) : (
                    <ButtonLink
                      href={whatsappUrl(t.whatsapp.review)}
                      external
                      newTabLabel={t.a11y.newTab}
                      icon={<WhatsappLogo size={18} aria-hidden="true" />}
                    >
                      {t.reviews.leaveReview}
                    </ButtonLink>
                  )}
                </div>
              </Reveal>
            )}
          </div>

          {/* Карта не обёрнута в Reveal: трансформация обёртки ломает sticky */}
          {hasMap ? (
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <figure className="border border-divider bg-paper p-3 pb-5 shadow-postcard">
                  <iframe
                    src={site.googleMaps.embedSrc}
                    title={t.reviews.mapTitle}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    className="h-[320px] w-full border-0 grayscale-[.35] sepia-[.2] saturate-[.9] transition-[filter] duration-300 hover:grayscale-0 hover:sepia-0 hover:saturate-100 focus-visible:grayscale-0 focus-visible:sepia-0 focus-visible:saturate-100 motion-reduce:transition-none lg:h-[440px]"
                  />
                  <figcaption className="flex items-start gap-2 px-1 pt-4">
                    <MapPin size={16} weight="fill" aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
                    <span>
                      <span className="block font-condensed text-sm font-semibold uppercase tracking-caps text-ink">
                        {t.reviews.place}
                      </span>
                      {address ? <span className="mt-1 block text-sm leading-snug text-label">{address}</span> : null}
                    </span>
                  </figcaption>
                </figure>

                <div className="mt-5 flex flex-wrap gap-3">
                  <ButtonLink
                    href={site.googleMaps.placeUrl}
                    external
                    newTabLabel={t.a11y.newTab}
                    variant="outline-light"
                  >
                    {t.reviews.openMap}
                  </ButtonLink>
                  <ButtonLink href={directionsUrl()} external newTabLabel={t.a11y.newTab} variant="outline-light">
                    {t.reviews.directions}
                  </ButtonLink>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
