"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Новая страница открывается сверху.
 *
 * Next сбрасывает прокрутку не всегда: если предыдущая страница была намного длиннее
 * (главная с длинной дорожкой hero — 11 000px против 3 800px у страницы тура),
 * браузер прижимает старую позицию к новому максимуму, и тур открывается снизу.
 *
 * Флаги держим в модуле, а не в ref: при переходе компонент монтируется заново,
 * а модуль остаётся живым, и по нему видно, это первая загрузка или переход.
 * Кнопки «назад» и «вперёд» не трогаем — там позицию восстанавливает браузер;
 * переходы по якорю тоже: прокрутку ведёт сам якорь.
 */
let initialLoad = true;
let historyNavigation = false;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    historyNavigation = true;
  });
}

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (initialLoad) {
      initialLoad = false;
      return;
    }
    if (historyNavigation) {
      historyNavigation = false;
      return;
    }
    if (window.location.hash) return;

    // Строго мгновенно: у html стоит scroll-behavior: smooth, и обычный scrollTo уехал бы
    // в плавную анимацию — на переходе между страницами она не нужна и не всегда доигрывает
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
