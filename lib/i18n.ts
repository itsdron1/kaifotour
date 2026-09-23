export const locales = ["en", "ru"] as const;

export type Locale = (typeof locales)[number];

/** Английская версия живёт в корне (/, /tours/...), русская под префиксом /ru */
export const defaultLocale: Locale = "en";

/** Выбор языка помнится год: cookie ставит переключатель, читает middleware */
export const localeCookie = "NEXT_LOCALE";
export const localeCookieMaxAge = 60 * 60 * 24 * 365;

export type Localized<T = string> = Record<Locale, T>;

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (locales as readonly string[]).includes(value);
}

export function localePrefix(locale: Locale): string {
  return locale === defaultLocale ? "" : `/${locale}`;
}

/** Путь внутри сайта для нужного языка: "/", "/tours", "/tours/slug" или якорь главной "/#tours" */
export function localizedPath(locale: Locale, path: string): string {
  const prefix = localePrefix(locale);
  if (path === "/") return prefix || "/";
  if (path.startsWith("/#")) return prefix ? `${prefix}${path.slice(1)}` : path;
  return `${prefix}${path}`;
}

/** Тот же адрес на другом языке, для переключателя EN / RU */
export function switchLocalePath(pathname: string, target: Locale): string {
  const bare = pathname.replace(/^\/ru(?=\/|$)/, "") || "/";
  return localizedPath(target, bare);
}

export const openGraphLocale: Localized = {
  ru: "ru_RU",
  en: "en_US",
};
