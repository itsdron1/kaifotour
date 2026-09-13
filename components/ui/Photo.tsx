import Image from "next/image";
import type { PhotoSource } from "@/data/media";
import { cn } from "@/lib/cn";

export type { PhotoSource };

interface PhotoProps {
  image: PhotoSource;
  sizes: string;
  preload?: boolean;
  className?: string;
  imageClassName?: string;
}

/** Фото с единой цветокоррекцией сайта (.photo-grade в globals.css) */
export function Photo({ image, sizes, preload = false, className, imageClassName }: PhotoProps) {
  return (
    <div className={cn("photo-grade", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        preload={preload}
        className={cn("object-cover", imageClassName)}
        style={image.position ? { objectPosition: image.position } : undefined}
      />
    </div>
  );
}
