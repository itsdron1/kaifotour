import { getDictionary } from "@/lib/dictionaries";
import { localizedPath, type Locale } from "@/lib/i18n";

export interface NavItem {
  href: string;
  label: string;
}

/** Пункты меню из docs/editorial-style.md: STORIES / TOURS / ABOUT / CONTACT */
export function mainNav(locale: Locale): NavItem[] {
  const t = getDictionary(locale).nav;
  return [
    { href: localizedPath(locale, "/#stories"), label: t.stories },
    { href: localizedPath(locale, "/#tours"), label: t.tours },
    { href: localizedPath(locale, "/#about"), label: t.about },
    { href: localizedPath(locale, "/#contact"), label: t.contact },
  ];
}
