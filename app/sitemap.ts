import type { MetadataRoute } from "next";
import { publishedTours } from "@/data/tours";
import { defaultLocale, localizedPath, locales } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

/**
 * sitemap.xml: главная, каталог и опубликованные туры на всех языках.
 * У каждого адреса связки на все языки и x-default на английскую версию — так же, как в <head> страниц.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/tours", ...publishedTours.map((tour) => `/tours/${tour.slug}`)];
  const lastModified = new Date();

  return paths.flatMap((path) => {
    const languages: Record<string, string> = Object.fromEntries(
      locales.map((code) => [code, `${SITE_URL}${localizedPath(code, path)}`]),
    );
    languages["x-default"] = `${SITE_URL}${localizedPath(defaultLocale, path)}`;

    return locales.map((locale) => ({
      url: `${SITE_URL}${localizedPath(locale, path)}`,
      lastModified,
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path === "/tours" ? 0.9 : 0.8,
      alternates: { languages },
    }));
  });
}
