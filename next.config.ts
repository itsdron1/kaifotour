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
    // Ширины без лишних: длинные списки раздувают HTML, в srcset каждой картинки идёт каждая ширина.
    // 480 нужна телефонам с плотным экраном: без неё карточка в 160px качалась шириной 640
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [96, 128, 256, 384, 480],
    qualities: [60, 75],
    // Месяц в кэше браузера и Vercel: без этого фото перепроверялись каждую минуту и пережимались заново.
    // При замене фото меняем его адрес
    minimumCacheTTL: 2678400,
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
