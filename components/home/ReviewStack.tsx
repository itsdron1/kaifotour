"use client";

import { ReviewPostcard, type ReviewPostcardLabels } from "@/components/home/ReviewPostcard";
import { CardStack, type CardStackLabels } from "@/components/ui/CardStack";
import type { ReviewCardData } from "@/lib/reviews";

export interface ReviewStackLabels extends ReviewPostcardLabels, CardStackLabels {}

/**
 * Стопка отзывов: те же открытки и та же механика перекладывания, что в разделе историй.
 * Подпись над стопкой не показываем — у раздела есть собственный заголовок.
 */
export function ReviewStack({ reviews, labels }: { reviews: ReviewCardData[]; labels: ReviewStackLabels }) {
  return (
    <CardStack
      items={reviews}
      labels={labels}
      showTitle={false}
      className="mx-auto max-w-md lg:mx-0"
      renderCard={(review, { expanded }) => <ReviewPostcard review={review} labels={labels} expanded={expanded} />}
    />
  );
}
