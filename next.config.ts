import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Корень проекта задан явно: выше по дереву лежит чужой package-lock.json
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Временные стоковые фото (Pexels) до получения собственных фото заказчика.
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
  },
  async headers() {
    return [
      // Видео и постеры первого экрана кэшируются на год: при замене файла меняем его имя (см. CLAUDE.md)
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Технические адреса Vercel (kaifotour-bav1.vercel.app и превью) не индексируются:
      // иначе Google видит в них копию основного сайта
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.*\\.vercel\\.app)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
