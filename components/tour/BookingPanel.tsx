import { EnvelopeSimple, InstagramLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { Tour } from "@/data/tours";
import { getDictionary } from "@/lib/dictionaries";
import { formatIDR } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { formatPriceFrom } from "@/lib/tour-view";

interface BookingPanelProps {
  locale: Locale;
  tour: Tour;
  bookHref: string;
}

export function BookingPanel({ locale, tour, bookHref }: BookingPanelProps) {
  const t = getDictionary(locale);
  const range =
    tour.priceFromIDR !== null && tour.priceToIDR
      ? `${formatIDR(tour.priceFromIDR, locale)} - ${formatIDR(tour.priceToIDR, locale)}`
      : null;

  return (
    <div className="bg-deep p-7 text-on-dark sm:p-9">
      <p className="kicker text-[0.75rem] text-mist">{t.tour.price}</p>
      <p className="mt-3 font-condensed text-[2.125rem] font-semibold uppercase leading-none tracking-caps text-accent">
        {formatPriceFrom(tour.priceFromIDR, locale, false)}
      </p>
      {range ? <p className="mt-3 text-mist">{range}</p> : null}
      <p className="mt-3 text-sm text-note">{t.price.disclaimer}</p>

      <div className="mt-8 grid gap-3">
        <ButtonLink
          href={bookHref}
          external
          newTabLabel={t.a11y.newTab}
          icon={<WhatsappLogo size={18} aria-hidden="true" />}
          className="w-full"
        >
          {t.cta.book}
        </ButtonLink>
        <ButtonLink
          href={site.instagram.url}
          external
          newTabLabel={t.a11y.newTab}
          variant="outline-dark"
          icon={<InstagramLogo size={18} aria-hidden="true" />}
          className="w-full"
        >
          {t.cta.instagram}
        </ButtonLink>
      </div>

      <a
        href={`mailto:${site.email}`}
        className="mt-6 inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-on-dark"
      >
        <EnvelopeSimple size={16} aria-hidden="true" />
        <span className="link-underline">{site.email}</span>
      </a>
    </div>
  );
}
