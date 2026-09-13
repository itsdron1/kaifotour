import { Photo, type PhotoSource } from "@/components/ui/Photo";

interface TourGalleryProps {
  images: PhotoSource[];
  title: string;
}

/** Галерея тура: одно крупное фото и два поменьше */
export function TourGallery({ images, title }: TourGalleryProps) {
  const [first, ...rest] = images;
  if (!first) return null;

  return (
    <section aria-labelledby="gallery-title" className="mt-16">
      <h2 id="gallery-title" className="display text-display-md">
        {title}
      </h2>
      <div className="mt-6 grid gap-2 sm:grid-cols-5 sm:grid-rows-[13rem_13rem]">
        <Photo
          image={first}
          sizes="(min-width: 1024px) 34vw, (min-width: 640px) 60vw, 100vw"
          className="aspect-[4/3] sm:col-span-3 sm:row-span-2 sm:aspect-auto sm:h-full"
        />
        {rest.slice(0, 2).map((image) => (
          <Photo
            key={image.src}
            image={image}
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 100vw"
            className="aspect-[4/3] sm:col-span-2 sm:aspect-auto sm:h-full"
          />
        ))}
      </div>
    </section>
  );
}
