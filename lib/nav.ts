import { getDictionary } from "@/lib/dictionaries";
import { showReviewsSection } from "@/lib/reviews";
import { localizedPath, type Locale } from "@/lib/i18n";

export interface NavItem {
  href: string;
  label: string;
}

/** Пункты меню: STORIES / TOURS / REVIEWS / ABOUT / CONTACT. Отзывы появляются вместе с разделом */
export function mainNav(locale: Locale): NavItem[] {
  const t = getDictionary(locale).nav;
  return [
    { href: localizedPath(locale, "/#stories"), label: t.stories },
    { href: localizedPath(locale, "/#tours"), label: t.tours },
    ...(showReviewsSection ? [{ href: localizedPath(locale, "/#reviews"), label: t.reviews }] : []),
    { href: localizedPath(locale, "/#about"), label: t.about },
    { href: localizedPath(locale, "/#contact"), label: t.contact },
  ];
}
