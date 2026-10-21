import { Photo, type PhotoSource } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";

interface TourGalleryProps {
  images: PhotoSource[];
  title: string;
}

/**
 * Галерея тура. Раскладка зависит от числа кадров: лучше меньше фото, но с этого тура,
 * поэтому кадров бывает один или два. Три и больше — одно крупное фото и два поменьше.
 */
export function TourGallery({ images, title }: TourGalleryProps) {
  const shown = images.slice(0, 3);
  if (shown.length === 0) return null;

  return (
    <section aria-labelledby="gallery-title" className="mt-16">
      <h2 id="gallery-title" className="display text-display-md">
        {title}
      </h2>

      {shown.length === 3 ? (
        <div className="mt-6 grid gap-2 sm:grid-cols-5 sm:grid-rows-[13rem_13rem]">
          {shown.map((image, index) => (
            <Photo
              key={image.src}
              image={image}
              sizes={
                index === 0
                  ? "(min-width: 1024px) 34vw, (min-width: 640px) 60vw, 100vw"
                  : "(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 100vw"
              }
              className={cn(
                "aspect-[4/3] sm:aspect-auto sm:h-full",
                index === 0 ? "sm:col-span-3 sm:row-span-2" : "sm:col-span-2",
              )}
            />
          ))}
        </div>
      ) : (
        <div className={cn("mt-6 grid gap-2", shown.length === 2 && "sm:grid-cols-2")}>
          {shown.map((image) => (
            <Photo
              key={image.src}
              image={image}
              sizes={shown.length === 2 ? "(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 56vw, 100vw"}
              className={shown.length === 2 ? "aspect-[4/3]" : "aspect-[16/9]"}
            />
          ))}
        </div>
      )}
    </section>
  );
}
