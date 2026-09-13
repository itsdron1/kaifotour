"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type PanInfo,
  type Variants,
} from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent as ReactMouseEvent } from "react";
import { Photo, type PhotoSource } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";
import { fill } from "@/lib/format";

export interface HeroStackCard {
  slug: string;
  href: string;
  title: string;
  kicker: string;
  priceLabel: string;
  image: PhotoSource;
}

interface HeroTourStackProps {
  cards: HeroStackCard[];
  labels: {
    region: string;
    previous: string;
    next: string;
    /** "{title}, {n} из {total}" */
    status: string;
    /** "{title}: подробнее о туре" */
    openTour: string;
  };
}

/** step: куда листаем по кругу; fly: в какую сторону улетает верхняя карточка */
type Nav = { step: 1 | -1; fly: 1 | -1 };
type ExitCustom = { nav: Nav; duration: number };

/** Интервал автопрокрутки, пока страница не прокручена дальше точки, где колода целиком на экране */
const BASE_INTERVAL_MS = 4500;
/** Во сколько раз быстрее листается колода после прокрутки на SPEEDUP_DISTANCE */
const MAX_SPEEDUP = 5;
/** Ускорение набирается за 45% высоты окна: примерно столько колода остаётся открытой при прокрутке */
const SPEEDUP_DISTANCE = 0.45;
/** Дальше колода закрыта следующей секцией, листать незачем */
const IDLE_AFTER = 1.2;
const DURATION = 0.45;
const CASCADE = 0.065;
const SWIPE_OFFSET = 80;
const SWIPE_VELOCITY = 500;
const TAP_AFTER_DRAG_MS = 300;
const EASE = [0.45, 0, 0.2, 1] as const;

/**
 * Слоты веера: 0 активная справа, 1 и 2 раскрыты влево и видны целиком,
 * 3 скрытая следующая слева, -1 улетевшая. Скрытые слоты держат соседние карточки
 * смонтированными, поэтому их фото уже загружены. Порядок задаёт приоритет, если туров меньше пяти.
 */
const SLOT_PRIORITY = [0, 1, 2, 3, -1] as const;
const SLOT_Z: Record<number, number> = { [-1]: 40, 0: 30, 1: 20, 2: 10, 3: 0 };
/** Лёгкое затемнение дальних карточек вместо прозрачности: три тура читаются, глубина сохраняется */
const SLOT_DIM: Record<number, number> = { [-1]: 0, 0: 0, 1: 0.14, 2: 0.26, 3: 0.3 };

/**
 * Геометрия веера по брейкпоинтам: --fan-card ширина карточки, --fan-step сдвиг соседней карточки,
 * --fan-tilt масштаб наклонов. Позиции считаются в CSS через calc(), поэтому серверная разметка
 * сразу стоит на своих местах, а Motion интерполирует числа внутри calc.
 * На телефонах шаг сжимается под ширину экрана: веер вместе с наклоном дальней карточки
 * помещается между полями страницы (1.25rem с каждой стороны и 1.25rem на наклон).
 * С 1024px колода компактнее: она делит первый экран с заголовком.
 */
const FAN_GEOMETRY = [
  "[--fan-card:9.5rem] [--fan-step:min(96px,calc((100vw_-_13.25rem)_/_2))] [--fan-tilt:0.7]",
  "sm:[--fan-card:12rem] sm:[--fan-step:128px] sm:[--fan-tilt:0.85]",
  "lg:[--fan-card:9rem] lg:[--fan-step:92px] lg:[--fan-tilt:0.7]",
  "xl:[--fan-card:11rem] xl:[--fan-step:136px] xl:[--fan-tilt:0.8]",
  // Крупный веер, когда до заголовка хватает места: до 1440px заголовок ближе к колоде, поэтому нужна большая высота
  "xl:[@media(min-height:820px)]:[--fan-card:14rem] xl:[@media(min-height:820px)]:[--fan-step:160px] xl:[@media(min-height:820px)]:[--fan-tilt:1]",
  "min-[1440px]:[@media(min-height:760px)]:[--fan-card:14rem] min-[1440px]:[@media(min-height:760px)]:[--fan-step:160px] min-[1440px]:[@media(min-height:760px)]:[--fan-tilt:1]",
].join(" ");
const CARD_WIDTH = "w-[var(--fan-card)]";

const fanX = (steps: number, percent = 0) => `calc(var(--fan-step) * ${steps} + ${percent}%)`;
const fanRotate = (tilt: number, extra = 0) => `calc(var(--fan-tilt) * ${tilt}deg + ${extra}deg)`;

function slotStyle(slot: number, nav: Nav) {
  switch (slot) {
    case -1:
      return { x: fanX(0, 130 * nav.fly), y: -12, rotate: fanRotate(0, 18 * nav.fly), scale: 1, opacity: 0 };
    case 0:
      return { x: fanX(0), y: 0, rotate: fanRotate(3), scale: 1, opacity: 1 };
    case 1:
      return { x: fanX(-1), y: 10, rotate: fanRotate(-4), scale: 0.94, opacity: 1 };
    case 2:
      return { x: fanX(-2), y: 22, rotate: fanRotate(-9), scale: 0.88, opacity: 1 };
    default:
      return { x: fanX(-3), y: 34, rotate: fanRotate(-14), scale: 0.82, opacity: 0 };
  }
}

/** Каскад: следующие карточки трогаются с небольшой задержкой после улетающей */
function slotDelay(slot: number, nav: Nav, cascade: number): number {
  if (nav.step === 1) return slot >= 0 && slot <= 2 ? (slot + 1) * cascade : 0;
  return slot >= 1 ? slot * cascade : 0;
}

/** Карточка, вышедшая из окна колоды, доигрывает анимацию до скрытого положения */
const exitVariants: Variants = {
  exit: ({ nav, duration }: ExitCustom) => ({
    ...slotStyle(nav.step === 1 ? -1 : 3, nav),
    transition: { duration, ease: EASE },
  }),
};

interface CardFaceProps {
  card: HeroStackCard;
  active: boolean;
  dim?: number;
  openTourLabel: string;
  /** Невидимая копия задаёт размеры колоды и не грузит фото */
  placeholder?: boolean;
  onArrowClick?: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
}

/** Оформление карточки-полароида: рамка, фото 4:5, кикер, курсивный заголовок, цена и стрелка */
function CardFace({ card, active, dim = 0, openTourLabel, placeholder = false, onArrowClick }: CardFaceProps) {
  return (
    <div className={cn("relative bg-paper p-3 pb-4 text-ink", active ? "shadow-postcard-lift" : "shadow-postcard")}>
      {placeholder ? (
        <div className="aspect-[4/5] w-full" />
      ) : (
        <Photo
          image={card.image}
          sizes="(min-width: 1280px) 14rem, (min-width: 1024px) 9rem, (min-width: 640px) 12rem, 9.5rem"
          loading="eager"
          className="aspect-[4/5] w-full"
        />
      )}
      <span className="kicker mt-3 block truncate text-[0.6875rem] text-secondary">{card.kicker}</span>
      <span className="display mt-1.5 line-clamp-2 min-h-[2.5em] text-base leading-tight sm:text-lg lg:text-base xl:[@media(min-height:820px)]:text-xl min-[1440px]:[@media(min-height:760px)]:text-xl">
        {card.title}
      </span>
      <span className="mt-2 flex items-center justify-between gap-3 font-condensed text-[0.8125rem] font-semibold uppercase tracking-caps text-accent-ink">
        <span className="truncate">{card.priceLabel}</span>
        {placeholder ? (
          <span className="h-9 w-9 shrink-0" />
        ) : (
          <Link
            href={card.href}
            draggable={false}
            tabIndex={active ? undefined : -1}
            aria-label={fill(openTourLabel, { title: card.title })}
            onClick={onArrowClick}
            className="group -mr-2 flex h-9 w-9 shrink-0 items-center justify-center text-ink transition-colors duration-300 hover:text-secondary"
          >
            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </span>
      {placeholder ? null : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-deep transition-opacity duration-500"
          style={{ opacity: dim }}
        />
      )}
    </div>
  );
}

/**
 * Раскрытая колода всех опубликованных туров в hero (паттерн card stack shuffle).
 * Видны три тура веером. Автопрокрутка ускоряется, пока страницу прокручивают вниз от точки,
 * где колода целиком на экране, и замедляется обратно при прокрутке вверх;
 * пауза при наведении мышью, фокусе и перетаскивании.
 * Ручное управление: кнопки, свайп верхней карточки, клик по дальней карточке, стрелки клавиатуры.
 * При prefers-reduced-motion автопрокрутка отключается, а MotionConfig (reducedMotion="user")
 * убирает сдвиги и повороты, оставляя смену прозрачности.
 */
export function HeroTourStack({ cards, labels }: HeroTourStackProps) {
  const router = useRouter();
  const regionRef = useRef<HTMLDivElement>(null);
  const lastDragEndRef = useRef(Number.NEGATIVE_INFINITY);
  const elapsedRef = useRef(0);
  /** Прокрутка, с которой колода целиком на экране: от неё считается ускорение */
  const originRef = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const [nav, setNav] = useState<Nav>({ step: 1, fly: 1 });
  const [tempo, setTempo] = useState(1);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inView = useInView(regionRef, { amount: 0.3 });
  const reducedMotion = useReducedMotion();
  const count = cards.length;

  const advance = useCallback(
    (step: number, fly: 1 | -1, speed: number) => {
      if (count < 2 || step === 0) return;
      setNav({ step: step > 0 ? 1 : -1, fly });
      setTempo(speed);
      setIndex((current) => (((current + step) % count) + count) % count);
    },
    [count],
  );

  /** Ручное листание: обычная скорость анимации и новый отсчёт до автопрокрутки */
  const goTo = useCallback(
    (step: number, fly: 1 | -1) => {
      elapsedRef.current = 0;
      advance(step, fly, 1);
    },
    [advance],
  );

  const paused = hovered || focused || dragging || !inView || reducedMotion === true;

  // После смены размеров окна точка отсчёта ускорения ищется заново
  useEffect(() => {
    const resetOrigin = () => {
      originRef.current = null;
    };
    window.addEventListener("resize", resetOrigin);
    return () => window.removeEventListener("resize", resetOrigin);
  }, []);

  // Автопрокрутка на requestAnimationFrame: время копится тем быстрее, чем дальше страница прокручена вниз
  useEffect(() => {
    if (paused || count < 2) return;
    let frameId = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const delta = Math.min(now - previous, 100);
      previous = now;
      const viewport = Math.max(window.innerHeight, 1);
      const region = regionRef.current;
      if (region) {
        // На телефоне колода ниже первого экрана, и отсчёт начинается, когда её нижний край показался.
        // На десктопе hero прилипает к верху, нижний край неподвижен, и минимум держит отсчёт от начала страницы
        const origin = Math.max(0, window.scrollY + region.getBoundingClientRect().bottom - viewport);
        originRef.current = originRef.current === null ? origin : Math.min(originRef.current, origin);
      }
      const scrolled = (window.scrollY - (originRef.current ?? 0)) / viewport;
      if (scrolled <= IDLE_AFTER) {
        const progress = Math.min(Math.max(scrolled / SPEEDUP_DISTANCE, 0), 1);
        const speed = 1 + (MAX_SPEEDUP - 1) * progress;
        elapsedRef.current += delta * speed;
        if (elapsedRef.current >= BASE_INTERVAL_MS) {
          elapsedRef.current = 0;
          advance(1, 1, speed);
        }
      }
      frameId = window.requestAnimationFrame(tick);
    };
    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [paused, count, advance]);

  if (count === 0) return null;

  const active = cards[index];
  const visible = SLOT_PRIORITY.map((slot) => ({ slot, cardIndex: (((index + slot) % count) + count) % count })).filter(
    (item, position, list) => list.findIndex((other) => other.cardIndex === item.cardIndex) === position,
  );
  const duration = DURATION / Math.sqrt(tempo);
  const cascade = CASCADE / Math.sqrt(tempo);
  const exitCustom: ExitCustom = { nav, duration };

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(1, 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(-1, 1);
    }
  }

  // Время берётся из самих событий (event.timeStamp), а не из Date.now(): так обработчики остаются чистыми
  function handleDragEnd(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    lastDragEndRef.current = event.timeStamp;
    setDragging(false);
    if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) goTo(1, -1);
    else if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) goTo(-1, 1);
  }

  function handleTap(event: MouseEvent | TouchEvent | PointerEvent, href: string) {
    if (event.timeStamp - lastDragEndRef.current < TAP_AFTER_DRAG_MS) return;
    if ((event.target as Element | null)?.closest("a, button")) return;
    router.push(href);
  }

  /** Клик по раскрытой дальней карточке выводит её вперёд */
  function handleBackTap(event: MouseEvent | TouchEvent | PointerEvent, slot: number) {
    if ((event.target as Element | null)?.closest("a")) return;
    goTo(slot, 1);
  }

  function guardArrowClick(event: ReactMouseEvent<HTMLAnchorElement>) {
    // После свайпа мышью браузер присылает click: переход по стрелке в этот момент не нужен
    if (event.timeStamp - lastDragEndRef.current < TAP_AFTER_DRAG_MS) event.preventDefault();
  }

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.region}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      className="relative ml-auto flex w-fit flex-col items-end gap-4 outline-offset-8 lg:ml-0 xl:flex-row-reverse xl:items-center xl:gap-12"
    >
      <div className={cn("relative w-[calc(var(--fan-card)_+_var(--fan-step)_*_2)] pb-8", FAN_GEOMETRY)}>
        <div aria-hidden="true" className={cn("invisible ml-auto", CARD_WIDTH)}>
          <CardFace card={active} active={false} openTourLabel={labels.openTour} placeholder />
        </div>

        <AnimatePresence initial={false} custom={exitCustom}>
          {visible.map(({ slot, cardIndex }) => {
            const card = cards[cardIndex];
            const isActive = slot === 0;
            const isBack = slot === 1 || slot === 2;
            return (
              <motion.div
                key={card.slug}
                custom={exitCustom}
                variants={exitVariants}
                initial={slotStyle(nav.step === 1 ? 3 : -1, nav)}
                animate={slotStyle(slot, nav)}
                exit="exit"
                transition={{ duration, ease: EASE, delay: slotDelay(slot, nav, cascade) }}
                style={{ zIndex: SLOT_Z[slot] }}
                aria-hidden={isActive ? undefined : true}
                className={cn("absolute right-0 top-0 origin-bottom", CARD_WIDTH, !isActive && !isBack && "pointer-events-none")}
              >
                <motion.div
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragStart={isActive ? () => setDragging(true) : undefined}
                  onDragEnd={isActive ? handleDragEnd : undefined}
                  onTap={
                    isActive
                      ? (event) => handleTap(event, card.href)
                      : isBack
                        ? (event) => handleBackTap(event, slot)
                        : undefined
                  }
                  className={cn(
                    isActive && "cursor-grab touch-pan-y active:cursor-grabbing",
                    isBack && "cursor-pointer transition-transform duration-300 hover:!-translate-y-1.5",
                  )}
                >
                  <CardFace
                    card={card}
                    active={isActive}
                    dim={SLOT_DIM[slot]}
                    openTourLabel={labels.openTour}
                    onArrowClick={guardArrowClick}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {count > 1 ? (
        <div className="flex shrink-0 gap-2 xl:flex-col">
          <button
            type="button"
            onClick={() => goTo(-1, 1)}
            aria-label={labels.previous}
            className="flex h-10 w-10 items-center justify-center border border-on-dark/30 text-on-dark/80 transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            <ArrowLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(1, 1)}
            aria-label={labels.next}
            className="flex h-10 w-10 items-center justify-center border border-on-dark/30 text-on-dark/80 transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {/* Смена тура озвучивается, когда пользователь управляет колодой; во время автопрокрутки молчим */}
      <p className="sr-only" aria-live={hovered || focused ? "polite" : "off"} aria-atomic="true">
        {fill(labels.status, { title: active.title, n: index + 1, total: count })}
      </p>
    </div>
  );
}
