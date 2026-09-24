"use client";

import {
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  GlobeSimple,
  GoogleLogo,
  InstagramLogo,
  Star,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRef, useState, type ComponentType } from "react";
import type { Review, ReviewSource } from "@/data/reviews";
import { cn } from "@/lib/cn";
import { DURATION_REVEAL, EASE_REVEAL, STAGGER_STEP } from "@/lib/motion";
import { fill } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { initialsOf, reviewDateLabel } from "@/lib/reviews";

export interface ReviewsCarouselLabels {
  carousel: string;
  prev: string;
  next: string;
  readMore: string;
  readLess: string;
  rated: string;
  newTab: string;
}

export interface ReviewCardData extends Review {
  tourHref?: string;
  tourTitle?: string;
}

interface ReviewsCarouselProps {
  reviews: ReviewCardData[];
  locale: Locale;
  labels: ReviewsCarouselLabels;
}

/** Длинный отзыв обрезаем до шести строк и раскрываем по кнопке */
const CLAMP_LENGTH = 280;
const SOURCE_ICON: Record<ReviewSource, ComponentType<{ size?: number; className?: string }>> = {
  google: GoogleLogo,
  instagram: InstagramLogo,
  whatsapp: WhatsappLogo,
  tripadvisor: GlobeSimple,
};
const SOURCE_LABEL: Record<ReviewSource, string> = {
  google: "Google",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  tripadvisor: "Tripadvisor",
};

function ReviewCard({
  review,
  index,
  locale,
  labels,
}: {
  review: ReviewCardData;
  index: number;
  locale: Locale;
  labels: ReviewsCarouselLabels;
}) {
  const [expanded, setExpanded] = useState(false);
  const SourceIcon = SOURCE_ICON[review.source];

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: DURATION_REVEAL, delay: index * STAGGER_STEP, ease: EASE_REVEAL }}
      className="flex h-full flex-col border border-divider bg-paper p-6"
    >
      <span aria-hidden="true" className="display text-4xl leading-none text-accent">
        «
      </span>

      <p className="mt-3 flex items-center gap-1" role="img" aria-label={fill(labels.rated, { rating: review.rating })}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            weight={star <= review.rating ? "fill" : "regular"}
            aria-hidden="true"
            className={star <= review.rating ? "text-accent" : "text-divider"}
          />
        ))}
      </p>

      <p
        lang={review.lang}
        className={cn("mt-4 text-base leading-relaxed text-ink/85", !expanded && "line-clamp-6")}
      >
        {review.text}
      </p>
      {review.text.length > CLAMP_LENGTH ? (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="kicker mt-3 self-start text-secondary"
        >
          <span className="link-underline">{expanded ? labels.readLess : labels.readMore}</span>
        </button>
      ) : null}

      {review.tourHref && review.tourTitle ? (
        <Link href={review.tourHref} className="kicker mt-4 self-start text-secondary">
          <span className="link-underline">{review.tourTitle}</span>
        </Link>
      ) : null}

      <div className="mt-auto flex items-center gap-3 pt-6">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand font-condensed text-sm font-semibold text-ink"
        >
          {initialsOf(review.author)}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-condensed text-sm font-semibold uppercase tracking-caps text-ink">
            {review.author}
          </span>
          {review.location ? <span className="block truncate text-xs text-label">{review.location}</span> : null}
        </span>
        <span className="ml-auto shrink-0 text-xs text-label">{reviewDateLabel(review.date, locale)}</span>
      </div>

      <p className="mt-3 flex items-center gap-1.5 border-t border-divider pt-3 text-xs text-label">
        <SourceIcon size={14} className="shrink-0" />
        {review.sourceUrl ? (
          <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
            <span className="link-underline">{SOURCE_LABEL[review.source]}</span>
            <ArrowUpRight size={11} aria-hidden="true" />
            <span className="sr-only">({labels.newTab})</span>
          </a>
        ) : (
          SOURCE_LABEL[review.source]
        )}
      </p>
    </motion.article>
  );
}

/** Карусель отзывов со scroll-snap: две карточки в ряд на десктопе, одна на мобильном */
export function ReviewsCarousel({ reviews, locale, labels }: ReviewsCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : track.clientWidth;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <div>
      <ul
        ref={trackRef}
        aria-label={labels.carousel}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0"
      >
        {reviews.map((review, index) => (
          <li key={review.id} className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-0.5rem)]">
            <ReviewCard review={review} index={index} locale={locale} labels={labels} />
          </li>
        ))}
      </ul>

      {reviews.length > 1 ? (
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label={labels.prev}
            className="flex h-10 w-10 items-center justify-center border border-divider text-ink transition-colors duration-300 hover:border-accent hover:text-accent-ink"
          >
            <CaretLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label={labels.next}
            className="flex h-10 w-10 items-center justify-center border border-divider text-ink transition-colors duration-300 hover:border-accent hover:text-accent-ink"
          >
            <CaretRight size={16} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
