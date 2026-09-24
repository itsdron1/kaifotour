"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Photo } from "@/components/ui/Photo";
import { TourCardBack } from "@/components/ui/TourCardBack";
import { cn } from "@/lib/cn";
import { DURATION_HOVER, EASE_SOFT, STAGGER_STEP } from "@/lib/motion";
import type { TourCardData } from "@/lib/tour-view";

export interface ToursCircleLabels {
  categories: string;
  toursList: string;
  exploreAll: string;
  book: string;
  details: string;
  newTab: string;
  close: string;
}

interface ToursCircleProps {
  cards: TourCardData[];
  tabs: { id: string; label: string }[];
  catalogHref: string;
  /** id заголовка секции: он стоит в центре круга */
  titleId: string;
  title: string;
  countLabel: string;
  labels: ToursCircleLabels;
}

/** Ширина карточки-открытки: подбирается по шагу окружности, но остаётся читаемой */
const CARD_MIN = 120;
const CARD_MAX = 152;
const CARD_RATIO = 1.5;
/** Ниже этой ширины круг не собрать: вместо него карусель со scroll-snap */
const RING_MIN_WIDTH = 690;
/** Активная карточка приближается и подтягивается к центру, чтобы не уехать за край */
const ZOOM = 1.6;
const PULL = 0.3;
const EASE = EASE_SOFT;
const DURATION = DURATION_HOVER;
/** Тень на гранях вместо filter: он пересчитывается каждый кадр на каждой карточке */
const CARD_FACE = "transition-shadow duration-500";
const CARD_SHADOW = "shadow-polaroid";
const CARD_SHADOW_LIFTED = "shadow-polaroid-lift";
const FLIP_DELAY = 0.08;
/** Пауза перед возвратом: курсор успевает перейти на соседнюю карточку без дёрганья */
const LEAVE_DELAY_MS = 150;
const ENTRANCE_STEP = STAGGER_STEP;

type CardVariant = "ring" | "carousel";

/** Наклон карточки ±4°, одинаковый на сервере и в браузере */
function tiltOf(index: number): number {
  const value = Math.sin((index + 1) * 12.9898) * 43758.5453;
  return Math.round((value - Math.floor(value) - 0.5) * 80) / 10;
}

function ringGeometry(width: number, count: number) {
  if (width <= 0 || count === 0) return { radius: 0, card: CARD_MAX };
  const roomy = Math.max((width - CARD_MAX) / 2, 0);
  const step = (2 * Math.PI * roomy) / count;
  const card = Math.min(CARD_MAX, Math.max(CARD_MIN, Math.round(step)));
  return { radius: Math.max((width - card) / 2, 0), card };
}

interface CircleCardProps {
  card: TourCardData;
  index: number;
  count: number;
  radius: number;
  size: number;
  variant: CardVariant;
  active: boolean;
  recent: boolean;
  revealed: boolean;
  settled: boolean;
  zoom: number;
  labels: ToursCircleLabels;
  onActivate: () => void;
  onRelease: () => void;
  onClose: () => void;
}

function CircleCard({
  card,
  index,
  count,
  radius,
  size,
  variant,
  active,
  recent,
  revealed,
  settled,
  zoom,
  labels,
  onActivate,
  onRelease,
  onClose,
}: CircleCardProps) {
  const router = useRouter();
  const ring = variant === "ring";
  const angle = ((index * 360) / count - 90) * (Math.PI / 180);
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const tilt = tiltOf(index);
  const height = Math.round(size * CARD_RATIO);

  const target = revealed
    ? {
        x: active ? x * (1 - PULL) : x,
        y: active ? y * (1 - PULL) : y,
        rotate: active ? 0 : tilt,
        scale: active ? zoom : 1,
        opacity: 1,
      }
    : { x: 0, y: 0, rotate: 0, scale: 0.6, opacity: 0 };

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
      className={cn(ring ? "absolute left-1/2 top-1/2" : "w-full")}
      style={
        ring
          ? {
              width: size,
              height,
              marginLeft: -size / 2,
              marginTop: -height / 2,
              zIndex: active ? 30 : recent ? 20 : 10,
              willChange: active ? "transform" : undefined,
            }
          : { aspectRatio: `1 / ${CARD_RATIO}` }
      }
      initial={ring ? { x: 0, y: 0, rotate: 0, scale: 0.6, opacity: 0 } : false}
      animate={ring ? target : undefined}
      transition={{ duration: DURATION, ease: EASE, delay: settled ? 0 : index * ENTRANCE_STEP }}
    >
      <div
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
        className="h-full w-full cursor-pointer outline-offset-4 [perspective:1200px]"
      >
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          animate={{ rotateY: active ? 180 : 0 }}
          transition={{ duration: DURATION, ease: EASE, delay: active ? FLIP_DELAY : 0 }}
        >
          {/* Лицевая сторона: полароид с фото тура */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col bg-paper p-2 pb-2.5 text-ink [backface-visibility:hidden]",
              CARD_FACE,
              active ? CARD_SHADOW_LIFTED : CARD_SHADOW,
              "motion-reduce:transition-opacity motion-reduce:duration-300",
              active && "motion-reduce:opacity-0",
            )}
          >
            <Photo image={card.image} sizes="180px" className="min-h-0 w-full flex-1" />
            <p className="kicker mt-2 truncate text-[0.5625rem] text-secondary">
              {card.number} / {card.categoryLabel}
            </p>
            <p className="display mt-0.5 line-clamp-2 text-[0.8125rem] leading-tight">{card.title}</p>
          </div>

          {/* Оборот открытки: общий компонент с секцией туров и колодой hero */}
          <TourCardBack
            card={card}
            labels={labels}
            includes={size >= 140 ? 3 : 2}
            onClose={onClose}
            className={cn(
              "absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]",
              CARD_FACE,
              active ? CARD_SHADOW_LIFTED : CARD_SHADOW,
              "motion-reduce:opacity-0 motion-reduce:transition-opacity motion-reduce:duration-300 motion-reduce:[transform:none]",
              active && "motion-reduce:opacity-100",
            )}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Каталог на главной: открытки стоят по кругу вокруг заголовка секции.
 * Наведение, фокус или тап приближает карточку, выравнивает наклон и переворачивает её
 * оборотом открытки с ценой, включениями и кнопками. Ниже 690px круг заменяет карусель со scroll-snap.
 * При prefers-reduced-motion переворот превращается в кроссфейд, а вылет из центра не проигрывается.
 */
export function ToursCircle({ cards, tabs, catalogHref, titleId, title, countLabel, labels }: ToursCircleProps) {
  const [tab, setTab] = useState("all");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [recentSlug, setRecentSlug] = useState<string | null>(null);
  const [layout, setLayout] = useState<{ width: number; mode: CardVariant }>({ width: 0, mode: "ring" });
  const [settled, setSettled] = useState(false);
  const [revealed, setRevealed] = useState(false);
  /** Элемент сцены держим в состоянии: эффект ждёт его появления, а не угадывает момент монтирования */
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  const leaveTimer = useRef<number | null>(null);
  const reducedMotion = useReducedMotion() === true;

  const filtered = useMemo(() => (tab === "all" ? cards : cards.filter((card) => card.category === tab)), [cards, tab]);
  const groups = useMemo(() => {
    const result: { id: string; label: string; cards: TourCardData[] }[] = [];
    for (const card of filtered) {
      const last = result.at(-1);
      if (last && last.id === card.category) last.cards.push(card);
      else result.push({ id: card.category, label: card.categoryLabel, cards: [card] });
    }
    return result;
  }, [filtered]);

  const { radius, card: cardSize } = ringGeometry(layout.width, filtered.length);
  const ringHeight = Math.round(radius * 2 + cardSize * CARD_RATIO);

  // --- Размер сцены задаёт радиус, размер карточки и режим (круг или карусель), видимость запускает вылет из центра ---
  useEffect(() => {
    if (!stage) return;
    const measure = () => {
      const width = stage.clientWidth;
      setLayout({ width, mode: width >= RING_MIN_WIDTH ? "ring" : "carousel" });
    };
    queueMicrotask(measure);
    const resize = new ResizeObserver(measure);
    resize.observe(stage);

    // Запасной показ: в фоновой вкладке наблюдатель пересечений молчит, а секция не должна остаться пустой
    const fallback = window.setTimeout(() => setRevealed(true), 1500);
    const appear = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealed(true);
        appear.disconnect();
      },
      { threshold: 0.15 },
    );
    appear.observe(stage);

    return () => {
      window.clearTimeout(fallback);
      resize.disconnect();
      appear.disconnect();
    };
  }, [stage]);

  // Вылет карточек из центра проигрывается один раз, дальше переходы мгновенные
  useEffect(() => {
    if (!revealed) return;
    const id = window.setTimeout(() => setSettled(true), cards.length * ENTRANCE_STEP * 1000 + 800);
    return () => window.clearTimeout(id);
  }, [revealed, cards.length]);

  const clearLeaveTimer = () => {
    if (leaveTimer.current !== null) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };

  const activate = useCallback((slug: string) => {
    if (leaveTimer.current !== null) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setActiveSlug(slug);
    setRecentSlug(slug);
  }, []);

  const release = useCallback(() => {
    if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => setActiveSlug(null), LEAVE_DELAY_MS);
  }, []);

  const close = useCallback(() => {
    if (leaveTimer.current !== null) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setActiveSlug(null);
  }, []);

  useEffect(() => clearLeaveTimer, []);

  // Тап мимо карточки и Escape возвращают её на место
  useEffect(() => {
    if (!activeSlug) return;
    const onPointerDown = (event: PointerEvent) => {
      if (stage && !stage.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeSlug, close, stage]);

  const ring = layout.mode === "ring";
  const heading = (
    <div className={cn(ring && "pointer-events-none absolute left-1/2 top-1/2 w-[min(20rem,58%)] -translate-x-1/2 -translate-y-1/2 text-center")}>
      <h2 id={titleId} className="display text-[clamp(1.75rem,1.1rem+1.6vw,2.75rem)] leading-tight">
        {title}
      </h2>
      <p className="mt-3 text-[0.9375rem] text-mist">{countLabel}</p>
      <Link
        href={catalogHref}
        className="kicker pointer-events-auto mt-5 inline-flex items-center gap-2 text-accent transition-colors duration-300 hover:text-on-dark"
      >
        <span className="link-underline">{labels.exploreAll}</span>
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </div>
  );

  const cardsMarkup = filtered.map((card, index) => (
    <CircleCard
      key={card.slug}
      card={card}
      index={index}
      count={filtered.length}
      radius={radius}
      size={cardSize}
      variant={layout.mode}
      active={card.slug === activeSlug}
      recent={card.slug === recentSlug}
      revealed={revealed}
      settled={settled}
      zoom={reducedMotion ? 1 : ZOOM}
      labels={labels}
      onActivate={() => activate(card.slug)}
      onRelease={release}
      onClose={close}
    />
  ));

  return (
    <div className="mt-10 lg:mt-12">
      <div
        role="group"
        aria-label={labels.categories}
        className="-mx-5 flex gap-1 overflow-x-auto bg-secondary p-1 sm:mx-0 sm:inline-flex sm:max-w-full"
      >
        {tabs.map((item) => {
          const selected = item.id === tab;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setTab(item.id);
                close();
              }}
              className={cn(
                "kicker shrink-0 px-4 py-3.5 transition-colors duration-300",
                selected ? "bg-deep text-accent" : "text-on-dark/85 hover:text-on-dark",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-12 grid gap-10 xl:grid-cols-12 xl:gap-8">
        {/* Нумерованный список: наведение подсвечивает карточку в круге и наоборот */}
        <ol aria-label={labels.toursList} className="hidden xl:col-span-4 xl:block">
          {groups.map((group) => (
            <li key={group.id} className="mb-8 last:mb-0">
              {tab === "all" ? <p className="kicker mb-3 text-[0.75rem] text-note">{group.label}</p> : null}
              <ol>
                {group.cards.map((card) => {
                  const isActive = card.slug === activeSlug;
                  return (
                    <li key={card.slug}>
                      <Link
                        href={card.href}
                        onPointerEnter={(event) => {
                          if (event.pointerType === "mouse") activate(card.slug);
                        }}
                        onPointerLeave={(event) => {
                          if (event.pointerType === "mouse") release();
                        }}
                        onFocus={() => activate(card.slug)}
                        className={cn(
                          "flex items-baseline gap-4 py-2 transition-colors duration-300",
                          isActive ? "text-on-dark" : "text-on-dark/55 hover:text-on-dark",
                        )}
                      >
                        <span className="kicker w-7 shrink-0 text-accent">{card.number}</span>
                        <span className="display flex-1 text-[1.5rem] leading-[1.2]">{card.title}</span>
                        <span
                          className={cn(
                            "font-condensed text-[0.8125rem] font-semibold uppercase tracking-caps text-accent transition-opacity duration-300",
                            isActive ? "opacity-100" : "opacity-60",
                          )}
                        >
                          {card.priceLabel}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </li>
          ))}
        </ol>

        <div ref={setStage} className="xl:col-span-8">
          {ring ? (
            <div className="relative mx-auto" style={{ height: ringHeight }}>
              {heading}
              {cardsMarkup}
            </div>
          ) : (
            <>
              {heading}
              <ul className="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4">
                {filtered.map((card, index) => (
                  <li key={card.slug} className="w-[70%] shrink-0 snap-center">
                    {cardsMarkup[index]}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
