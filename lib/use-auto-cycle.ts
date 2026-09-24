"use client";

import { useCallback, useEffect, useState } from "react";

interface AutoCycleOptions {
  /** false при prefers-reduced-motion: карточки листаются только вручную */
  enabled: boolean;
  /** Наведение, фокус, тап по стопке или кнопка паузы */
  paused: boolean;
}

export interface AutoCycle {
  index: number;
  /** Счётчик смен: по нему перезапускается индикатор и анимация перекладывания */
  cycle: number;
  /** Идёт ли сейчас отсчёт до следующей смены */
  running: boolean;
  /** Ручное листание: отсчёт начинается заново, а не продолжается с места */
  go: (direction: 1 | -1) => void;
}

/**
 * Таймер автосмены с паузой. Отсчёт начинается заново после каждой смены,
 * ручного листания и снятия паузы, поэтому после возвращения на вкладку
 * не проигрывается серия накопившихся смен подряд.
 */
export function useAutoCycle(length: number, delay: number, { enabled, paused }: AutoCycleOptions): AutoCycle {
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  const running = enabled && !paused && !hidden && length > 1;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      setIndex((value) => (value + 1) % length);
      setCycle((value) => value + 1);
    }, delay);
    return () => window.clearTimeout(timer);
    // cycle в зависимостях: после каждой смены таймер заводится заново
  }, [running, delay, length, cycle]);

  const go = useCallback(
    (direction: 1 | -1) => {
      setIndex((value) => (value + direction + length) % length);
      setCycle((value) => value + 1);
    },
    [length],
  );

  return { index, cycle, running, go };
}
