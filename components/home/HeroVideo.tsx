"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/** В стандартных типах Navigator нет Network Information API: он есть только в части браузеров */
interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

const SLOW_NETWORKS = ["slow-2g", "2g", "3g"];

/** Когда видео не грузим совсем и оставляем постер */
function videoIsUnwanted(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return Boolean(connection?.saveData) || SLOW_NETWORKS.includes(connection?.effectiveType ?? "");
}

interface HeroVideoProps {
  src: string;
  mobileSrc: string;
  /** Медиазапрос телефона: тот же, что выбирает постер в HeroMedia */
  phoneQuery: string;
}

/**
 * Видео поверх постера. Адрес файла задаётся только после события load и только один, под ширину экрана,
 * поэтому браузер не качает оба видео и не мешает LCP. Вне экрана и на свёрнутой вкладке видео стоит на паузе.
 * Проявляется, когда реально заиграло; если автозапуск запрещён или файл не загрузился, остаётся постер.
 */
export function HeroVideo({ src, mobileSrc, phoneQuery }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || videoIsUnwanted()) return;

    let loaded = document.readyState === "complete";
    let inView = false;

    const sync = () => {
      if (!loaded || !inView || document.hidden) {
        video.pause();
        return;
      }
      if (!video.getAttribute("src")) video.src = window.matchMedia(phoneQuery).matches ? mobileSrc : src;
      video.play().catch(() => {
        // Режим энергосбережения или запрет автозапуска: остаётся постер
      });
    };

    const onLoad = () => {
      loaded = true;
      sync();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });

    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("load", onLoad);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("load", onLoad);
    };
  }, [mobileSrc, phoneQuery, src]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      aria-hidden="true"
      onPlaying={() => setPlaying(true)}
      className={cn(
        "absolute inset-0 h-full w-full object-cover transition-opacity duration-[400ms]",
        playing ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
