import { resolveMedia } from "@/data/media";
import { getDictionary } from "@/lib/dictionaries";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = getDictionary("id").meta.homeTitle;
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpenGraphImage() {
  const t = getDictionary("id");
  return renderOgImage({ title: t.hero.title, kicker: t.footer.tagline, photo: resolveMedia("hero", "id").src });
}
