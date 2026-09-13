import { resolveMedia } from "@/data/media";
import { getDictionary } from "@/lib/dictionaries";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = getDictionary("ru").meta.homeTitle;
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpenGraphImage() {
  const t = getDictionary("ru");
  return renderOgImage({ title: t.hero.title, kicker: t.footer.tagline, photo: resolveMedia("hero", "ru").src });
}
