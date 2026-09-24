import type { PhotoSource } from "@/data/media";
import { stories, type StoryKind } from "@/data/stories";
import type { Locale } from "@/lib/i18n";
import { getTourCards } from "@/lib/tour-view";

/** Тур на карточке истории: только то, что нужно для показа */
export interface StoryTourData {
  slug: string;
  title: string;
  href: string;
  priceLabel: string;
  image: PhotoSource;
}

/** Сериализуемые данные карточки на одном языке: безопасно передавать в клиентский компонент */
export interface StoryCardData {
  id: string;
  kind: StoryKind;
  text: string;
  author?: string;
  location?: string;
  sourceUrl?: string;
  tour?: StoryTourData;
}

/**
 * Карточки для стопки: сначала истории гостей, потом сцены с маршрутов в порядке data/tours.ts.
 * Карточка «с маршрута» без опубликованного тура не показывается: её некуда вести.
 */
export function getStoryCards(locale: Locale): StoryCardData[] {
  const tours = getTourCards(locale);

  const cards = stories.flatMap<StoryCardData>((story) => {
    const tour = story.tourSlug ? tours.find((item) => item.slug === story.tourSlug) : undefined;
    if (story.kind === "moment" && !tour) return [];

    return [
      {
        id: story.id,
        kind: story.kind,
        text: story.text[locale],
        author: story.author?.[locale],
        location: story.location,
        sourceUrl: story.sourceUrl,
        tour: tour
          ? {
              slug: tour.slug,
              title: tour.title,
              href: tour.href,
              priceLabel: tour.priceLabel,
              image: tour.image,
            }
          : undefined,
      },
    ];
  });

  return [...cards.filter((card) => card.kind === "guest"), ...cards.filter((card) => card.kind === "moment")];
}
