"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Photo, type PhotoSource } from "@/components/ui/Photo";

/**
 * Фон hero: фото медленнее контента (parallax) и постепенно темнеет,
 * пока следующая секция «наплывает» сверху (docs/editorial-style.md, раздел 3).
 * При prefers-reduced-motion эффекты гасятся CSS-вариантами, разметка не меняется.
 */
export function HeroBackdrop({ image }: { image: PhotoSource }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 140]);
  const scale = useTransform(scrollY, [0, 900], [1.04, 1.1]);
  const shade = useTransform(scrollY, [0, 800], [0, 0.6]);

  return (
    <div className="absolute inset-0 -z-10">
      <motion.div className="absolute inset-0 motion-reduce:!transform-none" style={{ y, scale }}>
        <Photo image={image} sizes="100vw" preload className="absolute inset-0" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-deep/85 via-deep/40 to-deep/5" />
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-deep/90 via-deep/35 to-transparent" />
      <motion.div aria-hidden="true" className="absolute inset-0 bg-deep motion-reduce:!opacity-0" style={{ opacity: shade }} />
    </div>
  );
}
