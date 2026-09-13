import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/ButtonLink";

interface MobileBookingBarProps {
  priceLabel: string;
  disclaimer: string;
  bookHref: string;
  bookLabel: string;
  newTabLabel: string;
}

/** Фиксированная панель брони на мобильных. Спейсер не даёт ей перекрыть низ футера. */
export function MobileBookingBar({ priceLabel, disclaimer, bookHref, bookLabel, newTabLabel }: MobileBookingBarProps) {
  return (
    <>
      <div aria-hidden="true" className="h-[4.75rem] bg-sand lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-on-dark/15 bg-deep px-5 py-3 text-on-dark sm:px-8 lg:hidden">
        <div className="mx-auto flex max-w-page items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate font-condensed text-lg font-semibold uppercase tracking-caps text-accent">{priceLabel}</p>
            <p className="truncate text-xs text-note">{disclaimer}</p>
          </div>
          <ButtonLink
            href={bookHref}
            external
            newTabLabel={newTabLabel}
            icon={<WhatsappLogo size={18} aria-hidden="true" />}
            className="shrink-0 px-5"
          >
            {bookLabel}
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
