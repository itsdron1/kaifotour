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
};

export default nextConfig;
