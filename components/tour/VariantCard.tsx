import { Check, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Photo } from "@/components/ui/Photo";
import { resolveMedia } from "@/data/media";
import type { TourVariant } from "@/data/tours";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { formatPriceFrom } from "@/lib/tour-view";
import { whatsappUrl } from "@/lib/whatsapp";

/** Дополнительный маршрут внутри тура (docs/new-tours-content.md, блок B) */
export function VariantCard({ variant, locale }: { variant: TourVariant; locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <article id={variant.id} className="grid scroll-mt-28 overflow-hidden bg-sand md:grid-cols-5">
      <Photo
        image={resolveMedia(variant.image, locale)}
        sizes="(min-width: 768px) 30vw, 100vw"
        className="aspect-[4/3] md:col-span-2 md:aspect-auto md:h-full"
      />
      <div className="p-6 sm:p-8 md:col-span-3">
        <h3 className="display text-[1.875rem] leading-[1.15]">{variant.title}</h3>
        {variant.durationLabel ? (
          <p className="kicker mt-3 text-[0.75rem] text-ink/75">{variant.durationLabel[locale]}</p>
        ) : null}
        <p className="mt-4 leading-relaxed text-ink/85">{variant.lead[locale]}</p>
        <ul className="mt-5 grid gap-x-6 gap-y-2 text-[0.9375rem] leading-snug sm:grid-cols-2">
          {variant.includes[locale].map((item) => (
            <li key={item} className="flex gap-2.5">
              <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-secondary" />
              {item}
            </li>
          ))}
        </ul>
        {variant.note ? (
          <p className="mt-5 border-l-2 border-secondary pl-4 text-[0.9375rem] leading-relaxed text-ink/85">
            {variant.note[locale]}
          </p>
        ) : null}
        <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-condensed text-2xl font-semibold uppercase tracking-caps text-accent-ink">
              {formatPriceFrom(variant.priceFromIDR, locale, false)}
            </p>
            <p className="mt-1 text-xs text-ink/75">{t.price.disclaimer}</p>
          </div>
          <ButtonLink
            href={whatsappUrl(variant.ctaWhatsappText[locale])}
            external
            newTabLabel={t.a11y.newTab}
            icon={<WhatsappLogo size={18} aria-hidden="true" />}
          >
            {t.cta.book}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
