import type { Metadata } from "next";
import { getPublishedTour } from "@/data/tours";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { LegalDoc } from "@/lib/legal";
import { buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatPriceFrom } from "@/lib/tour-view";

/** Title с ценой длиннее этого Google обрезает в выдаче: тогда цену убираем, название оставляем */
const TITLE_LIMIT = 62;

export function homeMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale);
  return buildPageMetadata({
    locale,
    path: "/",
    title: t.meta.homeTitle,
    description: t.meta.homeDescription,
    absoluteTitle: true,
  });
}

export function catalogMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale);
  return buildPageMetadata({
    locale,
    path: "/tours",
    title: t.meta.toursTitle,
    description: t.meta.toursDescription,
  });
}

/**
 * «Mount Batur Sunrise Trekking in Bali — from 1.3M IDR | KAIFO».
 * Цену подставляет код из priceFromIDR, чтобы title не расходился с ценой тура;
 * у туров «по запросу» и там, где с ценой не помещается, title без цены.
 * Описание пишется для каждого тура отдельно, а не обрезается из текста тура.
 */
export function tourMetadata(locale: Locale, slug: string): Metadata {
  const tour = getPublishedTour(slug);
  if (!tour) return {};

  const name = tour.seoTitle[locale];
  const withPrice =
    tour.priceFromIDR === null ? null : `${name} — ${formatPriceFrom(tour.priceFromIDR, locale)} | ${site.name}`;
  const title = withPrice && withPrice.length <= TITLE_LIMIT ? withPrice : `${name} | ${site.name}`;

  return buildPageMetadata({
    locale,
    path: `/tours/${tour.slug}`,
    title,
    description: tour.seoDescription[locale],
    absoluteTitle: true,
  });
}

export function legalMetadata(locale: Locale, doc: LegalDoc): Metadata {
  const t = getDictionary(locale);
  return buildPageMetadata({
    locale,
    path: `/legal/${doc}`,
    title: t.legal.documents[doc],
    description: t.meta.legalDescription,
    noindex: true,
  });
}
