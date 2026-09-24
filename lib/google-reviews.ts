import type { Review } from "@/data/reviews";
import type { Locale } from "@/lib/i18n";

/**
 * Отзывы из профиля KAIFO в Google. Работает, только если заданы обе переменные окружения:
 * GOOGLE_PLACE_ID и GOOGLE_PLACES_API_KEY. Ключ серверный, без префикса NEXT_PUBLIC,
 * лежит в .env.local и в переменных Vercel и не попадает в репозиторий и в браузер.
 * Если переменных нет или запрос упал — возвращаем пусто, раздел показывает только ручные отзывы.
 */
const ENDPOINT = "https://places.googleapis.com/v1/places";
const FIELD_MASK = "rating,userRatingCount,reviews,googleMapsUri";
/** Раз в сутки: около 30 запросов в месяц */
const REVALIDATE_SECONDS = 86_400;

export interface GoogleRating {
  value: number;
  count: number;
  url?: string;
}

export interface ReviewFromGoogle extends Review {
  /** Профиль автора в Google: показывать имя ссылкой требуют правила Google */
  authorUri?: string;
  /** Текст перевёл Google: язык оригинала отличается от языка страницы */
  translated?: boolean;
}

export interface GoogleReviewsResult {
  reviews: ReviewFromGoogle[];
  rating: GoogleRating | null;
}

const EMPTY: GoogleReviewsResult = { reviews: [], rating: null };

interface PlacesText {
  text?: string;
  languageCode?: string;
}

interface PlacesReview {
  name?: string;
  rating?: number;
  text?: PlacesText;
  originalText?: PlacesText;
  publishTime?: string;
  googleMapsUri?: string;
  authorAttribution?: { displayName?: string; uri?: string };
}

interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
}

const clampRating = (value: number): Review["rating"] => {
  const rounded = Math.min(Math.max(Math.round(value), 1), 5);
  return rounded as Review["rating"];
};

function toReview(review: PlacesReview, locale: Locale, placeUrl?: string): ReviewFromGoogle | null {
  const text = review.text?.text?.trim();
  const author = review.authorAttribution?.displayName?.trim();
  if (!text || !author || !review.rating || !review.publishTime) return null;

  const originalLanguage = review.originalText?.languageCode;
  const shownLanguage = review.text?.languageCode ?? locale;

  return {
    id: review.name ?? `${author}-${review.publishTime}`,
    author,
    rating: clampRating(review.rating),
    text,
    lang: shownLanguage.startsWith("ru") ? "ru" : "en",
    date: review.publishTime.slice(0, 7),
    source: "google",
    sourceUrl: review.googleMapsUri ?? placeUrl,
    authorUri: review.authorAttribution?.uri,
    translated: Boolean(originalLanguage && originalLanguage !== shownLanguage),
  };
}

export async function getGoogleReviews(locale: Locale): Promise<GoogleReviewsResult> {
  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!placeId || !apiKey) return EMPTY;

  try {
    const response = await fetch(`${ENDPOINT}/${encodeURIComponent(placeId)}?languageCode=${locale}`, {
      headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": FIELD_MASK },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.error(`[google-reviews] Places API ответил ${response.status} ${response.statusText}`);
      return EMPTY;
    }

    const data = (await response.json()) as PlacesResponse;
    const reviews = (data.reviews ?? [])
      .map((review) => toReview(review, locale, data.googleMapsUri))
      .filter((review): review is ReviewFromGoogle => review !== null);

    const rating =
      typeof data.rating === "number" && typeof data.userRatingCount === "number"
        ? { value: data.rating, count: data.userRatingCount, url: data.googleMapsUri }
        : null;

    return { reviews, rating };
  } catch (error) {
    console.error("[google-reviews] запрос не удался:", error);
    return EMPTY;
  }
}
