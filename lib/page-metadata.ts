import type { Metadata } from "next";
import { getPublishedTour } from "@/data/tours";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { LegalDoc } from "@/lib/legal";
import { buildPageMetadata } from "@/lib/seo";

const DESCRIPTION_LIMIT = 158;

function truncate(text: string, limit = DESCRIPTION_LIMIT): string {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1).replace(/\s+\S*$/, "")}…`;
}

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

export function tourMetadata(locale: Locale, slug: string): Metadata {
  const tour = getPublishedTour(slug);
  if (!tour) return {};
  const t = getDictionary(locale);
  return buildPageMetadata({
    locale,
    path: `/tours/${tour.slug}`,
    title: tour.title,
    description: truncate(`${tour.lead[locale]} ${t.meta.tourSuffix}`),
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
