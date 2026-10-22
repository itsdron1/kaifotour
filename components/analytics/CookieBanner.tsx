"use client";

import Link from "next/link";
import { decideConsent, useBannerShown } from "@/components/analytics/consent-store";

export interface CookieBannerLabels {
  region: string;
  text: string;
  accept: string;
  decline: string;
  policy: string;
}

/**
 * Баннер согласия на cookies (Consent Mode v2). Пока посетитель не выбрал, аналитика работает
 * с запретом по умолчанию. «Принять» и «Отклонить» равноценны: одного размера и веса.
 * Выбор хранится в cookie на 6 месяцев; снова открыть баннер можно из футера («Настройки cookie»).
 * Баннер — узкая бумажная полоса снизу; на странице тура — над панелью брони (globals.css).
 * Появляется только там, где аналитика реально грузится.
 */
export function CookieBanner({ labels, policyHref }: { labels: CookieBannerLabels; policyHref: string }) {
  const shown = useBannerShown();
  if (!shown) return null;

  const button = "kicker flex-1 px-4 py-2.5 transition-colors duration-300 sm:min-w-[8.5rem] sm:flex-none";

  return (
    <div
      data-cookie-banner
      role="region"
      aria-label={labels.region}
      className="fixed inset-x-0 bottom-0 z-menu border-t border-divider bg-paper text-ink shadow-postcard"
    >
      <div className="mx-auto flex max-w-page flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-4 lg:px-12">
        <p className="text-[0.8125rem] leading-snug text-ink/80 sm:text-sm">
          {labels.text}{" "}
          <Link href={policyHref} className="link-underline whitespace-nowrap text-accent-ink">
            {labels.policy}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decideConsent("denied")}
            className={`${button} border border-ink/40 text-ink hover:border-ink`}
          >
            {labels.decline}
          </button>
          <button
            type="button"
            onClick={() => decideConsent("granted")}
            className={`${button} border border-accent bg-accent text-ink hover:border-[#D8AE60] hover:bg-[#D8AE60]`}
          >
            {labels.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
