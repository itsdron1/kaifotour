"use client";

import Script from "next/script";
import { useAnalyticsMode } from "@/components/analytics/consent-store";

/**
 * Загружает gtag.js (или gtm.js) после гидрации, и только если встроенный скрипт
 * признал хост боевым. Очередь команд в dataLayer к этому моменту уже стоит в нужном порядке.
 */
export function AnalyticsLoader({ src }: { src: string }) {
  const mode = useAnalyticsMode();
  if (!mode) return null;
  return <Script id="analytics-lib" src={src} strategy="afterInteractive" />;
}
