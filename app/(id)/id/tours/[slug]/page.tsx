import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TourPage } from "@/components/pages/TourPage";
import { getPublishedTour, publishedTours } from "@/data/tours";
import { tourMetadata } from "@/lib/page-metadata";

type PageProps = { params: Promise<{ slug: string }> };

/** Статически генерируются опубликованные туры; для остальных адресов notFound() отдаёт оформленную 404 */
export function generateStaticParams() {
  return publishedTours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return tourMetadata("id", slug);
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const tour = getPublishedTour(slug);
  if (!tour) notFound();
  return <TourPage locale="id" tour={tour} />;
}
