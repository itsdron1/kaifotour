"use client";

import { useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * prefers-reduced-motion без расхождения с серверным HTML. Сервер настройки не знает, поэтому первый проход
 * на клиенте тоже считает, что анимации включены, и только потом учитывает её. useReducedMotion из Motion отвечает
 * сразу, и там, где от него зависит разметка, React падал с ошибкой гидрации #418.
 */
export function useSafeReducedMotion(): boolean {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const reduced = useReducedMotion();
  return hydrated && reduced === true;
}
