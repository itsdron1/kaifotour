import type { Locale } from "@/lib/i18n";

export type ReviewSource = "google" | "instagram" | "whatsapp" | "tripadvisor";

export interface Review {
  id: string;
  author: string;
  /** Страна или город гостя */
  location?: string;
  /** slug тура из data/tours.ts, если отзыв о конкретном маршруте */
  tourSlug?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** Язык оригинала: текст показываем как есть, с атрибутом lang */
  lang: Locale;
  /** ГГГГ-ММ */
  date: string;
  source: ReviewSource;
  sourceUrl?: string;
}

/**
 * Отзывы гостей.
 *
 * Здесь только реальные отзывы, опубликованные с согласия гостя, слово в слово.
 * Примерных, тестовых и придуманных отзывов быть не должно даже как заглушек:
 * пока массив пустой, раздел показывает приглашение оставить отзыв.
 */
export const reviews: Review[] = [];
