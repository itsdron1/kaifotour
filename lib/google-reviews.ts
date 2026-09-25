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

/**
 * Отзыв из Google приходит уже на языке страницы, поэтому у него один текст, а не пара языков,
 * как у отзывов из data/reviews.ts. Если Google перевёл отзыв сам, рядом лежит оригинал.
 */
export interface ReviewFromGoogle {
  id: string;
  author: string;
  /** Профиль автора в Google: показывать имя ссылкой требуют правила Google */
  authorUri?: string;
  rating: Review["rating"];
  text: string;
  /** Язык показываемого текста */
  lang: Locale;
  /** Оригинал, если показан перевод Google */
  original?: { text: string; lang: Locale };
  googleTranslated: boolean;
  /** ГГГГ-ММ */
  date: string;
  sourceUrl?: string;
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

  const shownLanguage = review.text?.languageCode ?? locale;
  const originalLanguage = review.originalText?.languageCode;
  const originalText = review.originalText?.text?.trim();
  const googleTranslated = Boolean(originalLanguage && originalLanguage !== shownLanguage);

  return {
    id: review.name ?? `${author}-${review.publishTime}`,
    author,
    rating: clampRating(review.rating),
    text,
    lang: shownLanguage.startsWith("ru") ? "ru" : "en",
    original:
      googleTranslated && originalText
        ? { text: originalText, lang: originalLanguage?.startsWith("ru") ? "ru" : "en" }
        : undefined,
    googleTranslated,
    date: review.publishTime.slice(0, 7),
    sourceUrl: review.googleMapsUri ?? placeUrl,
    authorUri: review.authorAttribution?.uri,
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
