"use client";

import { StoryCard, type StoryCardLabels } from "@/components/home/StoryCard";
import { CardStack, type CardStackLabels } from "@/components/ui/CardStack";
import type { StoryCardData } from "@/lib/story-view";

export interface StoryStackLabels extends StoryCardLabels, CardStackLabels {}

/**
 * Стопка историй: настоящие истории гостей и сцены с маршрутов.
 * Механика перекладывания общая с другими стопками сайта и живёт в CardStack.
 */
export function StoryStack({ stories, labels }: { stories: StoryCardData[]; labels: StoryStackLabels }) {
  return (
    <CardStack
      items={stories}
      // Карточка «с маршрута» самая высокая: у неё в подписи тур, цена и ссылка
      spacerItem={stories.find((story) => story.kind === "moment") ?? stories[0]}
      labels={labels}
      className="mx-auto max-w-md lg:ml-auto lg:mr-0"
      renderCard={(story, { expanded }) => <StoryCard story={story} labels={labels} expanded={expanded} />}
    />
  );
}
