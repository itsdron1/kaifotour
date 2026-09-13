import { notFound } from "next/navigation";
import { TourPage } from "@/components/pages/TourPage";
import { getPublishedTour, publishedTours } from "@/data/tours";

type PageProps = { params: Promise<{ slug: string }> };

/** Страницы генерируются только для опубликованных туров, остальные адреса отдают 404 */
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedTours.map((tour) => ({ slug: tour.slug }));
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const tour = getPublishedTour(slug);
  if (!tour) notFound();
  return <TourPage locale="ru" tour={tour} />;
}
