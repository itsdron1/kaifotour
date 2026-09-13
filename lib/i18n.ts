export const locales = ["ru", "en"] as const;

export type Locale = (typeof locales)[number];

/** Русская версия живёт в корне (/, /tours/...), английская под префиксом /en */
export const defaultLocale: Locale = "ru";

export type Localized<T = string> = Record<Locale, T>;

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

/** Тот же адрес на другом языке, для переключателя RU / EN */
export function switchLocalePath(pathname: string, target: Locale): string {
  const bare = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return localizedPath(target, bare);
}

export const openGraphLocale: Localized = {
  ru: "ru_RU",
  en: "en_US",
};
