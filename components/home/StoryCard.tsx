import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";
import type { StoryCardData } from "@/lib/story-view";

export interface StoryCardLabels {
  guestBadge: string;
  momentBadge: string;
  viewTour: string;
}

interface StoryCardProps {
  story: StoryCardData;
  labels: StoryCardLabels;
  /** Карточка наверху стопки и раскрыта: длинный текст показывается целиком */
  expanded: boolean;
}

/**
 * Карточка стопки историй. Два вида с одинаковым размером, чтобы стопка не прыгала:
 * «история гостя» — настоящие слова гостя, «с маршрута» — сцена от лица KAIFO.
 */
export function StoryCard({ story, labels, expanded }: StoryCardProps) {
  const base = "flex h-full w-full flex-col border border-divider bg-paper shadow-polaroid";

  if (story.kind === "guest") {
    return (
      <article className={cn(base, "p-6 sm:p-7")}>
        <p className="kicker text-[0.7rem] text-accent-ink">{labels.guestBadge}</p>
        <span aria-hidden="true" className="display mt-2 text-5xl leading-none text-accent">
          «
        </span>
        <p
          className={cn(
            "mt-1 text-[17px] leading-relaxed text-ink/85",
            !expanded && "line-clamp-5 [mask-image:linear-gradient(to_bottom,black_72%,transparent)]",
          )}
        >
          {story.text}
        </p>
        <div className="mt-auto pt-5">
          {story.author ? <p className="kicker text-[0.7rem] text-ink/70">{story.author}</p> : null}
          {story.tour ? (
            <Link href={story.tour.href} className="kicker mt-3 inline-block text-secondary">
              <span className="link-underline">{story.tour.title}</span>
            </Link>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <article className={cn(base, "flex-row gap-4 p-5 sm:gap-5 sm:p-6")}>
      {story.tour ? (
        <div className="hidden w-[104px] shrink-0 self-start bg-sand p-1.5 pb-4 shadow-polaroid sm:block">
          <Photo image={story.tour.image} sizes="110px" className="aspect-[3/4] w-full" />
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <p className="kicker text-[0.7rem] text-secondary">{labels.momentBadge}</p>
        <p className="display mt-3 text-[21px] leading-snug text-ink">{story.text}</p>

        {story.tour ? (
          <div className="mt-auto pt-5">
            <p className="font-condensed text-sm font-semibold uppercase tracking-caps text-ink">{story.tour.title}</p>
            <p className="mt-1 font-condensed text-sm font-semibold uppercase tracking-caps text-accent-ink">
              {story.tour.priceLabel}
            </p>
            <Link href={story.tour.href} className="kicker mt-3 inline-flex items-center gap-1.5 text-secondary">
              <span className="link-underline">{labels.viewTour}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}
