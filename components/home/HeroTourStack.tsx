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
type ExitCustom = { nav: Nav; cardWidth: number };

const AUTOPLAY_MS = 4500;
const DURATION = 0.45;
const CASCADE = 0.065;
const SWIPE_OFFSET = 80;
const SWIPE_VELOCITY = 500;
const TAP_AFTER_DRAG_MS = 300;
const EASE = [0.45, 0, 0.2, 1] as const;

/**
 * Слоты колоды: -1 улетевшая, 0 активная, 1 и 2 видны позади, 3 скрытая следующая.
 * Скрытые слоты держат соседние карточки смонтированными, поэтому их фото уже загружены
 * к моменту появления. Порядок в массиве задаёт приоритет, если туров меньше пяти.
 */
const SLOT_PRIORITY = [0, 1, 2, 3, -1] as const;
const SLOT_Z: Record<number, number> = { [-1]: 40, 0: 30, 1: 20, 2: 10, 3: 0 };

function slotStyle(slot: number, nav: Nav, cardWidth: number) {
  switch (slot) {
    case -1:
      return { x: nav.fly * cardWidth * 1.3, y: 0, rotate: nav.fly * 18, scale: 1, opacity: 0 };
    case 0:
      return { x: 0, y: 0, rotate: -4, scale: 1, opacity: 1 };
    case 1:
      return { x: 18, y: 14, rotate: 3, scale: 0.96, opacity: 0.55 };
    case 2:
      return { x: 36, y: 28, rotate: 6, scale: 0.92, opacity: 0.3 };
    default:
      return { x: 54, y: 42, rotate: 9, scale: 0.88, opacity: 0 };
  }
}

/** Каскад: следующие карточки трогаются с небольшой задержкой после улетающей */
function slotDelay(slot: number, nav: Nav): number {
  if (nav.step === 1) return slot >= 0 && slot <= 2 ? (slot + 1) * CASCADE : 0;
  return slot >= 1 ? slot * CASCADE : 0;
}

/** Карточка, вышедшая из окна колоды, доигрывает анимацию до скрытого положения */
const exitVariants: Variants = {
  exit: ({ nav, cardWidth }: ExitCustom) => ({
    ...slotStyle(nav.step === 1 ? -1 : 3, nav, cardWidth),
    transition: { duration: DURATION, ease: EASE },
  }),
};

interface CardFaceProps {
  card: HeroStackCard;
  active: boolean;
  openTourLabel: string;
  /** Невидимая копия задаёт размеры колоды и не грузит фото */
  placeholder?: boolean;
  onArrowClick?: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
}

/** Оформление карточки-полароида из прежнего hero: рамка, фото 4:5, кикер, курсивный заголовок, цена и стрелка */
function CardFace({ card, active, openTourLabel, placeholder = false, onArrowClick }: CardFaceProps) {
  return (
    <div className={cn("bg-paper p-3 pb-4 text-ink", active ? "shadow-postcard-lift" : "shadow-postcard")}>
      {placeholder ? (
        <div className="aspect-[4/5] w-full" />
      ) : (
        <Photo image={card.image} sizes="(min-width: 1280px) 15rem, 13rem" loading="eager" className="aspect-[4/5] w-full" />
      )}
      <span className="kicker mt-3 block truncate text-[0.6875rem] text-secondary">{card.kicker}</span>
      <span className="display mt-1.5 line-clamp-2 min-h-[2.5em] text-lg leading-tight lg:text-base xl:[@media(min-height:760px)]:text-[1.375rem]">
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
    </div>
  );
}

/**
 * Колода карточек всех опубликованных туров в hero (паттерн card stack shuffle).
 * Автопрокрутка каждые 4.5 с, пауза при наведении мышью, фокусе и перетаскивании,
 * кнопки назад / вперёд, свайп верхней карточки и стрелки клавиатуры.
 * При prefers-reduced-motion автопрокрутка отключается, а MotionConfig (reducedMotion="user")
 * убирает сдвиги и повороты, оставляя смену прозрачности.
 *
 * Раскладка кнопок: до 1024px колонкой справа от колоды, 1024-1279px рядом под колодой,
 * от 1280px колонкой слева, чтобы не прижиматься к заголовку hero.
 */
export function HeroTourStack({ cards, labels }: HeroTourStackProps) {
  const router = useRouter();
  const regionRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const lastDragEndRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [nav, setNav] = useState<Nav>({ step: 1, fly: 1 });
  const [cardWidth, setCardWidth] = useState(240);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inView = useInView(regionRef, { amount: 0.3 });
  const reducedMotion = useReducedMotion();
  const count = cards.length;

  const navigate = useCallback(
    (step: 1 | -1, fly: 1 | -1) => {
      if (count < 2) return;
      setNav({ step, fly });
      setIndex((current) => (current + step + count) % count);
    },
    [count],
  );

  // Ширина карточки нужна, чтобы улетать ровно на 130% её ширины на любом брейкпоинте
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const observer = new ResizeObserver(([entry]) => setCardWidth(entry.contentRect.width));
    observer.observe(area);
    return () => observer.disconnect();
  }, []);

  const paused = hovered || focused || dragging || !inView || reducedMotion === true;

  // Таймер перезапускается при каждой смене карточки, поэтому ручное листание его сбрасывает
  useEffect(() => {
    if (paused || count < 2) return;
    const timer = window.setTimeout(() => navigate(1, 1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [paused, index, count, navigate]);

  if (count === 0) return null;

  const active = cards[index];
  const visible = SLOT_PRIORITY.map((slot) => ({ slot, cardIndex: (((index + slot) % count) + count) % count })).filter(
    (item, position, list) => list.findIndex((other) => other.cardIndex === item.cardIndex) === position,
  );

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      navigate(1, 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(-1, 1);
    }
  }

  // Время берётся из самих событий (event.timeStamp), а не из Date.now(): так обработчики остаются чистыми
  function handleDragEnd(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    lastDragEndRef.current = event.timeStamp;
    setDragging(false);
    if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) navigate(1, -1);
    else if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) navigate(-1, 1);
  }

  function handleTap(event: MouseEvent | TouchEvent | PointerEvent, href: string) {
    if (event.timeStamp - lastDragEndRef.current < TAP_AFTER_DRAG_MS) return;
    if ((event.target as Element | null)?.closest("a, button")) return;
    router.push(href);
  }

  function guardArrowClick(event: ReactMouseEvent<HTMLAnchorElement>) {
    // После свайпа мышью браузер присылает click: переход по стрелке в этот момент не нужен
    if (event.timeStamp - lastDragEndRef.current < TAP_AFTER_DRAG_MS) event.preventDefault();
  }

  const exitCustom: ExitCustom = { nav, cardWidth };

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
      className="relative flex items-end gap-16 outline-offset-8 lg:flex-col lg:gap-10 xl:flex-row-reverse xl:gap-6"
    >
      <div ref={areaRef} className="relative w-52 shrink-0 lg:w-44 xl:[@media(min-height:760px)]:w-60">
        <div aria-hidden="true" className="invisible">
          <CardFace card={active} active={false} openTourLabel={labels.openTour} placeholder />
        </div>

        <AnimatePresence initial={false} custom={exitCustom}>
          {visible.map(({ slot, cardIndex }) => {
            const card = cards[cardIndex];
            const isActive = slot === 0;
            return (
              <motion.div
                key={card.slug}
                custom={exitCustom}
                variants={exitVariants}
                initial={false}
                animate={slotStyle(slot, nav, cardWidth)}
                exit="exit"
                transition={{ duration: DURATION, ease: EASE, delay: slotDelay(slot, nav) }}
                style={{ zIndex: SLOT_Z[slot] }}
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragStart={isActive ? () => setDragging(true) : undefined}
                onDragEnd={isActive ? handleDragEnd : undefined}
                onTap={isActive ? (event) => handleTap(event, card.href) : undefined}
                aria-hidden={isActive ? undefined : true}
                className={cn(
                  "absolute inset-x-0 top-0",
                  isActive ? "cursor-grab touch-pan-y active:cursor-grabbing" : "pointer-events-none",
                )}
              >
                <CardFace card={card} active={isActive} openTourLabel={labels.openTour} onArrowClick={guardArrowClick} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {count > 1 ? (
        <div className="flex shrink-0 flex-col gap-2 lg:flex-row xl:flex-col">
          <button
            type="button"
            onClick={() => navigate(-1, 1)}
            aria-label={labels.previous}
            className="flex h-10 w-10 items-center justify-center border border-on-dark/30 text-on-dark/80 transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            <ArrowLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => navigate(1, 1)}
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
