import { AnalyticsEvents } from "@/components/analytics/AnalyticsEvents";
import { AnalyticsLoader } from "@/components/analytics/AnalyticsLoader";
import { CookieBanner } from "@/components/analytics/CookieBanner";
import { analyticsInitScript, analyticsScriptSrc, type AnalyticsMode } from "@/lib/analytics";
import { getDictionary } from "@/lib/dictionaries";
import { localizedPath, type Locale } from "@/lib/i18n";
import { GA_MEASUREMENT_ID } from "@/lib/site";

/**
 * Google Analytics 4 с Consent Mode v2, баннером cookies и событиями конверсий.
 * По умолчанию — прямой gtag.js с GA_MEASUREMENT_ID. Если задан NEXT_PUBLIC_GTM_ID, вместо него
 * грузится контейнер GTM (GA4 тогда настраивается внутри GTM), чтобы визиты не считались дважды.
 * Грузится только на хостах из ANALYTICS_HOSTS: на localhost и *.vercel.app нет ни скриптов, ни баннера.
 */
export function SiteAnalytics({ locale }: { locale: Locale }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const mode: AnalyticsMode = gtmId ? "gtm" : "ga";
  const id = gtmId ?? GA_MEASUREMENT_ID;
  const t = getDictionary(locale);

  return (
    <>
      {/* Выполняется при разборе страницы, до gtag.js: согласие по умолчанию раньше config */}
      <script id="analytics-init" dangerouslySetInnerHTML={{ __html: analyticsInitScript(mode, id) }} />
      <AnalyticsLoader src={analyticsScriptSrc(mode, id)} />
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
