"use client";

import { ArrowRight, ArrowUpRight, WhatsappLogo } from "@phosphor-icons/react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import { useMemo, useRef, useState, type PointerEvent } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";
import type { TourCardData } from "@/lib/tour-view";

interface ExplorerTab {
  id: string;
  label: string;
}

interface ToursExplorerProps {
  cards: TourCardData[];
  tabs: ExplorerTab[];
  catalogHref: string;
  labels: {
    categories: string;
    toursList: string;
    exploreAll: string;
    book: string;
    details: string;
    disclaimer: string;
    newTab: string;
  };
}

/** Позиции «раскиданных» открыток позади активной */
const BACK_SLOTS = [
  "right-[1%] top-0 w-[35%] rotate-[7deg]",
  "bottom-[3%] left-0 w-[33%] -rotate-[8deg]",
  "bottom-0 right-[4%] w-[30%] rotate-[3deg]",
];

const MOBILE_LIMIT = 6;
const CURSOR_SIZE = 56;
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Курсор-иконка над открытками (docs/editorial-style.md, раздел 3) включается только CSS-вариантами
 * motion-safe и pointer: fine, поэтому серверная и клиентская разметка совпадают.
 */
const CURSOR_TARGET = "motion-safe:[@media(pointer:fine)]:cursor-none";

export function ToursExplorer({ cards, tabs, catalogHref, labels }: ToursExplorerProps) {
  const [tab, setTab] = useState("all");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothX = useSpring(cursorX, { stiffness: 520, damping: 42, mass: 0.35 });
  const smoothY = useSpring(cursorY, { stiffness: 520, damping: 42, mass: 0.35 });

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

  const active = filtered.find((card) => card.slug === activeSlug) ?? filtered[0];
  if (!active) return null;

  const activeIndex = filtered.indexOf(active);
  const backCards = [1, 2, 3]
    .map((offset) => filtered[(activeIndex + offset) % filtered.length])
    .filter((card, index, list) => card.slug !== active.slug && list.findIndex((item) => item.slug === card.slug) === index);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    cursorX.set(event.clientX - rect.left - CURSOR_SIZE / 2);
    cursorY.set(event.clientY - rect.top - CURSOR_SIZE / 2);
  }

  const cursorHandlers = {
    onPointerEnter: () => setCursorVisible(true),
    onPointerLeave: () => setCursorVisible(false),
  };

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
                setActiveSlug(null);
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

      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <ol aria-label={labels.toursList} className="hidden lg:col-span-5 lg:block">
          {groups.map((group) => (
            <li key={group.id} className="mb-8 last:mb-0">
              {tab === "all" ? <p className="kicker mb-3 text-[0.75rem] text-note">{group.label}</p> : null}
              <ol>
                {group.cards.map((card) => {
                  const isActive = card.slug === active.slug;
                  return (
                    <li key={card.slug}>
                      <Link
                        href={card.href}
                        onPointerEnter={() => setActiveSlug(card.slug)}
                        onFocus={() => setActiveSlug(card.slug)}
                        className={cn(
                          "group flex items-baseline gap-5 py-2 transition-colors duration-300",
                          isActive ? "text-on-dark" : "text-on-dark/55 hover:text-on-dark",
                        )}
                      >
                        <span className="kicker w-7 shrink-0 text-accent">{card.number}</span>
                        <span className="display flex-1 text-[1.625rem] leading-[1.2]">{card.title}</span>
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

        <div className="relative hidden lg:col-span-7 lg:block">
          <div ref={stageRef} onPointerMove={handlePointerMove} className="sticky top-28 h-[38rem] xl:h-[41rem]">
            {backCards.map((card, index) => (
              <Link
                key={index}
                href={card.href}
                {...cursorHandlers}
                className={cn(
                  "group absolute z-10 block bg-paper p-2.5 pb-3 text-ink shadow-postcard transition-[transform,box-shadow] duration-350 ease-editorial hover:z-30 hover:-translate-y-2 hover:rotate-0 hover:shadow-postcard-lift",
                  CURSOR_TARGET,
                  BACK_SLOTS[index],
                )}
              >
                <motion.span
                  key={card.slug}
                  className="block"
                  initial={{ opacity: 0.35 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <Photo image={card.image} sizes="17rem" className="aspect-[4/5] w-full" />
                  <span className="mt-2.5 flex items-baseline gap-3">
                    <span className="kicker text-[0.6875rem] text-secondary">{card.number}</span>
                    <span className="truncate font-condensed text-[0.8125rem] font-semibold uppercase tracking-caps">
                      {card.title}
                    </span>
                  </span>
                </motion.span>
              </Link>
            ))}

            <div className="absolute left-[16%] top-[5%] z-20 w-[52%] -rotate-2 bg-paper p-3 text-ink shadow-postcard-lift transition-transform duration-350 ease-editorial hover:rotate-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.slug}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease }}
                >
                  <Link
                    href={active.href}
                    tabIndex={-1}
                    aria-hidden="true"
                    {...cursorHandlers}
                    className={cn("block", CURSOR_TARGET)}
                  >
                    <Photo image={active.image} sizes="26rem" className="aspect-[4/3] w-full" />
                  </Link>
                  <div className="px-2 pb-2 pt-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="kicker text-[0.6875rem] text-secondary">{active.kicker}</p>
                      {active.badgeLabel ? (
                        <span className="kicker border border-accent-ink px-1.5 py-1 text-[0.625rem] text-accent-ink">
                          {active.badgeLabel}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="display mt-2 text-[1.75rem] leading-[1.15]">{active.title}</h3>
                    <div className="mt-3 flex items-baseline justify-between gap-4">
                      <p className="font-condensed text-lg font-semibold uppercase tracking-caps text-accent-ink">
                        {active.priceLabel}
                      </p>
                      <Link href={active.href} className="kicker inline-flex items-center gap-1.5 text-ink">
                        <span className="link-underline">{labels.details}</span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                    <p className="mt-1 text-xs text-label">{labels.disclaimer}</p>
                    <ButtonLink
                      href={active.bookHref}
                      external
                      newTabLabel={labels.newTab}
                      icon={<WhatsappLogo size={17} aria-hidden="true" />}
                      className="mt-4 w-full"
                    >
                      {labels.book}
                    </ButtonLink>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-cursor hidden h-14 w-14 items-center justify-center bg-accent text-ink motion-safe:[@media(pointer:fine)]:flex"
              style={{ x: smoothX, y: smoothY }}
              initial={false}
              animate={{ opacity: cursorVisible ? 1 : 0, scale: cursorVisible ? 1 : 0.6 }}
              transition={{ duration: 0.2, ease }}
            >
              <ArrowUpRight size={22} weight="bold" />
            </motion.div>
          </div>
        </div>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:hidden">
        {filtered.slice(0, MOBILE_LIMIT).map((card) => (
          <li key={card.slug}>
            <Link href={card.href} className="flex gap-4 bg-paper p-2.5 text-ink shadow-postcard">
              <Photo image={card.image} sizes="6rem" className="aspect-square w-24 shrink-0" />
              <span className="flex min-w-0 flex-col justify-center py-1">
                <span className="kicker text-[0.6875rem] text-secondary">
                  {card.number} / {card.categoryLabel}
                </span>
                <span className="display mt-1.5 text-xl leading-tight">{card.title}</span>
                <span className="mt-1.5 font-condensed text-sm font-semibold uppercase tracking-caps text-accent-ink">
                  {card.priceLabel}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-12 lg:mt-16">
        <ButtonLink href={catalogHref} variant="outline-dark" iconAfter={<ArrowRight size={16} aria-hidden="true" />}>
          {labels.exploreAll}
        </ButtonLink>
      </div>
    </div>
  );
}
