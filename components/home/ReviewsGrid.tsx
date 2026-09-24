"use client";

import { ArrowUpRight, X } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { ReviewCard, SOURCE_ICON, SOURCE_LABEL, Stars, type ReviewCardLabels } from "@/components/home/ReviewCard";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";
import { fill } from "@/lib/format";
import { DURATION_REVEAL, EASE_REVEAL } from "@/lib/motion";
import type { ReviewCardData } from "@/lib/reviews";

export interface ReviewsGridLabels extends ReviewCardLabels {
  showAll: string;
  close: string;
  viewTour: string;
  original: string;
}

/** Сколько карточек видно до нажатия «Все отзывы» */
const PREVIEW_COUNT = 8;
const STEP_S = 0.06;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ReviewsGrid({ reviews, labels }: { reviews: ReviewCardData[]; labels: ReviewsGridLabels }) {
  const reducedMotion = Boolean(useReducedMotion());
  const [expanded, setExpanded] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const shown = expanded ? reviews : reviews.slice(0, PREVIEW_COUNT);
  const open = openId ? reviews.find((review) => review.id === openId) : undefined;

  // Пока открыто окно: страница под ним не прокручивается, фокус остаётся внутри
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus();
    };
  }, [open]);

  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      setOpenId(null);
      return;
    }
    if (event.key !== "Tab") return;

    const items = [...(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])];
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div>
      <ul
        className={cn(
          "-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2",
          "md:mx-0 md:grid md:snap-none md:gap-7 md:overflow-visible md:px-0 md:[grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]",
        )}
      >
        {shown.map((review, index) => (
          <motion.li
            key={review.id}
            className="w-[70%] shrink-0 snap-start md:w-auto"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: DURATION_REVEAL,
              delay: Math.min(index, PREVIEW_COUNT - 1) * STEP_S,
              ease: EASE_REVEAL,
            }}
          >
            <ReviewCard
              review={review}
              index={index}
              labels={labels}
              onOpen={() => {
                openerRef.current = document.activeElement as HTMLElement | null;
                setOpenId(review.id);
              }}
            />
          </motion.li>
        ))}
      </ul>

      {!expanded && reviews.length > PREVIEW_COUNT ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="kicker mt-8 inline-flex items-center gap-2 border border-divider px-5 py-3 text-ink transition-colors duration-300 hover:border-accent hover:text-accent-ink"
        >
          {fill(labels.showAll, { count: reviews.length })}
        </button>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-menu flex items-center justify-center p-5"
          onClick={() => setOpenId(null)}
          onKeyDown={handleDialogKeyDown}
          role="presentation"
        >
          <div aria-hidden="true" className="absolute inset-0 bg-deep/75" />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={fill(labels.openReview, { author: open.author })}
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-y-auto border border-sand bg-paper p-6 shadow-postcard sm:p-8"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpenId(null)}
              aria-label={labels.close}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-ink/60 transition-colors duration-300 hover:text-ink"
            >
              <X size={18} aria-hidden="true" />
            </button>

            {open.tour ? (
              <Photo image={open.tour.image} sizes="(min-width: 640px) 32rem, 90vw" className="aspect-[4/3] w-full" />
            ) : (
              <div className="relative flex aspect-[5/2] w-full items-center justify-center bg-deep">
                <span aria-hidden="true" className="display text-6xl leading-none text-accent">
                  «
                </span>
                <Image
                  src="/brand/kaifo-icon.svg"
                  alt=""
                  width={22}
                  height={22}
                  unoptimized
                  className="absolute bottom-3 right-3 h-[22px] w-[22px] opacity-70"
                />
              </div>
            )}

            <div className="mt-5 flex items-center gap-3">
              <Stars rating={open.rating} label={labels.rated} />
              <span className="flex items-center gap-1.5 font-condensed text-xs font-semibold uppercase tracking-caps text-label">
                {(() => {
                  const SourceIcon = SOURCE_ICON[open.source];
                  return <SourceIcon size={13} />;
                })()}
                {SOURCE_LABEL[open.source]}
              </span>
            </div>

            <p lang={open.lang} className="display mt-4 text-lg leading-relaxed text-ink">
              {open.text}
            </p>

            {open.translated ? <p className="mt-3 text-xs text-label">{labels.translated}</p> : null}

            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-divider pt-4">
              <p className="font-condensed text-sm font-semibold uppercase tracking-caps text-secondary">
                {open.authorUri ? (
                  <a href={open.authorUri} target="_blank" rel="noopener noreferrer" className="link-underline">
                    {open.author}
                  </a>
                ) : (
                  open.author
                )}
                {open.location ? <span className="text-label">, {open.location}</span> : null}
              </p>
              <p className="text-sm text-label">{open.dateLabel}</p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              {open.tour ? (
                <Link href={open.tour.href} className="kicker inline-flex items-center gap-2 text-secondary">
                  <span className="link-underline">{labels.viewTour}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ) : null}
              {open.sourceUrl ? (
                <a
                  href={open.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kicker inline-flex items-center gap-1.5 text-label"
                >
                  <span className="link-underline">{labels.original}</span>
                  <ArrowUpRight size={12} aria-hidden="true" />
                  <span className="sr-only">({labels.newTab})</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
