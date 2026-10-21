/**
 * События для Google Tag Manager. Всё отслеживание сайта идёт через этот файл:
 * клики по ссылкам ловит один общий обработчик (components/analytics/AnalyticsEvents.tsx),
 * а не каждый компонент сам по себе. Описание событий и настройка GTM — docs/analytics.md.
 */

export type AnalyticsEventName =
  | "whatsapp_click"
  | "plan_form_submit"
  | "instagram_click"
  | "phone_click"
  | "email_click";

export type ConsentChoice = "granted" | "denied";

/** Выбор посетителя в баннере cookies: хранится в браузере, читается до загрузки GTM */
export const CONSENT_STORAGE_KEY = "kaifo-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Событие в dataLayer. Если GTM не загружен, массив просто копится — это безопасно */
export function track(event: AnalyticsEventName, params: Record<string, string | undefined>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

/** Какое событие означает переход по ссылке: WhatsApp, Instagram, звонок или письмо */
export function eventForHref(href: string): AnalyticsEventName | null {
  if (/^https?:\/\/(?:wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)\//i.test(href)) return "whatsapp_click";
  if (/^https?:\/\/(?:www\.)?instagram\.com\//i.test(href)) return "instagram_click";
  if (href.startsWith("tel:")) return "phone_click";
  if (href.startsWith("mailto:")) return "email_click";
  return null;
}

/**
 * Где на странице кнопка: ближайший data-placement (hero, tour_card, tour_page, sticky_book,
 * footer, form, header, menu), иначе id секции главной (reviews, faq, stories…), иначе page.
 */
export function placementOf(element: Element): string {
  const tagged = element.closest<HTMLElement>("[data-placement]");
  if (tagged?.dataset.placement) return tagged.dataset.placement;
  return element.closest("section[id]")?.id ?? "page";
}

/** Тур, к которому относится кнопка: ближайший data-tour-slug */
export function tourSlugOf(element: Element): string | undefined {
  return element.closest<HTMLElement>("[data-tour-slug]")?.dataset.tourSlug;
}

/** Состояние согласия для gtag: принять — всё granted, отказ — всё denied */
export function consentState(choice: ConsentChoice) {
  return {
    ad_storage: choice,
    analytics_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
  };
}

/**
 * Встроенный скрипт, который выполняется до загрузки GTM: по умолчанию всё запрещено
 * (Consent Mode v2), а если посетитель уже соглашался раньше — сразу разрешаем.
 */
export const consentDefaultScript = `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
try{if(localStorage.getItem('${CONSENT_STORAGE_KEY}')==='granted'){gtag('consent','update',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});}}catch(e){}`;
