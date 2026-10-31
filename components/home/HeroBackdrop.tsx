"use client";

import { useMotionValue, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef } from "react";
import { Photo, type PhotoSource } from "@/components/ui/Photo";
import { useDeferredMedia } from "@/lib/use-deferred-media";

/**
 * Фон сцены с колодой: сцена прилипает к экрану, поэтому фото лишь слегка смещается (сдвиг меньше запаса масштаба,
 * край кадра не открывается) и темнеет, пока колода туров собирается в дугу (docs/editorial-style.md, раздел 3).
 * Прокрутка считается от начала своей секции: сцена стоит вторым экраном, после первого с призывом.
 * Сверху фото уходит в тёмный цвет, чтобы стык с первым экраном не был резким.
 * При prefers-reduced-motion эффекты гасятся CSS-вариантами, разметка не меняется.
 */
export function HeroBackdrop({ image }: { image: PhotoSource }) {
  const ref = useRef<HTMLDivElement>(null);
  const showPhoto = useDeferredMedia();
  const start = useMotionValue(0);
  const { scrollY } = useScroll();
  const local = useTransform<number, number>([scrollY, start], ([y, top]) => Math.max(y - top, 0));
  const y = useTransform(local, [0, 1800], [0, 30]);
  const scale = useTransform(local, [0, 1800], [1.04, 1.08]);
  const shade = useTransform(local, [0, 1200], [0, 0.5]);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    const update = () => start.set(section.getBoundingClientRect().top + window.scrollY);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [start]);

  return (
    <div ref={ref} className="absolute inset-0 -z-10">
      <m.div className="absolute inset-0 motion-reduce:!transform-none" style={{ y, scale }}>
        {showPhoto ? <Photo image={image} sizes="100vw" className="absolute inset-0" /> : null}
      </m.div>
      <div className="absolute inset-0 bg-gradient-to-r from-deep/85 via-deep/40 to-deep/5" />
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-deep/90 via-deep/35 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-deep to-transparent" />
      <m.div aria-hidden="true" className="absolute inset-0 bg-deep motion-reduce:!opacity-0" style={{ opacity: shade }} />
    </div>
  );
}
