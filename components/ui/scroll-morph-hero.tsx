"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Photo } from "@/components/ui/Photo";
import { TourCardBack, type TourCardBackLabels } from "@/components/ui/TourCardBack";
import { cn } from "@/lib/cn";
import type { TourCardData } from "@/lib/tour-view";

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

interface CardTarget {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

/**
 * Карточка в DOM крупная, чтобы на обороте помещался текст 13px, а на сцене её уменьшает BASE_SCALE:
 * видимый размер в круге прежний, 150×200 × 0.48 = 72×96.
 */
const CARD_WIDTH = 150;
const CARD_HEIGHT = 200;
const BASE_SCALE = 0.48;
const VISIBLE_WIDTH = CARD_WIDTH * BASE_SCALE;
const VISIBLE_HEIGHT = CARD_HEIGHT * BASE_SCALE;
/**
 * Наведение: карточка выпрямляется и увеличивается на месте.
 * Двигать её нельзя: карточка уедет из-под курсора, ховер сорвётся и всё замигает.
 * У краёв сцены увеличение уменьшается ровно настолько, чтобы карточка осталась в кадре.
 */
const HOVER_ZOOM = 1.3;
const HOVER_ZOOM_MOBILE = 1.15;
const HOVER_DURATION = 0.6;
const HOVER_EASE = [0.2, 0.7, 0.2, 1] as const;
/** Пауза перед возвратом, чтобы карточка не мигала на краю курсора */
const LEAVE_DELAY_MS = 150;
/** Насколько близко к краю сцены разрешено подойти увеличенной карточке */
const HOVER_MARGIN = 12;
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
const FLIP_TRANSITION = { duration: HOVER_DURATION, ease: HOVER_EASE } as const;

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
      scale: 0.6 * BASE_SCALE,
      opacity: 0,
    };
  }

  if (phase === PHASE_INDEX.line) {
    // На узком экране линия сжимается, чтобы вся колода поместилась в ширину
    const spacing = width > 0 ? Math.min(LINE_SPACING, (width - VISIBLE_WIDTH) / Math.max(total - 1, 1)) : LINE_SPACING;
    return { x: (index - (total - 1) / 2) * spacing, y: 0, rotation: 0, scale: BASE_SCALE, opacity: 1 };
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
  const visibleHalf = (Math.asin(clamp01((width / 2 - (VISIBLE_WIDTH * arcScale) / 2) / arcRadius)) * 180) / Math.PI;
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
    scale: lerp(1, arcScale, morph) * BASE_SCALE,
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
  const outer = ringRadius(width, height) + VISIBLE_HEIGHT / 2 + ACTIONS_GAP;
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
  card: TourCardData;
  index: number;
  total: number;
  /** phase, morph, shuffle, parallax, width, height */
  inputs: MotionValue<number>[];
  labels: TourCardBackLabels;
  reducedMotion: boolean;
  mobile: boolean;
  active: boolean;
  onActivate: () => void;
  onRelease: () => void;
  onClose: () => void;
}

function FlipCard({
  card,
  index,
  total,
  inputs,
  labels,
  reducedMotion,
  mobile,
  active,
  onActivate,
  onRelease,
  onClose,
}: FlipCardProps) {
  const router = useRouter();
  const compute = ([phase, morph, shuffle, parallax, width, height]: number[]) =>
    cardTarget(index, total, phase, morph, shuffle, parallax, width, height);
  const stageWidth = inputs[4];
  const stageHeight = inputs[5];

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

  // Наведение живёт отдельным значением: от него зависят приближение, выпрямление и подтягивание к центру
  const hover = useMotionValue(0);
  useEffect(() => {
    if (reducedMotion) {
      hover.set(0);
      return;
    }
    const controls = animate(hover, active ? 1 : 0, { duration: HOVER_DURATION, ease: HOVER_EASE });
    return () => controls.stop();
  }, [active, hover, reducedMotion]);

  const baseX = reducedMotion ? targetX : springX;
  const baseY = reducedMotion ? targetY : springY;
  const baseRotate = reducedMotion ? targetRotate : springRotate;
  const baseScale = reducedMotion ? targetScale : springScale;
  const zoom = mobile ? HOVER_ZOOM_MOBILE : HOVER_ZOOM;

  const rotate = useTransform<number, number>([baseRotate, hover], ([value, lift]) => value * (1 - lift));
  // Увеличение подрезается по месту вокруг карточки: у края сцены она растёт меньше, но не сдвигается
  const scale = useTransform<number, number>(
    [baseX, baseY, baseScale, hover, stageWidth, stageHeight],
    ([offsetX, offsetY, base, lift, width, height]) => {
      if (lift === 0 || width === 0 || height === 0) return base;
      const roomX = (width / 2 - HOVER_MARGIN - Math.abs(offsetX)) / ((CARD_WIDTH * base) / 2);
      const roomY = (height / 2 - HOVER_MARGIN - Math.abs(offsetY)) / ((CARD_HEIGHT * base) / 2);
      const allowed = Math.max(1, Math.min(zoom, roomX, roomY));
      return base * (1 + (allowed - 1) * lift);
    },
  );

  function handlePointerEnter(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") onActivate();
  }

  function handlePointerLeave(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") onRelease();
  }

  // Первый тап на тач-устройстве переворачивает карточку, кнопки на обороте работают как обычно
  function handleClick(event: ReactMouseEvent<HTMLDivElement>) {
    if ((event.target as Element | null)?.closest("a, button")) return;
    if (!active) onActivate();
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" && event.target === event.currentTarget) {
      event.preventDefault();
      router.push(card.href);
    } else if (event.key === "Escape") {
      onClose();
    }
  }

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginLeft: -CARD_WIDTH / 2,
        marginTop: -CARD_HEIGHT / 2,
        zIndex: active ? 20 : undefined,
        x: baseX,
        y: baseY,
        rotate,
        scale,
        opacity: reducedMotion ? targetOpacity : springOpacity,
      }}
    >
      {/* Обёртка ловит наведение и фокус и сама не вращается: иначе на повороте в 90° карточка встаёт ребром и ховер мигает */}
      <div
        data-tour-card="true"
        role="group"
        tabIndex={0}
        aria-label={`${card.title}, ${card.priceLabel}`}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocus={onActivate}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onClose();
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "h-full w-full cursor-pointer outline-offset-4 [perspective:1200px]",
          active
            ? "drop-shadow-[0_26px_40px_rgb(var(--color-shade)/0.6)]"
            : "drop-shadow-[0_10px_18px_rgb(var(--color-shade)/0.45)]",
        )}
      >
        {/* Невидимый запас по краям: ловит наведение чуть раньше самой карточки */}
        <span aria-hidden="true" className="absolute -inset-[10px]" />
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          animate={{ rotateY: active ? 180 : 0 }}
          transition={FLIP_TRANSITION}
        >
          {/* Лицевая сторона: полароид с фото тура */}
          <div
            className={cn(
              "absolute inset-0 bg-paper p-1.5 pb-6 [backface-visibility:hidden]",
              "motion-reduce:transition-opacity motion-reduce:duration-300",
              active && "motion-reduce:opacity-0",
            )}
          >
            <Photo image={card.image} sizes="150px" className="h-full w-full" />
            <span
              className={cn("absolute inset-0 bg-deep/10 transition-colors duration-300", active && "bg-transparent")}
            />
          </div>

          {/* Оборот: общий компонент с секцией туров */}
          <TourCardBack
            card={card}
            labels={labels}
            onClose={onClose}
            className={cn(
              "absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]",
              "motion-reduce:opacity-0 motion-reduce:transition-opacity motion-reduce:duration-300 motion-reduce:[transform:none]",
              active && "motion-reduce:opacity-100",
            )}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

interface ScrollMorphHeroProps {
  /** Карточки колоды: по одной на опубликованный тур */
  cards: TourCardData[];
  /** Фон сцены */
  backdrop?: ReactNode;
  /** Центр круга: главный заголовок. Кегль и ширину задаёт компонент по радиусу круга */
  intro: ReactNode;
  /** Подсказка прокрутки рядом с кнопками */
  scrollHint: string;
  /** Верх сцены, когда карточки собрались в дугу */
  content: ReactNode;
  /** Главная кнопка и вторичная ссылка: компонент ставит их у круга и под текстом дуги */
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  /** Подписи на обороте карточки */
  cardLabels: TourCardBackLabels;
  labelledBy?: string;
  className?: string;
}

/**
 * Hero с колодой туров: карточки слетаются в линию, затем в круг вокруг заголовка,
 * а при прокрутке страницы круг превращается в дугу внизу экрана, и дуга проезжает через все туры.
 * Наведение, фокус или тап приближает карточку, выпрямляет её и переворачивает оборотом открытки
 * с ценой, включениями и кнопками. Карточки доступны с клавиатуры, Escape возвращает карточку.
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
  cardLabels,
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
  const [mobile, setMobile] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const leaveTimer = useRef<number | null>(null);

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
      setMobile(stageWidth < 768);
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

  const activateCard = useCallback((slug: string) => {
    if (leaveTimer.current !== null) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setActiveCard(slug);
  }, []);

  /** Возврат с задержкой: курсор успевает перейти на соседнюю карточку без дёрганья */
  const releaseCard = useCallback(() => {
    if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => setActiveCard(null), LEAVE_DELAY_MS);
  }, []);

  const closeCard = useCallback(() => {
    if (leaveTimer.current !== null) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setActiveCard(null);
  }, []);

  useEffect(
    () => () => {
      if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current);
    },
    [],
  );

  // Тап мимо карточки и Escape возвращают перевёрнутую карточку на место
  useEffect(() => {
    if (!activeCard) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest?.("[data-tour-card]")) closeCard();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCard();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeCard, closeCard]);

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
        <div className="absolute inset-0">
          {cards.map((card, index) => (
            <FlipCard
              key={card.slug}
              card={card}
              index={index}
              total={cards.length}
              inputs={inputs}
              labels={cardLabels}
              reducedMotion={reducedMotion}
              mobile={mobile}
              active={card.slug === activeCard}
              onActivate={() => activateCard(card.slug)}
              onRelease={releaseCard}
              onClose={closeCard}
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
              <p aria-hidden="true" className="kicker text-mist">
                {scrollHint}
              </p>
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
