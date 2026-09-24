"use client";

import { ArrowUpRight, GlobeSimple, GoogleLogo, InstagramLogo, Star, WhatsappLogo } from "@phosphor-icons/react";
import Link from "next/link";
import type { ComponentType } from "react";
import { Photo } from "@/components/ui/Photo";
import type { ReviewSource } from "@/data/reviews";
import { cn } from "@/lib/cn";
import { fill } from "@/lib/format";
import type { ReviewCardData } from "@/lib/reviews";

export interface ReviewPostcardLabels {
  badge: string;
  rated: string;
  translated: string;
  original: string;
  newTab: string;
}

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

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <p className="flex items-center gap-0.5" role="img" aria-label={fill(label, { rating })}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={13}
          weight={star <= rating ? "fill" : "regular"}
          aria-hidden="true"
          className={star <= rating ? "text-accent" : "text-ink/25"}
        />
      ))}
    </p>
  );
}

interface ReviewPostcardProps {
  review: ReviewCardData;
  labels: ReviewPostcardLabels;
  /** Карточка наверху стопки и раскрыта: длинный отзыв показывается целиком */
  expanded: boolean;
}

/**
 * Отзыв гостя почтовой открыткой: тот же вид, что у карточек историй —
 * песочная подложка, фото 4:5 сверху, подпись снизу. Если отзыв о конкретном туре,
 * на карточке его фото, а вся открытка ведёт на страницу тура.
 */
export function ReviewPostcard({ review, labels, expanded }: ReviewPostcardProps) {
  const SourceIcon = SOURCE_ICON[review.source];

  return (
    <figure
      className={cn(
        "relative flex w-full flex-col bg-sand p-4 pb-6 shadow-postcard",
        expanded ? "h-auto min-h-full" : "h-full",
      )}
    >
      <Photo image={review.image} sizes="(min-width: 1024px) 28rem, 90vw" className="aspect-[4/5] w-full" />

      <figcaption className="flex flex-1 flex-col px-2 pt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="kicker text-[0.75rem] text-ink/75">{labels.badge}</p>
          <Stars rating={review.rating} label={labels.rated} />
        </div>

        <blockquote
          lang={review.lang}
          className={cn("display mt-3 text-lg leading-snug text-ink", !expanded && "line-clamp-3")}
        >
          {review.text}
        </blockquote>

        <div className="mt-auto pt-4">
          <p className="kicker text-[0.75rem] text-ink/70">
            {review.author}
            <span className="text-ink/50"> · {review.dateLabel}</span>
          </p>

          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-condensed text-[0.6875rem] font-semibold uppercase tracking-caps text-ink/60">
            <span className="flex items-center gap-1">
              <SourceIcon size={11} />
              {SOURCE_LABEL[review.source]}
            </span>
            {review.sourceUrl ? (
              <a
                href={review.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center gap-1 text-secondary"
              >
                <span className="link-underline">{labels.original}</span>
                <ArrowUpRight size={10} aria-hidden="true" />
                <span className="sr-only">({labels.newTab})</span>
              </a>
            ) : null}
            {review.translated ? <span className="normal-case tracking-normal">{labels.translated}</span> : null}
          </p>

          {review.tour ? (
            /* Растянутая ссылка: клик по всей открытке открывает тур, о котором отзыв */
            <Link
              href={review.tour.href}
              className="kicker mt-3 inline-flex items-center gap-1.5 text-[0.75rem] text-secondary after:absolute after:inset-0 after:content-['']"
            >
              <span className="link-underline">{review.tour.title}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}
