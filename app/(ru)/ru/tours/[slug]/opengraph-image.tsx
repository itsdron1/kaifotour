import { renderTourOgImage, tourOgImageMetadata } from "@/lib/og";

/** Карточка тура для соцсетей: фото тура, логотип и название; alt — название тура */
export function generateImageMetadata({ params }: { params: { slug: string } }) {
  return tourOgImageMetadata(params.slug);
}

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderTourOgImage("ru", slug);
}
