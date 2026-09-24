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
 * Почтовая открытка секции: песочная подложка, фото 4:5 сверху, подпись снизу.
 * Вид тот же, что был у одиночной карточки истории гостя; меняется только содержание подписи —
 * у истории гостя это его слова и подпись, у сцены с маршрута — тур, цена и ссылка.
 */
export function StoryCard({ story, labels, expanded }: StoryCardProps) {
  const guest = story.kind === "guest";
  const text = cn("display mt-3 text-lg leading-snug text-ink", !expanded && "line-clamp-3");

  return (
    <figure
      className={cn("flex w-full flex-col bg-sand p-4 pb-6 shadow-postcard", expanded ? "h-auto min-h-full" : "h-full")}
    >
      <Photo image={story.image} sizes="(min-width: 1024px) 28rem, 90vw" className="aspect-[4/5] w-full" />

      <figcaption className="flex flex-1 flex-col px-2 pt-5">
        <p className="kicker text-[0.75rem] text-ink/75">{guest ? labels.guestBadge : labels.momentBadge}</p>

        {guest ? <blockquote className={text}>{story.text}</blockquote> : <p className={text}>{story.text}</p>}

        <div className="mt-auto pt-4">
          {guest ? (
            story.author ? (
              <p className="kicker text-[0.75rem] text-ink/70">{story.author}</p>
            ) : null
          ) : story.tour ? (
            <>
              <p className="kicker flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[0.75rem] text-ink/70">
                <span>{story.tour.title}</span>
                <span className="text-accent-ink">{story.tour.priceLabel}</span>
              </p>
              <Link
                href={story.tour.href}
                className="kicker mt-3 inline-flex items-center gap-1.5 text-[0.75rem] text-secondary"
              >
                <span className="link-underline">{labels.viewTour}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}
