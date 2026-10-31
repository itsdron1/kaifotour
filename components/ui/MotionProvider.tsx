"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * Все анимации Motion уважают системную настройку prefers-reduced-motion.
 * LazyMotion и компонент m вместо motion: в сборку не попадают drag и layout-анимации, которых на сайте нет.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
