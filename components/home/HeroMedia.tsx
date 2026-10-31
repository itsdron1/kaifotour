import { getImageProps } from "next/image";
import { HeroVideo } from "@/components/home/HeroVideo";

/**
 * Файлы первого экрана. /media/* кэшируется браузером на год (next.config.ts),
 * поэтому новое видео или постер кладём под новым именем (hero-v2.mp4) и меняем его здесь.
 */
const VIDEO = { desktop: "/media/hero-v2.mp4", mobile: "/media/hero-mobile-v2.mp4" };
const POSTER = {
  desktop: { src: "/media/hero-poster.jpg", width: 1920, height: 1080 },
  mobile: { src: "/media/hero-mobile-poster.jpg", width: 1080, height: 1920 },
};
const PHONE_QUERY = "(max-width: 767px)";

/**
 * Фон первого экрана: постер, поверх него видео и затемнение, при котором текст читается на любой сцене.
 * Постер виден сразу. Это <picture>: браузер берёт один файл, а не оба, как было бы с двумя картинками, спрятанными
 * через CSS. LCP для Chrome — заголовок: картинки на весь экран кандидатами не считаются. Поэтому fetchPriority="high"
 * постеру не ставим: он отнимает сеть у текста и скриптов, Lighthouse показал +0,2 с к LCP.
 * Отдельного preload тоже нет: <picture> стоит в начале страницы, браузер находит его сам. preload() из react-dom
 * срабатывал ещё и при предзагрузке главной с других страниц, и постер качался там, где его нет.
 * Единой цветокоррекции сайта (.photo-grade) здесь нет: иначе цвет прыгал бы при смене постера на видео.
 */
export function HeroMedia() {
  const common = { alt: "", sizes: "100vw", loading: "eager", quality: 60 } as const;
  const { props: desktop } = getImageProps({ ...common, ...POSTER.desktop });
  const { props: mobile } = getImageProps({ ...common, ...POSTER.mobile });

  return (
    <div className="absolute inset-0 -z-10">
      <picture>
        <source media={PHONE_QUERY} srcSet={mobile.srcSet} sizes={common.sizes} />
        <img {...desktop} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </picture>
      <HeroVideo src={VIDEO.desktop} mobileSrc={VIDEO.mobile} phoneQuery={PHONE_QUERY} />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-deep/75 via-deep/45 to-deep/75" />
      {/* Уход в цвет фона внизу: держит нижний текст на светлых сценах, а стык со сценой колоды не даёт резкой линии */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-deep/45 to-deep" />
    </div>
  );
}
