/**
 * Аналитика сайта: Google Analytics 4 напрямую (gtag.js) или, если задан NEXT_PUBLIC_GTM_ID,
 * через Google Tag Manager — но никогда обе сразу. Всё отслеживание идёт через этот файл:
 * клики по ссылкам ловит один общий обработчик (components/analytics/AnalyticsEvents.tsx),
 * а не каждый компонент сам по себе. Описание событий и проверка — docs/analytics.md.
 */
import { ANALYTICS_HOSTS } from "@/lib/site";

export type AnalyticsEventName =
  | "whatsapp_click"
  | "plan_form_submit"
  | "instagram_click"
  | "phone_click"
  | "email_click";

export type ConsentChoice = "granted" | "denied";

/** ga — прямой gtag.js, gtm — Google Tag Manager. Пусто — аналитика на этом хосте не грузится */
export type AnalyticsMode = "ga" | "gtm";

/** Выбор посетителя в баннере: cookie на 6 месяцев, читается встроенным скриптом до загрузки gtag */
export const CONSENT_COOKIE = "kaifo_consent";
const CONSENT_MAX_AGE = 60 * 60 * 24 * 182;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    kaifoAnalytics?: AnalyticsMode;
  }
}

/**
 * Событие в GA4. С gtag.js в отчёты попадает только gtag('event'), простой push в dataLayer
 * без GTM теряется. Пока аналитика не загружена (localhost, превью Vercel) — тихо ничего не делаем.
 */
export function track(event: AnalyticsEventName, params: Record<string, string | undefined>): void {
  if (typeof window === "undefined") return;
  const payload = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));
  if (window.kaifoAnalytics === "ga") window.gtag?.("event", event, { ...payload, transport_type: "beacon" });
  else if (window.kaifoAnalytics === "gtm") window.dataLayer?.push({ event, ...payload });
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
 * Где на странице кнопка: ближайший data-placement (hero, hero_stack, tour_circle, tour_card,
 * tour_page, sticky_book, catalog, footer, form, header, menu), иначе id секции главной
 * (reviews, faq, stories…), иначе page.
 */
export function placementOf(element: Element): string {
  const tagged = element.closest<HTMLElement>("[data-placement]");
  if (tagged?.dataset.placement) return tagged.dataset.placement;
  return element.closest("section[id]")?.id ?? "page";
}

/** Тур, к которому относится кнопка: ближайший data-tour-slug, иначе general */
export function tourSlugOf(element: Element): string {
  return element.closest<HTMLElement>("[data-tour-slug]")?.dataset.tourSlug ?? "general";
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

export function readConsentChoice(): ConsentChoice | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(granted|denied)`));
  return match ? (match[1] as ConsentChoice) : null;
}

/** Сохраняет выбор на 6 месяцев и сразу сообщает его gtag */
export function saveConsentChoice(choice: ConsentChoice): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${choice}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  window.gtag?.("consent", "update", consentState(choice));
}

/**
 * Встроенный скрипт, который выполняется при разборе страницы, до загрузки gtag.js или GTM.
 * Порядок важен и виден в HTML: consent default → сохранённый выбор → js → config.
 * На хостах не из ANALYTICS_HOSTS скрипт ничего не делает, и gtag.js потом не грузится.
 */
export function analyticsInitScript(mode: AnalyticsMode, id: string): string {
  const denied = JSON.stringify({ ...consentState("denied"), wait_for_update: 500 });
  const granted = JSON.stringify(consentState("granted"));
  const start =
    mode === "ga"
      ? `gtag('js',new Date());gtag('config',${JSON.stringify(id)});`
      : `dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`;
  return `(function(){
if(${JSON.stringify(ANALYTICS_HOSTS)}.indexOf(location.hostname)<0)return;
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',${denied});
if(/(?:^|; )${CONSENT_COOKIE}=granted/.test(document.cookie))gtag('consent','update',${granted});
window.kaifoAnalytics='${mode}';
${start}
})();`;
}

/** Адрес библиотеки для режима: gtag.js для GA4 или gtm.js для контейнера GTM */
export function analyticsScriptSrc(mode: AnalyticsMode, id: string): string {
  const file = mode === "ga" ? "gtag/js" : "gtm.js";
  return `https://www.googletagmanager.com/${file}?id=${encodeURIComponent(id)}`;
}
