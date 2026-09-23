import { resolveMedia } from "@/data/media";
import { getPublishedTour } from "@/data/tours";
import { getDictionary } from "@/lib/dictionaries";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "KAIFO";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = getPublishedTour(slug);
  if (!tour) {
    const t = getDictionary("ru");
    return renderOgImage({ title: t.hero.title, kicker: t.footer.tagline });
  }
  return renderOgImage({ title: tour.title, kicker: tour.kicker.ru, photo: resolveMedia(tour.image, "ru").src });
}
