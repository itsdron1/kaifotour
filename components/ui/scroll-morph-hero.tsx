"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Photo, type PhotoSource } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";

/*
 * Scroll morph hero (21st.dev, «scroll-morph-hero»), адаптирован под проект:
 * - motion/react вместо framer-motion: это тот же пакет под новым именем, он уже установлен;
 * - вместо перехвата колеса внутри блока используется обычная прокрутка страницы:
 *   сцена прилипает к экрану, пока секция прокручивается, поэтому страницу нельзя «заклинить»;
 * - позиции карточек считаются через MotionValue, без перерисовки React на каждом кадре;
 * - разброс на старте детерминированный и целочисленный: разметка сервера и браузера совпадает;
 * - дуга сдвигается от первой карточки к последней, так что за прокрутку видны все туры;
 * - кнопки стоят вне круга: в правом нижнем углу на широких экранах и под кругом на вертикальных.
 */

export type AnimationPhase = "scatter" | "line" | "circle";
/** Где стоят кнопки, пока карточки собраны в круг */
type ActionsPlacement = "corner" | "below" | "hidden";

export interface MorphCard {
  slug: string;
  href: string;
  title: string;
  kicker: string;
  priceLabel: string;
  image: PhotoSource;
}

interface CardTarget {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

/** Карточка-полароид в круге; в дуге она увеличивается */
const CARD_WIDTH = 72;
const CARD_HEIGHT = 96;
/** Виртуальная прокрутка исходного компонента: 0–600 круг превращается в дугу, 600–3000 дуга сдвигается */
const MAX_SCROLL = 3000;
const MORPH_END = 600;
const LINE_SPACING = 70;
const LINE_DELAY_MS = 500;
const CIRCLE_DELAY_MS = 2500;
const PHASE_INDEX: Record<AnimationPhase, number> = { scatter: 0, line: 1, circle: 2 };
const CARD_SPRING = { stiffness: 40, damping: 15 };
const SCROLL_SPRING = { stiffness: 40, damping: 20 };
const PARALLAX_SPRING = { stiffness: 30, damping: 20 };
const FLIP_TRANSITION = { type: "spring", stiffness: 260, damping: 20 } as const;

/**
 * Раскладка кнопок у круга. Геометрия в placeActions повторяет эти классы:
 * угол отстоит от края на 20/32/48px по горизонтали и 24/40px по вертикали, зазор между кнопками 4px;
 * под кругом блок начинается на 4rem ниже его края (половина карточки и ACTIONS_GAP), зазор 8px.
 */
const ACTIONS_GAP = 16;
const PLACEMENT_POSITION: Record<ActionsPlacement, string> = {
  corner: "bottom-6 right-5 sm:right-8 lg:bottom-10 lg:right-12",
  below: "left-1/2 top-[calc(50%_+_var(--ring)_+_4rem)] -translate-x-1/2",
  hidden: "bottom-6 right-5 sm:right-8 lg:bottom-10 lg:right-12",
};
const PLACEMENT_LAYOUT: Record<ActionsPlacement, string> = {
  corner: "flex-col-reverse items-end gap-1",
  below: "flex-col items-center gap-2",
  hidden: "invisible flex-col-reverse items-end gap-1",
};

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;
const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Радиус круга из исходного компонента: 35% меньшей стороны сцены, но не больше 350px */
const ringRadius = (width: number, height: number) => Math.min(Math.min(width, height) * 0.35, 350);

/** Детерминированный «случайный» разброс: одинаковый на сервере и в браузере */
function seeded(index: number, salt: number): number {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function cardTarget(
  index: number,
  total: number,
  phase: number,
  morph: number,
  shuffle: number,
  parallax: number,
  width: number,
  height: number,
): CardTarget {
  if (phase === PHASE_INDEX.scatter) {
    return {
      x: Math.round((seeded(index, 1) - 0.5) * 1500),
      y: Math.round((seeded(index, 2) - 0.5) * 1000),
      rotation: Math.round((seeded(index, 3) - 0.5) * 180),
      scale: 0.6,
      opacity: 0,
    };
  }

  if (phase === PHASE_INDEX.line) {
    // На узком экране линия сжимается, чтобы вся колода поместилась в ширину
    const spacing = width > 0 ? Math.min(LINE_SPACING, (width - CARD_WIDTH) / Math.max(total - 1, 1)) : LINE_SPACING;
    return { x: (index - (total - 1) / 2) * spacing, y: 0, rotation: 0, scale: 1, opacity: 1 };
  }

  const isMobile = width < 768;

  // A. Круг
  const circleRadius = ringRadius(width, height);
  const circleAngle = (index / total) * 360;
  const circle = {
    x: Math.cos(toRadians(circleAngle)) * circleRadius,
    y: Math.sin(toRadians(circleAngle)) * circleRadius,
    rotation: circleAngle + 90,
  };

  // B. Дуга-«радуга» внизу сцены: вершина ниже центра, края уходят вниз
  const arcRadius = Math.max(Math.min(width, height * 1.5) * (isMobile ? 1.4 : 1.1), 1);
  const arcScale = isMobile ? 1.4 : 1.8;
  const arcCenterY = height * (isMobile ? 0.35 : 0.25) + arcRadius;
  const spreadAngle = isMobile ? 100 : 130;
  const step = spreadAngle / Math.max(total - 1, 1);
  // Сдвиг дуги: от первой карточки у левого края экрана до последней у правого
  const visibleHalf = (Math.asin(clamp01((width / 2 - (CARD_WIDTH * arcScale) / 2) / arcRadius)) * 180) / Math.PI;
  const sweep = Math.max(spreadAngle / 2 - visibleHalf, 0);
  const arcAngle = -90 - spreadAngle / 2 + index * step + lerp(sweep, -sweep, clamp01(shuffle));
  const arc = {
    x: Math.cos(toRadians(arcAngle)) * arcRadius + parallax,
    y: Math.sin(toRadians(arcAngle)) * arcRadius + arcCenterY,
    rotation: arcAngle + 90,
  };

  // C. Превращение круга в дугу
  return {
    x: lerp(circle.x, arc.x, morph),
    y: lerp(circle.y, arc.y, morph),
    rotation: lerp(circle.rotation, arc.rotation, morph),
    scale: lerp(1, arcScale, morph),
    opacity: 1,
  };
}

/**
 * Место для кнопок, пока карточки стоят кругом: блок не должен заходить на карточки.
 * На широкой сцене кнопки в правом нижнем углу (первая внизу), на вертикальной под кругом.
 * Если места нет (невысокий телефон, телефон боком), кнопки ждут дугу, где они появятся над карточками.
 */
function placeActions(width: number, height: number, items: HTMLElement[]): ActionsPlacement {
  if (items.length === 0 || width === 0 || height === 0) return "hidden";
  const outer = ringRadius(width, height) + CARD_HEIGHT / 2 + ACTIONS_GAP;
  const sizes = items.map((item) => ({ width: item.offsetWidth, height: item.offsetHeight }));

  if (width >= height) {
    const right = width >= 1024 ? 48 : width >= 640 ? 32 : 20;
    let bottom = height - (width >= 1024 ? 40 : 24);
    for (const size of sizes) {
      const top = bottom - size.height;
      const left = width - right - size.width;
      const distance = Math.hypot(Math.max(left - width / 2, 0), Math.max(top - height / 2, 0));
      if (distance < outer) return "hidden";
      bottom = top - 4;
    }
    return "corner";
  }

  const blockHeight = sizes.reduce((sum, size) => sum + size.height, 0) + 8 * (sizes.length - 1);
  const blockWidth = Math.max(...sizes.map((size) => size.width));
  return height / 2 + outer + blockHeight + 24 <= height && blockWidth <= width - 40 ? "below" : "hidden";
}

interface FlipCardProps {
  card: MorphCard;
  index: number;
  total: number;
  /** phase, morph, shuffle, parallax, width, height */
  inputs: MotionValue<number>[];
  detailsLabel: string;
  reducedMotion: boolean;
}

function FlipCard({ card, index, total, inputs, detailsLabel, reducedMotion }: FlipCardProps) {
  const compute = ([phase, morph, shuffle, parallax, width, height]: number[]) =>
    cardTarget(index, total, phase, morph, shuffle, parallax, width, height);

  const targetX = useTransform<number, number>(inputs, (values) => compute(values).x);
  const targetY = useTransform<number, number>(inputs, (values) => compute(values).y);
  const targetRotate = useTransform<number, number>(inputs, (values) => compute(values).rotation);
  const targetScale = useTransform<number, number>(inputs, (values) => compute(values).scale);
  const targetOpacity = useTransform<number, number>(inputs, (values) => compute(values).opacity);

  // Пружина на каждой карточке даёт мягкое «плавание» между фазами, как в исходном компоненте
  const springX = useSpring(targetX, CARD_SPRING);
  const springY = useSpring(targetY, CARD_SPRING);
  const springRotate = useSpring(targetRotate, CARD_SPRING);
  const springScale = useSpring(targetScale, CARD_SPRING);
  const springOpacity = useSpring(targetOpacity, CARD_SPRING);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginLeft: -CARD_WIDTH / 2,
        marginTop: -CARD_HEIGHT / 2,
        x: reducedMotion ? targetX : springX,
        y: reducedMotion ? targetY : springY,
        rotate: reducedMotion ? targetRotate : springRotate,
        scale: reducedMotion ? targetScale : springScale,
        opacity: reducedMotion ? targetOpacity : springOpacity,
      }}
    >
      <Link
        href={card.href}
        tabIndex={-1}
        draggable={false}
        className="group block h-full w-full [perspective:1000px]"
      >
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          whileHover={{ rotateY: 180 }}
          transition={FLIP_TRANSITION}
        >
          {/* Лицевая сторона: полароид с фото тура */}
          <div className="absolute inset-0 bg-paper p-[3px] pb-[12px] shadow-postcard [backface-visibility:hidden]">
            <Photo image={card.image} sizes="136px" className="h-full w-full" />
            <span className="absolute inset-0 bg-deep/10 transition-colors duration-300 group-hover:bg-transparent" />
          </div>

          {/* Оборот: категория, название и цена */}
          <div className="absolute inset-0 flex flex-col justify-between border border-on-dark/15 bg-deep p-[6px] text-left [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="kicker truncate text-[5px] text-mist">{card.kicker}</span>
            <span className="display line-clamp-3 text-[10px] leading-tight text-on-dark">{card.title}</span>
            <span className="flex items-center justify-between gap-1 font-condensed text-[6px] font-semibold uppercase tracking-caps">
              <span className="truncate text-accent">{card.priceLabel}</span>
              <span className="shrink-0 text-on-dark">{detailsLabel}</span>
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

interface ScrollMorphHeroProps {
  /** Карточки колоды: по одной на опубликованный тур */
  cards: MorphCard[];
  /** Фон сцены */
  backdrop?: ReactNode;
  /** Центр круга: главный заголовок. Кегль и ширину задаёт компонент по радиусу круга */
  intro: ReactNode;
  /** Подсказка прокрутки под заголовком */
  scrollHint: string;
  /** Верх сцены, когда карточки собрались в дугу */
  content: ReactNode;
  /** Главная кнопка и вторичная ссылка: компонент ставит их у круга и под текстом дуги */
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  /** Подпись на обороте карточки */
  detailsLabel: string;
  labelledBy?: string;
  className?: string;
}

/**
 * Hero с колодой туров: карточки слетаются в линию, затем в круг вокруг заголовка,
 * а при прокрутке страницы круг превращается в дугу внизу экрана, и дуга проезжает через все туры.
 * Наведение переворачивает карточку, клик ведёт на страницу тура. Колода дублирует каталог ниже,
 * поэтому для скринридеров и клавиатуры она скрыта, а заголовок и кнопки доступны.
 * При prefers-reduced-motion вступление пропускается, пружины и параллакс отключаются.
 */
export function ScrollMorphHero({
  cards,
  backdrop,
  intro,
  scrollHint,
  content,
  primaryAction,
  secondaryAction,
  detailsLabel,
  labelledBy,
  className,
}: ScrollMorphHeroProps) {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() === true;
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [placement, setPlacement] = useState<ActionsPlacement>("corner");
  const [introAway, setIntroAway] = useState(false);
  const [arcReady, setArcReady] = useState(false);

  const phase = useMotionValue<number>(PHASE_INDEX.scatter);
  const width = useMotionValue(0);
  const height = useMotionValue(0);

  // --- Размер сцены, радиус круга и место для кнопок ---
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const update = () => {
      const stageWidth = stage.clientWidth;
      const stageHeight = stage.clientHeight;
      width.set(stageWidth);
      height.set(stageHeight);
      stage.style.setProperty("--ring", `${ringRadius(stageWidth, stageHeight)}px`);
      const items = actionsRef.current
        ? Array.from(actionsRef.current.children).filter((child): child is HTMLElement => child instanceof HTMLElement)
        : [];
      setPlacement(placeActions(stageWidth, stageHeight, items));
    };
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    if (actionsRef.current) observer.observe(actionsRef.current);
    return () => observer.disconnect();
  }, [width, height]);

  // --- Прокрутка страницы вместо виртуальной прокрутки колесом ---
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const virtualScroll = useTransform(scrollYProgress, [0, 1], [0, MAX_SCROLL]);
  const morphProgress = useTransform(virtualScroll, [0, MORPH_END], [0, 1]);
  const shuffleProgress = useTransform(virtualScroll, [MORPH_END, MAX_SCROLL], [0, 1]);
  const smoothMorph = useSpring(morphProgress, SCROLL_SPRING);
  const smoothShuffle = useSpring(shuffleProgress, SCROLL_SPRING);
  const morph = reducedMotion ? morphProgress : smoothMorph;
  const shuffle = reducedMotion ? shuffleProgress : smoothShuffle;

  // --- Параллакс за курсором ---
  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, PARALLAX_SPRING);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reducedMotion) return;
    const handleMouseMove = (event: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      mouseX.set((((event.clientX - rect.left) / rect.width) * 2 - 1) * 100);
    };
    stage.addEventListener("mousemove", handleMouseMove);
    return () => {
      stage.removeEventListener("mousemove", handleMouseMove);
      mouseX.set(0);
    };
  }, [mouseX, reducedMotion]);

  // --- Вступление: разброс, линия, круг ---
  useEffect(() => {
    const toLine = window.setTimeout(
      () => setIntroPhase((current) => (current === "scatter" ? "line" : current)),
      reducedMotion ? 0 : LINE_DELAY_MS,
    );
    const toCircle = window.setTimeout(() => setIntroPhase("circle"), reducedMotion ? 0 : CIRCLE_DELAY_MS);
    return () => {
      window.clearTimeout(toLine);
      window.clearTimeout(toCircle);
    };
  }, [reducedMotion]);

  useEffect(() => {
    phase.set(PHASE_INDEX[introPhase]);
  }, [phase, introPhase]);

  // Кнопки активны только в том блоке, который сейчас виден
  useMotionValueEvent(morph, "change", (value) => {
    setIntroAway(value >= 0.5);
    setArcReady(value > 0.8);
  });

  const introFade = useTransform(morph, [0, 0.5], [1, 0]);
  const contentOpacity = useTransform(morph, [0.8, 1], [0, 1]);
  const contentY = useTransform(morph, [0.8, 1], [20, 0]);
  const introShown = introPhase === "circle";
  const actionsActive = introShown && !introAway && placement !== "hidden";
  const inputs = [phase, morph, shuffle, smoothMouseX, width, height];

  return (
    <section
      ref={trackRef}
      aria-labelledby={labelledBy}
      className={cn("relative h-[300svh] bg-deep text-on-dark", className)}
    >
      <div ref={stageRef} className="sticky top-0 isolate h-[100svh] overflow-hidden [--ring:min(35vmin,350px)]">
        {/*
          Узлы из пропсов (фон, заголовок, текст, кнопки) стоят единственными детьми своих обёрток:
          элементы серверного компонента в общем списке детей дают ложное предупреждение React о key
        */}
        <div className="absolute inset-0 -z-10">{backdrop}</div>

        {/* Колода */}
        <div aria-hidden="true" className="absolute inset-0">
          {cards.map((card, index) => (
            <FlipCard
              key={card.slug}
              card={card}
              index={index}
              total={cards.length}
              inputs={inputs}
              detailsLabel={detailsLabel}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* Заголовок в центре круга: исчезает, когда круг превращается в дугу. Кегль и ширина следуют за радиусом */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={introShown ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="max-w-[calc(2*(var(--ring)_-_3.5rem))] text-center text-[length:clamp(1.5rem,calc(var(--ring)*0.17),3.5rem)] leading-[1.1]"
          >
            <motion.div style={{ opacity: introFade }} className="flex flex-col items-center">
              <div>{intro}</div>
              <p aria-hidden="true" className="kicker mt-6 text-mist">
                {scrollHint}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Кнопки у круга: снаружи, чтобы не перекрывать карточки */}
        {primaryAction ? (
          <motion.div
            style={{ opacity: introFade }}
            className={cn("pointer-events-none absolute z-10", PLACEMENT_POSITION[placement])}
          >
            <motion.div
              ref={actionsRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: introShown ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              inert={!actionsActive}
              className={cn("flex w-max", PLACEMENT_LAYOUT[placement], actionsActive && "pointer-events-auto")}
            >
              <div className="flex">{primaryAction}</div>
              {secondaryAction ? <div className="flex">{secondaryAction}</div> : null}
            </motion.div>
          </motion.div>
        ) : null}

        {/* Текст над дугой: появляется, когда карточки собрались внизу */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center px-5 pt-24 sm:px-8 lg:pt-28">
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="flex max-w-[40rem] flex-col items-center text-center"
          >
            <div>{content}</div>
            {primaryAction ? (
              <div
                inert={!arcReady}
                className={cn("mt-6 flex flex-col items-center gap-2 sm:flex-row sm:gap-4", arcReady && "pointer-events-auto")}
              >
                <div className="flex">{primaryAction}</div>
                {secondaryAction ? <div className="flex">{secondaryAction}</div> : null}
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
