import { resolveMedia, type PhotoSource } from "@/data/media";
import { reviews, type ReviewSource } from "@/data/reviews";
import { getGoogleReviews, type GoogleRating } from "@/lib/google-reviews";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { getTourCards } from "@/lib/tour-view";

/** Раздел «Отзывы» появляется, когда есть карта или хотя бы один отзыв */
export const showReviewsSection = reviews.length > 0 || site.googleMaps.embedSrc.length > 0;

/** Ссылка «Проложить маршрут» в Google Картах */
export function directionsUrl(): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.googleMaps.destination)}`;
}

/** «сент. 2026» / «Sep 2026» из строки вида 2026-09 */
export function reviewDateLabel(date: string, locale: Locale): string {
  const [year, month] = date.split("-").map(Number);
  if (!year || !month) return date;
  const label = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  // ru-RU дописывает « г.» — в подписи под отзывом он лишний
  return label.replace(/\s*г\.$/, "");
}

/**
 * Карточка отзыва на языке страницы. Текст ручных отзывов берётся из пары языков
 * в data/reviews.ts, отзывы из Google приходят уже переведёнными самим Google.
 */
export interface ReviewCardData {
  id: string;
  author: string;
  /** Профиль автора в Google: имя показываем ссылкой, этого требуют правила Google */
  authorUri?: string;
  location?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Текст на языке страницы */
  text: string;
  lang: Locale;
  /** Оригинал, если на карточке перевод */
  original?: { text: string; lang: Locale };
  /** Перевод сделал Google, а не мы */
  googleTranslated?: boolean;
  /** ГГГГ-ММ */
  date: string;
  dateLabel: string;
  source: ReviewSource;
  sourceUrl?: string;
  /** Кадр на открытке: фото тура, а без тура — общий кадр секции */
  image: PhotoSource;
  tour?: { slug: string; title: string; href: string };
}

/**
 * Все отзывы вместе, от новых к старым: собранные вручную из data/reviews.ts
 * и, если подключён Google, отзывы из профиля компании. Отзывы Google нигде не сохраняются.
 */
export async function getReviewCards(
  locale: Locale,
): Promise<{ cards: ReviewCardData[]; rating: GoogleRating | null }> {
  const fromGoogle = await getGoogleReviews(locale);
  const tours = getTourCards(locale);

  const manual: ReviewCardData[] = reviews.map((review) => {
    const tour = review.tourSlug ? tours.find((item) => item.slug === review.tourSlug) : undefined;
    const isTranslation = review.originalLang !== locale;

    return {
      id: review.id,
      author: review.author[locale],
      location: review.location?.[locale],
      rating: review.rating,
      text: review.text[locale],
      lang: locale,
      original: isTranslation ? { text: review.text[review.originalLang], lang: review.originalLang } : undefined,
      date: review.date,
      dateLabel: reviewDateLabel(review.date, locale),
      source: review.source,
      sourceUrl: review.sourceUrl,
      image: tour ? tour.image : resolveMedia("story", locale),
      tour: tour ? { slug: tour.slug, title: tour.title, href: tour.href } : undefined,
    };
  });

  const google: ReviewCardData[] = fromGoogle.reviews.map((review) => ({
    id: review.id,
    author: review.author,
    authorUri: review.authorUri,
    rating: review.rating,
    text: review.text,
    lang: review.lang,
    original: review.original,
    googleTranslated: review.googleTranslated,
    date: review.date,
    dateLabel: reviewDateLabel(review.date, locale),
    source: "google",
    sourceUrl: review.sourceUrl,
    image: resolveMedia("story", locale),
  }));

  const cards = [...manual, ...google].sort((a, b) => b.date.localeCompare(a.date));

  const rating =
    fromGoogle.rating ??
    (site.googleRating ? { ...site.googleRating, url: site.googleMaps.placeUrl || undefined } : null);

  return { cards, rating };
}
