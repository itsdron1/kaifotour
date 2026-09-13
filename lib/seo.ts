import type { Metadata } from "next";
import { defaultLocale, localizedPath, locales, openGraphLocale, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

/** Общие метаданные корневых layout (RU и EN) */
export const rootMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  applicationName: site.name,
  icons: { icon: "/favicon.svg" },
  formatDetection: { telephone: false, email: false, address: false },
};

interface PageMetadataOptions {
  locale: Locale;
  /** Путь без языкового префикса: "/", "/tours", "/tours/slug" */
  path: string;
  title: string;
  description: string;
  /** Заголовок без шаблона «| KAIFOTOUR BALI» */
  absoluteTitle?: boolean;
  noindex?: boolean;
}

/** Мета-теги страницы: canonical, hreflang RU/EN, Open Graph и Twitter */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
  noindex = false,
}: PageMetadataOptions): Metadata {
  const url = localizedPath(locale, path);
  const languages: Record<string, string> = Object.fromEntries(locales.map((code) => [code, localizedPath(code, path)]));
  languages["x-default"] = localizedPath(defaultLocale, path);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: openGraphLocale[locale],
      alternateLocale: locales.filter((code) => code !== locale).map((code) => openGraphLocale[code]),
      url,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

/** JSON-LD для <script type="application/ld+json">, безопасный для вставки в HTML */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
