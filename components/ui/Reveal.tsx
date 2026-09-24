"use client";

import { motion } from "motion/react";
import { DURATION_REVEAL, EASE_REVEAL } from "@/lib/motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Спокойное появление блока при скролле: 600 мс, только opacity и transform.
 * При prefers-reduced-motion MotionConfig (reducedMotion="user") отключает сдвиг,
 * а разметка остаётся одинаковой на сервере и клиенте.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: DURATION_REVEAL, delay, ease: EASE_REVEAL }}
    >
      {children}
    </motion.div>
  );
}
