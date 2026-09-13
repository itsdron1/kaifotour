import type { MetadataRoute } from "next";
import { publishedTours } from "@/data/tours";
import { localizedPath, locales } from "@/lib/i18n";
import { site } from "@/lib/site";

/** sitemap.xml: главная, каталог и опубликованные туры на RU и EN с hreflang-альтернативами */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/tours", ...publishedTours.map((tour) => `/tours/${tour.slug}`)];
  const lastModified = new Date();

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${site.url}${localizedPath(locale, path)}`,
      lastModified,
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path === "/tours" ? 0.9 : 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((code) => [code, `${site.url}${localizedPath(code, path)}`])),
      },
    })),
  );
}
