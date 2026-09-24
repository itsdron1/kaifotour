import { reviews } from "@/data/reviews";
import { site } from "@/lib/site";

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
