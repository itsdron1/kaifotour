"use client";

import { CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { StoryCard, type StoryCardLabels } from "@/components/home/StoryCard";
import { cn } from "@/lib/cn";
import { fill } from "@/lib/format";
import type { StoryCardData } from "@/lib/story-view";
import { useAutoCycle } from "@/lib/use-auto-cycle";

export interface StoryStackLabels extends StoryCardLabels {
  title: string;
  pause: string;
  play: string;
  prev: string;
  next: string;
  position: string;
}

/** Пауза между перекладываниями. Та же цифра — в анимации story-progress в tailwind.config.ts */
const DELAY_MS = 3000;
const SHUFFLE_S = 0.75;
const SHUFFLE_EASE = [0.65, 0, 0.35, 1] as const;
const STEP_S = 0.06;
const SWIPE_MIN = 40;
const VISIBLE = 3;

/**
 * Смещения в стопке заданы в процентах от карточки, поэтому стопка одинаково
 * выглядит и на 1440, и на 375, где карточка занимает почти всю ширину экрана.
 */
const LAYERS = [
  { x: "0%", y: "0%", rotate: -3, scale: 1, opacity: 1 },
  { x: "3.4%", y: "4%", rotate: 2, scale: 0.96, opacity: 0.7 },
  { x: "6.8%", y: "8%", rotate: 5, scale: 0.92, opacity: 0.4 },
];
const LAYERS_COMPACT = [
  { x: "0%", y: "0%", rotate: -3, scale: 1, opacity: 1 },
  { x: "1.9%", y: "2.2%", rotate: 2, scale: 0.96, opacity: 0.7 },
  { x: "3.8%", y: "4.4%", rotate: 5, scale: 0.92, opacity: 0.4 },
];
const Z_LAYERS = [30, 20, 10];

/**
 * Стопка историй с автоматическим перекладыванием раз в 3 секунды.
 * Верхняя карточка уходит вправо, ныряет под низ стопки, остальные сдвигаются на позицию вперёд.
 * Наведение, фокус, тап и скрытая вкладка ставят отсчёт на паузу; при prefers-reduced-motion
 * автосмены нет вовсе, карточки листаются кнопками и меняются кроссфейдом.
 */
export function StoryStack({ stories, labels }: { stories: StoryCardData[]; labels: StoryStackLabels }) {
  const reducedMotion = Boolean(useReducedMotion());
  const [compact, setCompact] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [held, setHeld] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [leaving, setLeaving] = useState<{ id: string; behind: boolean } | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const previousIndex = useRef(0);
  const swipeStart = useRef<number | null>(null);

  const total = stories.length;
  const paused = hovered || focused || held || manualPause;
  const { index, cycle, running, go } = useAutoCycle(total, DELAY_MS, { enabled: !reducedMotion, paused });
  const lifted = hovered || held;

  // Узкий экран: смещения в стопке меньше, увеличение слабее, иначе карточка упирается в края
  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Карточка, которая уходит под низ стопки: на середине пути она опускается ниже остальных
  useEffect(() => {
    const previous = previousIndex.current;
    previousIndex.current = index;
    if (reducedMotion || total < 2) return;
    if ((previous + 1) % total !== index) return;
    const leavingId = stories[previous]?.id;
    if (!leavingId) return;

    setLeaving({ id: leavingId, behind: false });
    const toBack = window.setTimeout(
      () => setLeaving((value) => (value ? { ...value, behind: true } : value)),
      SHUFFLE_S * 450,
    );
    const clear = window.setTimeout(() => setLeaving(null), SHUFFLE_S * 1000);
    return () => {
      window.clearTimeout(toBack);
      window.clearTimeout(clear);
    };
  }, [index, reducedMotion, stories, total]);

  // Тап вне стопки снимает паузу, поставленную тапом
  useEffect(() => {
    if (!held) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest?.("[data-story-stack]")) setHeld(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [held]);

  function navigate(direction: 1 | -1) {
    if (total < 2) return;
    go(direction);
    setAnnouncement(fill(labels.position, { index: ((index + direction + total) % total) + 1, total }));
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      navigate(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(-1);
    }
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") swipeStart.current = event.clientX;
  }

  // Тач: свайп листает, короткий тап ставит на паузу и увеличивает, ссылки работают обычным тапом
  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") return;
    const start = swipeStart.current;
    swipeStart.current = null;
    if (start === null) return;

    const delta = event.clientX - start;
    if (Math.abs(delta) >= SWIPE_MIN) {
      setHeld(false);
      navigate(delta < 0 ? 1 : -1);
      return;
    }
    if ((event.target as Element | null)?.closest("a, button")) return;
    setHeld((value) => !value);
  }

  const controlClass =
    "flex h-9 w-9 items-center justify-center border border-divider text-ink transition-colors duration-300 hover:border-accent hover:text-accent-ink";

  return (
    <div className="mx-auto w-full max-w-[420px] lg:ml-auto lg:mr-0">
      <div className="flex items-center justify-between gap-4">
        <p className="kicker text-secondary">{labels.title}</p>

        <div className="flex gap-2">
          {reducedMotion ? null : (
            <button
              type="button"
              onClick={() => setManualPause((value) => !value)}
              aria-label={manualPause ? labels.play : labels.pause}
              className={controlClass}
            >
              {manualPause ? (
                <Play size={15} weight="fill" aria-hidden="true" />
              ) : (
                <Pause size={15} weight="fill" aria-hidden="true" />
              )}
            </button>
          )}
          <button type="button" onClick={() => navigate(-1)} aria-label={labels.prev} className={controlClass}>
            <CaretLeft size={15} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => navigate(1)} aria-label={labels.next} className={controlClass}>
            <CaretRight size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        data-story-stack="true"
        role="group"
        aria-label={labels.title}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
        }}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setHovered(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") setHovered(false);
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="relative mt-5 h-[312px] outline-offset-8 sm:h-[336px]"
      >
        {stories.map((story, cardIndex) => {
          const position = (cardIndex - index + total) % total;
          const visible = position < VISIBLE;
          const layers = compact ? LAYERS_COMPACT : LAYERS;
          const layer = layers[Math.min(position, VISIBLE - 1)];
          const back = layers[VISIBLE - 1];
          const isTop = position === 0;
          const isLeaving = leaving?.id === story.id;

          const resting = { ...layer, opacity: visible ? layer.opacity : 0 };
          const target = reducedMotion
            ? { x: "0%", y: "0%", rotate: 0, scale: 1, opacity: isTop ? 1 : 0 }
            : isTop && lifted
              ? { x: "0%", y: "0%", rotate: 0, scale: compact ? 1.04 : 1.1, opacity: 1 }
              : resting;

          // Уход верхней карточки: вверх и вправо, потом вниз, в позицию последней видимой
          const leaveTarget = {
            x: ["0%", "55%", back.x],
            y: ["0%", "-10%", back.y],
            rotate: [-3, 8, back.rotate],
            scale: [1, 1, back.scale],
            opacity: [1, 1, back.opacity],
          };

          const transition = isLeaving
            ? { duration: SHUFFLE_S, ease: SHUFFLE_EASE, times: [0, 0.45, 1] }
            : reducedMotion
              ? { duration: 0.3 }
              : isTop
                ? { duration: lifted ? 0.3 : 0.45, ease: SHUFFLE_EASE }
                : { duration: SHUFFLE_S, ease: SHUFFLE_EASE, delay: Math.min(position, VISIBLE) * STEP_S };

          return (
            <motion.div
              key={story.id}
              className={cn("absolute inset-x-0 top-0 h-[300px]")}
              style={{ zIndex: isLeaving ? (leaving.behind ? 0 : 40) : visible ? Z_LAYERS[position] : 0 }}
              initial={false}
              animate={isLeaving ? leaveTarget : target}
              transition={transition}
              inert={!isTop}
            >
              <StoryCard story={story} labels={labels} expanded={isTop && lifted} />

              {/* Индикатор: латунная линия заполняется за 3 секунды и замирает на паузе */}
              {isTop && !reducedMotion ? (
                <span
                  key={cycle}
                  aria-hidden="true"
                  className="animate-story-progress pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-accent"
                  style={{ animationPlayState: running ? "running" : "paused" }}
                />
              ) : null}
            </motion.div>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
