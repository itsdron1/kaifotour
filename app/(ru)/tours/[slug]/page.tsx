import { notFound } from "next/navigation";
import { TourPage } from "@/components/pages/TourPage";
import { getPublishedTour, publishedTours } from "@/data/tours";

type PageProps = { params: Promise<{ slug: string }> };

/** Статически генерируются опубликованные туры; для остальных адресов notFound() отдаёт оформленную 404 */
export function generateStaticParams() {
  return publishedTours.map((tour) => ({ slug: tour.slug }));
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const tour = getPublishedTour(slug);
  if (!tour) notFound();
  return <TourPage locale="ru" tour={tour} />;
}
