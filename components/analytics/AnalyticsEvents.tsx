"use client";

import { useEffect } from "react";
import { eventForHref, placementOf, tourSlugOf, track } from "@/lib/analytics";

/**
 * Один обработчик на весь документ: любая ссылка на WhatsApp, Instagram, телефон или почту
 * превращается в событие для GTM. Компонентам ничего добавлять не нужно —
 * достаточно data-placement и data-tour-slug на своём блоке, чтобы событие знало, откуда клик.
 */
export function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Отменённый переход (свайп, первый тап по карточке) — не обращение
      if (event.defaultPrevented) return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!link) return;

      const name = eventForHref(link.getAttribute("href") ?? "");
      if (!name) return;

      const locale = document.documentElement.lang;
      const placement = placementOf(link);
      track(name, name === "whatsapp_click" ? { tour_slug: tourSlugOf(link), placement, locale } : { placement, locale });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
