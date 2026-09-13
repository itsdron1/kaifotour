import Image from "next/image";
import type { PhotoSource } from "@/data/media";
import { cn } from "@/lib/cn";

export type { PhotoSource };

interface PhotoProps {
  image: PhotoSource;
  sizes: string;
  preload?: boolean;
  /** "eager" для кадров, которые вот-вот появятся на экране (например, следующая карточка в колоде hero) */
  loading?: "eager" | "lazy";
  className?: string;
  imageClassName?: string;
}

/** Фото с единой цветокоррекцией сайта (.photo-grade в globals.css) */
export function Photo({ image, sizes, preload = false, loading, className, imageClassName }: PhotoProps) {
  return (
    <div className={cn("photo-grade", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        preload={preload}
        loading={preload ? undefined : loading}
        draggable={false}
        className={cn("object-cover", imageClassName)}
        style={image.position ? { objectPosition: image.position } : undefined}
      />
    </div>
  );
}
