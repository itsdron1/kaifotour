"use client";

import { useSyncExternalStore } from "react";
import { readConsentChoice, saveConsentChoice, type AnalyticsMode, type ConsentChoice } from "@/lib/analytics";

/**
 * Общее состояние баннера cookies для баннера, загрузчика и кнопки «Настройки cookie» в футере.
 * Режим аналитики выставляет встроенный скрипт до гидрации, выбор лежит в cookie.
 */
const CHANGE_EVENT = "kaifo-consent-change";
/** Баннер, открытый кнопкой в футере, видно и при уже сделанном выборе */
let reopened = false;

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

const notify = () => window.dispatchEvent(new Event(CHANGE_EVENT));

/** На сервере и при гидрации аналитики нет: всё, что от неё зависит, появляется после */
const serverSnapshot = () => null;

export function useAnalyticsMode(): AnalyticsMode | null {
  return useSyncExternalStore(subscribe, () => window.kaifoAnalytics ?? null, serverSnapshot);
}

export function useBannerShown(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => Boolean(window.kaifoAnalytics) && (reopened || readConsentChoice() === null),
    () => false,
  );
}

export function decideConsent(choice: ConsentChoice): void {
  saveConsentChoice(choice);
  reopened = false;
  notify();
}

export function reopenBanner(): void {
  reopened = true;
  notify();
}
