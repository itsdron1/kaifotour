"use client";

import { reopenBanner, useAnalyticsMode } from "@/components/analytics/consent-store";

/** Ссылка в футере, которая снова открывает баннер cookies. Без аналитики на хосте её нет */
export function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  const mode = useAnalyticsMode();
  if (!mode) return null;

  function open() {
    reopenBanner();
    // фокус на баннер, чтобы с клавиатуры не искать его внизу страницы
    window.setTimeout(() => document.querySelector<HTMLElement>("[data-cookie-banner] button")?.focus());
  }

  return (
    <button type="button" onClick={open} className={className}>
      {label}
    </button>
  );
}
