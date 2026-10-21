"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { CONSENT_STORAGE_KEY, consentState, type ConsentChoice } from "@/lib/analytics";

export interface CookieBannerLabels {
  region: string;
  text: string;
  accept: string;
  decline: string;
  policy: string;
}

const CHANGE_EVENT = "kaifo-consent-change";
/** Если хранилище недоступно (приватный режим), выбор живёт до конца визита здесь */
let memoryChoice: ConsentChoice | null = null;

function readChoice(): ConsentChoice | null {
  try {
    const saved = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (saved === "granted" || saved === "denied") return saved;
  } catch {
    // хранилище закрыто — остаётся выбор из памяти
  }
  return memoryChoice;
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** На сервере и при гидрации баннер скрыт: выбор хранится только в браузере */
const serverSnapshot = () => "pending" as const;

/**
 * Баннер согласия на cookies (Consent Mode v2). Пока посетитель не выбрал, GTM работает
 * с запретом по умолчанию. «Принять» и «Отклонить» сохраняют выбор в браузере и сразу
 * обновляют согласие; при следующих визитах баннера нет, а выбор применяется до загрузки GTM.
 * Баннер не перекрывает сайт: узкая полоса снизу, на странице тура — над панелью брони.
 */
export function CookieBanner({ labels, policyHref }: { labels: CookieBannerLabels; policyHref: string }) {
  const choice = useSyncExternalStore(subscribe, readChoice, serverSnapshot);
  if (choice !== null) return null;

  function decide(value: ConsentChoice) {
    memoryChoice = value;
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
    } catch {
      // приватный режим: выбор действует до конца визита
    }
    window.gtag?.("consent", "update", consentState(value));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return (
    <div
      data-cookie-banner
      role="region"
      aria-label={labels.region}
      className="fixed inset-x-0 bottom-0 z-menu border-t border-on-dark/15 bg-deep text-on-dark shadow-postcard"
    >
      <div className="mx-auto flex max-w-page flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 lg:px-12">
        <p className="text-sm leading-snug text-on-dark/85">
          {labels.text}{" "}
          <Link href={policyHref} className="link-underline whitespace-nowrap text-accent">
            {labels.policy}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="kicker border border-steel/80 px-4 py-2.5 text-on-dark transition-colors duration-300 hover:border-on-dark"
          >
            {labels.decline}
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="kicker bg-accent px-4 py-2.5 text-ink transition-colors duration-300 hover:bg-[#D8AE60]"
          >
            {labels.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
