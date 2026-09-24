import type { PhotoSource } from "@/data/media";
import { resolveMedia } from "@/data/media";
import { reviews } from "@/data/reviews";
import { getGoogleReviews, type GoogleRating, type ReviewFromGoogle } from "@/lib/google-reviews";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { getTourCards } from "@/lib/tour-view";

/** Раздел «Отзывы» появляется, когда есть карта или хотя бы один отзыв */
export const showReviewsSection = reviews.length > 0 || site.googleMaps.embedSrc.length > 0;

/** Ссылка «Проложить маршрут» в Google Картах */
export function directionsUrl(): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.googleMaps.destination)}`;
}

/** Инициалы для кружка вместо фото гостя */
export function initialsOf(author: string): string {
  return author
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** «Сентябрь 2026» / «September 2026» из строки вида 2026-09 */
export function reviewDateLabel(date: string, locale: string): string {
  const [year, month] = date.split("-").map(Number);
  if (!year || !month) return date;
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Карточка отзыва на одном языке: всё, что нужно клиентскому компоненту */
export interface ReviewCardData extends ReviewFromGoogle {
  /** Кадр на открытке: фото тура, а без тура — общий кадр секции */
  image: PhotoSource;
  /** Тур, о котором отзыв: фото на карточке и ссылка на страницу тура */
  tour?: { slug: string; title: string; href: string; image: PhotoSource };
  /** «Сентябрь 2026» / «September 2026» */
  dateLabel: string;
}

/**
 * Все отзывы вместе, от новых к старым: вручную собранные из data/reviews.ts
 * и, если подключён Google, отзывы из профиля компании. Отзывы Google нигде не сохраняются.
 */
export async function getReviewCards(
  locale: Locale,
): Promise<{ cards: ReviewCardData[]; rating: GoogleRating | null }> {
  const fromGoogle = await getGoogleReviews(locale);
  const tours = getTourCards(locale);

  const cards = [...reviews, ...fromGoogle.reviews]
    .map((review) => {
      const tour = review.tourSlug ? tours.find((item) => item.slug === review.tourSlug) : undefined;
      return {
        ...review,
        image: tour ? tour.image : resolveMedia("story", locale),
        dateLabel: reviewDateLabel(review.date, locale),
        tour: tour ? { slug: tour.slug, title: tour.title, href: tour.href, image: tour.image } : undefined,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const rating =
    fromGoogle.rating ??
    (site.googleRating
      ? { ...site.googleRating, url: site.googleMaps.placeUrl || undefined }
      : null);

  return { cards, rating };
}
