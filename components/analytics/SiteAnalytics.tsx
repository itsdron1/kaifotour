import { GoogleTagManager } from "@next/third-parties/google";
import { AnalyticsEvents } from "@/components/analytics/AnalyticsEvents";
import { CookieBanner } from "@/components/analytics/CookieBanner";
import { consentDefaultScript } from "@/lib/analytics";
import { getDictionary } from "@/lib/dictionaries";
import { localizedPath, type Locale } from "@/lib/i18n";

/**
 * Google Tag Manager с Consent Mode v2, баннером cookies и событиями конверсий.
 * Подключается, только если задан NEXT_PUBLIC_GTM_ID (.env.local локально, Environment Variables
 * на Vercel). Без него ничего не грузится и баннера нет: Vercel Analytics работает без cookies.
 */
export function SiteAnalytics({ locale }: { locale: Locale }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId) return null;

  const t = getDictionary(locale);

  return (
    <>
      {/* Согласие по умолчанию задаётся до загрузки GTM: встроенный скрипт выполняется при разборе страницы */}
      <script id="consent-default" dangerouslySetInnerHTML={{ __html: consentDefaultScript }} />
      <GoogleTagManager gtmId={gtmId} />
      <AnalyticsEvents />
      <CookieBanner
        policyHref={localizedPath(locale, "/legal/cookies")}
        labels={{
          region: t.consent.region,
          text: t.consent.text,
          accept: t.consent.accept,
          decline: t.consent.decline,
          policy: t.consent.policy,
        }}
      />
    </>
  );
}
