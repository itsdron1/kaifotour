import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { resolveMedia, type MediaKey } from "@/data/media";
import { cn } from "@/lib/cn";
import { getDictionary, type Dictionary } from "@/lib/dictionaries";
import { localizedPath, type Locale } from "@/lib/i18n";

type SectorKey = keyof Dictionary["ride"]["sectors"];

/** Четыре сектора коллажа (docs/editorial-style.md, раздел 2, «How We Ride & Explore») */
const sectors: { key: SectorKey; image: MediaKey; path: string; sizes: string; className: string }[] = [
  {
    key: "ocean",
    image: "boat-turquoise",
    path: "/tours?category=ocean",
    sizes: "(min-width: 768px) 58vw, 100vw",
    className: "md:col-span-7 md:row-span-2",
  },
  {
    key: "offroad",
    image: "atv",
    path: "/tours?category=offroad",
    sizes: "(min-width: 768px) 42vw, 100vw",
    className: "md:col-span-5",
  },
  {
    key: "sunset",
    image: "sunset-boats",
    path: "/tours?collection=sunset",
    sizes: "(min-width: 768px) 42vw, 100vw",
    className: "md:col-span-5",
  },
  {
    key: "rentals",
    image: "riders-sunset",
    path: "/tours?category=rides",
    sizes: "100vw",
    className: "md:col-span-12",
  },
];

export function HowWeRide({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section id="routes" aria-labelledby="ride-title" className="bg-paper py-20 lg:py-28">
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
        <Reveal>
          <h2 id="ride-title" className="display max-w-3xl text-display-xl">
            {t.ride.title}
          </h2>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-label">{t.ride.intro}</p>
        </Reveal>
      </div>

      <Reveal className="mx-auto mt-12 max-w-[120rem] px-2 lg:mt-16">
        <ul className="grid gap-2 md:grid-cols-12 md:grid-rows-[17rem_17rem_19rem] lg:grid-rows-[19rem_19rem_21rem]">
          {sectors.map((sector) => {
            const copy = t.ride.sectors[sector.key];
            return (
              <li key={sector.key} className={cn("min-h-[20rem] md:min-h-0", sector.className)}>
                <Link href={localizedPath(locale, sector.path)} className="group relative block h-full min-h-[20rem] overflow-hidden bg-deep md:min-h-0">
                  <Photo
                    image={resolveMedia(sector.image, locale)}
                    sizes={sector.sizes}
                    className="absolute inset-0"
                    imageClassName="transition-transform duration-[400ms] ease-editorial group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 lg:p-8">
                    <div>
                      <h3 className="display text-display-md text-on-dark">{copy.title}</h3>
                      <p className="mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-on-dark/85">{copy.caption}</p>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-on-dark/40 text-on-dark transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
