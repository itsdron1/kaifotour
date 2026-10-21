import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt. Строки Host нет: её понимал только Яндекс, и он её больше не использует.
 * Технические адреса *.vercel.app закрыты от индексации заголовком X-Robots-Tag в next.config.ts.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
