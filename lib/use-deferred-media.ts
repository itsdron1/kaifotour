"use client";

import { useEffect, useState } from "react";

const AFTER_LOAD_MS = 1000;

/**
 * Для фото ниже первого экрана: true при первой прокрутке или через секунду после загрузки страницы.
 * Браузер считает такие фото «почти видимыми» и качает сразу, вперемешку с тем, что на экране.
 */
export function useDeferredMedia(): boolean {
  const [wanted, setWanted] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    const want = () => setWanted(true);
    const onLoad = () => {
      timer = window.setTimeout(want, AFTER_LOAD_MS);
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    window.addEventListener("scroll", want, { once: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("scroll", want);
    };
  }, []);

  return wanted;
}
