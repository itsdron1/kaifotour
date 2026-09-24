import type { Localized } from "@/lib/i18n";

interface GoogleMapsConfig {
  /** src для iframe: подходит и код из «Встраивание карт», и форма maps.google.com/maps?...&output=embed */
  embedSrc: string;
  /** Обычная ссылка на точку для кнопки «Открыть в Google Картах» */
  placeUrl: string;
  /** Ссылка «Оставить отзыв» из профиля компании. Пустая — ссылку не показываем */
  reviewUrl: string;
  /** Координаты точки «широта,долгота» для маршрута и JSON-LD */
  destination: string;
}

/** Точка KAIFO на карте: координаты из ссылки профиля компании в Google */
const googleMaps: GoogleMapsConfig = {
  embedSrc:
    "https://maps.google.com/maps?q=KAIFO%20Bali%20%7C%20Tours%20%26%20Activities&ll=-8.8018513,115.2129072&z=16&output=embed",
  placeUrl: "https://maps.app.goo.gl/HK4zf7YeTPh8icdv6",
  reviewUrl: "",
  destination: "-8.8018513,115.2129072",
};

/** Адрес точки из профиля компании в Google. Пустой — в подписи под картой только название */
const address: Localized = {
  en: "Ithon Mart Kuruksetra, Jl. Kuruksetra, Benoa, Kuta Selatan, Badung Regency, Bali 80361, Indonesia",
  ru: "Ithon Mart Kuruksetra, Jl. Kuruksetra, Беноа, Кута-Селатан, Бадунг, Бали 80361, Индонезия",
};

/**
 * Рейтинг Google: бейдж показываем только с реальными цифрами.
 * Снято с профиля вручную 24.09.2026 и вручную же обновляется.
 * Как только в окружении появятся GOOGLE_PLACE_ID и GOOGLE_PLACES_API_KEY,
 * lib/google-reviews.ts начнёт присылать свежие цифры и эти перекроет.
 */
const googleRating = { value: 5, count: 11 } as { value: number; count: number } | null;

/** Подтверждённые контакты и бренд (docs/tz-main.md, раздел 2) */
export const site = {
  name: "KAIFO",
  url: "https://kaifotour-bali.com",
  /** Палитра из docs/tz-main.md, раздел 4: "deep-ocean-brass" | "basalt-copper" | "jungle-gold" */
  palette: "deep-ocean-brass",
  /** Цвет интерфейса браузера на мобильных = тёмная база палитры */
  themeColor: "#0F2230",
  whatsapp: {
    display: "+62 851-9010-1270",
    number: "6285190101270",
  },
  instagram: {
    handle: "@kaifo.bali",
    url: "https://instagram.com/kaifo.bali",
  },
  email: "kaifotourbali@gmail.com",
  googleMaps,
  address,
  googleRating,
} as const;
