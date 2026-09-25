import { resolveMedia, type PhotoSource } from "@/data/media";
import {
  categoryLabel,
  publishedTours,
  tourNumber,
  type DurationBucket,
  type Environment,
  type Tour,
  type TourCategory,
} from "@/data/tours";
import { getDictionary } from "@/lib/dictionaries";
import { formatIDR, formatIDRCompact } from "@/lib/format";
import { localizedPath, type Locale } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/whatsapp";

export type PriceBucket = "under-500k" | "500k-1500k" | "over-1500k" | "on-request";

/** Сериализуемые данные карточки тура на одном языке: безопасно передавать в клиентские компоненты */
export interface TourCardData {
  slug: string;
  href: string;
  number: string;
  title: string;
  kicker: string;
  lead: string;
  includes: string[];
  category: TourCategory;
  categoryLabel: string;
  environment: Environment;
  duration: DurationBucket | null;
  durationLabel: string;
  collections: string[];
  priceFromIDR: number | null;
  priceBucket: PriceBucket;
  priceLabel: string;
  badgeLabel: string | null;
  bookHref: string;
  image: PhotoSource;
}

export function getPriceBucket(price: number | null): PriceBucket {
  if (price === null) return "on-request";
  if (price < 500_000) return "under-500k";
  if (price < 1_500_000) return "500k-1500k";
  return "over-1500k";
}

/** "от 850K IDR" / "from 1 600 000 IDR" / "Цена по запросу" */
export function formatPriceFrom(price: number | null, locale: Locale, compact = true): string {
  const t = getDictionary(locale);
  if (price === null) return t.price.onRequest;
  return `${t.price.from} ${compact ? formatIDRCompact(price, locale) : formatIDR(price, locale)}`;
}

export function tourHref(slug: string, locale: Locale): string {
  return localizedPath(locale, `/tours/${slug}`);
}

export function toTourCard(tour: Tour, locale: Locale): TourCardData {
  const t = getDictionary(locale);
  return {
    slug: tour.slug,
    href: tourHref(tour.slug, locale),
    number: tourNumber(tour),
    title: tour.title,
    kicker: tour.kicker[locale],
    lead: tour.lead[locale],
    includes: tour.includes[locale],
    category: tour.category,
    categoryLabel: categoryLabel(tour.category, locale),
    environment: tour.environment,
    duration: tour.duration,
    durationLabel: tour.durationLabel[locale],
    collections: tour.collections,
    priceFromIDR: tour.priceFromIDR,
    priceBucket: getPriceBucket(tour.priceFromIDR),
    priceLabel: formatPriceFrom(tour.priceFromIDR, locale),
    badgeLabel: tour.badge === "new" ? t.tour.badgeNew : null,
    bookHref: whatsappUrl(tour.ctaWhatsappText[locale]),
    image: resolveMedia(tour.image, locale),
  };
}

export function getTourCards(locale: Locale): TourCardData[] {
  return publishedTours.map((tour) => toTourCard(tour, locale));
}
