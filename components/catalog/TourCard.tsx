import { ArrowRight, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Photo } from "@/components/ui/Photo";
import type { TourCardData } from "@/lib/tour-view";

export interface TourCardLabels {
  book: string;
  details: string;
  disclaimer: string;
  newTab: string;
}

interface TourCardProps {
  card: TourCardData;
  labels: TourCardLabels;
  headingLevel?: "h2" | "h3";
}

/** Карточка тура (docs/tz-main.md, разделы 3.4 и 4.5): фото, кикер, включения, цена «от» и бронь */
export function TourCard({ card, labels, headingLevel = "h3" }: TourCardProps) {
  const Heading = headingLevel;

  return (
    <article className="group relative flex h-full flex-col">
      <Link href={card.href} tabIndex={-1} aria-hidden="true" className="block overflow-hidden">
        <Photo
          image={card.image}
          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="aspect-[4/3] w-full"
          imageClassName="transition-transform duration-[400ms] ease-editorial group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex flex-wrap items-center gap-3">
          <p className="kicker text-[0.75rem] text-accent-ink">{card.kicker}</p>
          {card.badgeLabel ? (
            <span className="kicker border border-secondary px-1.5 py-1 text-[0.625rem] text-secondary">{card.badgeLabel}</span>
          ) : null}
        </div>

        <Heading className="display mt-2.5 text-[1.875rem] leading-[1.15] text-ink">
          {/* Растянутая ссылка: её ::after накрывает карточку целиком */}
          <Link
            href={card.href}
            className="transition-colors duration-300 after:absolute after:inset-0 after:content-[''] hover:text-secondary"
          >
            {card.title}
          </Link>
        </Heading>

        <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-label">{card.lead}</p>

        <ul className="mt-5 grid border-t border-divider text-sm leading-snug text-ink/85 sm:grid-cols-2 sm:gap-x-5">
          {card.includes.map((item) => (
            <li key={item} className="border-b border-divider py-2.5">
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-condensed text-xl font-semibold uppercase tracking-caps text-accent-ink">{card.priceLabel}</p>
              <p className="mt-1 text-xs text-label">{labels.disclaimer}</p>
            </div>
            <p className="text-right text-sm text-label">{card.durationLabel}</p>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            <ButtonLink
              href={card.bookHref}
              external
              newTabLabel={labels.newTab}
              icon={<WhatsappLogo size={18} aria-hidden="true" />}
              className="relative z-10"
            >
              {labels.book}
            </ButtonLink>
            <Link href={card.href} className="kicker relative z-10 inline-flex items-center gap-2 py-3 text-ink">
              <span className="link-underline">{labels.details}</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
