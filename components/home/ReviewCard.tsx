"use client";

import { ArrowRight, GlobeSimple, GoogleLogo, InstagramLogo, Star, WhatsappLogo } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType, CSSProperties } from "react";
import { Photo } from "@/components/ui/Photo";
import type { ReviewSource } from "@/data/reviews";
import { cn } from "@/lib/cn";
import { fill } from "@/lib/format";
import type { ReviewCardData } from "@/lib/reviews";

export interface ReviewCardLabels {
  rated: string;
  openReview: string;
  translated: string;
  newTab: string;
}

export const SOURCE_ICON: Record<ReviewSource, ComponentType<{ size?: number; className?: string }>> = {
  google: GoogleLogo,
  instagram: InstagramLogo,
  whatsapp: WhatsappLogo,
  tripadvisor: GlobeSimple,
};

export const SOURCE_LABEL: Record<ReviewSource, string> = {
  google: "Google",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  tripadvisor: "Tripadvisor",
};

/** Наклон стабильный по индексу: при каждом рендере карточка лежит на столе одинаково */
const TILTS = [-2.5, 1.5, -1.5, 2.5, -2, 2];
export const tiltOf = (index: number) => TILTS[index % TILTS.length];

export function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <p className="flex items-center gap-0.5" role="img" aria-label={fill(label, { rating })}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={12}
          weight={star <= rating ? "fill" : "regular"}
          aria-hidden="true"
          className={star <= rating ? "text-accent" : "text-divider"}
        />
      ))}
    </p>
  );
}

interface ReviewCardProps {
  review: ReviewCardData;
  index: number;
  labels: ReviewCardLabels;
  onOpen: () => void;
}

/**
 * Маленькая карточка отзыва в духе карточки тура: фото сверху, подпись снизу,
 * лёгкий наклон и выпрямление при наведении. Клик по карточке открывает полный текст,
 * клик по названию тура ведёт на страницу тура.
 */
export function ReviewCard({ review, index, labels, onOpen }: ReviewCardProps) {
  const SourceIcon = SOURCE_ICON[review.source];

  return (
    <article
      style={{ "--tilt": `${tiltOf(index)}deg` } as CSSProperties}
      className={cn(
        "group relative flex h-full flex-col border border-sand bg-paper p-2.5 shadow-polaroid",
        "transition-[transform,box-shadow] duration-300 ease-editorial [transform:rotate(var(--tilt))]",
        "hover:z-10 hover:shadow-polaroid-lift hover:[transform:rotate(0deg)_scale(1.05)]",
        "focus-within:[transform:rotate(0deg)_scale(1.05)] motion-reduce:transition-none",
      )}
    >
      {review.tour ? (
        <Photo image={review.tour.image} sizes="240px" className="aspect-[4/3] w-full" />
      ) : (
        <div className="relative flex aspect-[4/3] w-full items-center justify-center bg-deep">
          <span aria-hidden="true" className="display text-[3.25rem] leading-none text-accent">
            «
          </span>
          <Image
            src="/brand/kaifo-icon.svg"
            alt=""
            width={18}
            height={18}
            unoptimized
            className="absolute bottom-2 right-2 h-[18px] w-[18px] opacity-70"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col px-1 pt-3">
        <div className="flex items-center justify-between gap-2">
          <Stars rating={review.rating} label={labels.rated} />
          <span className="flex items-center gap-1 font-condensed text-[0.6875rem] font-semibold uppercase tracking-caps text-label">
            <SourceIcon size={11} />
            {SOURCE_LABEL[review.source]}
          </span>
        </div>

        <p lang={review.lang} className="display mt-2.5 line-clamp-4 text-[0.9375rem] leading-snug text-ink">
          {review.text}
        </p>

        <div className="mt-auto pt-3">
          <p className="font-condensed text-xs font-semibold uppercase tracking-caps text-secondary">
            {review.author}
            {review.location ? <span className="text-label">, {review.location}</span> : null}
          </p>

          {review.tour ? (
            <Link
              href={review.tour.href}
              onClick={(event) => event.stopPropagation()}
              className="relative z-10 mt-1.5 inline-flex items-center gap-1 font-condensed text-[0.6875rem] font-semibold uppercase tracking-caps text-label transition-colors duration-300 hover:text-secondary"
            >
              <span className="line-clamp-1">{review.tour.title}</span>
              <ArrowRight size={10} aria-hidden="true" className="shrink-0" />
            </Link>
          ) : null}
        </div>
      </div>

      {/* Растянутая кнопка: клик по любому месту карточки открывает полный текст */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={fill(labels.openReview, { author: review.author })}
        className="absolute inset-0 cursor-pointer outline-offset-4"
      />
    </article>
  );
}
