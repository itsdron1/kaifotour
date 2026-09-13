import { MapPin } from "@phosphor-icons/react/dist/ssr";
import { PlanTripForm } from "@/components/home/PlanTripForm";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

/** «Plan Your Bali Trip» (docs/editorial-style.md, раздел 5): сдвоенный заголовок с тенью, форма и булавка */
export function PlanYourTrip({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const { plan } = t;

  return (
    <section id="contact" aria-labelledby="plan-title" className="bg-sand py-20 text-ink lg:py-28">
      <div className="mx-auto grid max-w-page gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <Reveal className="lg:col-span-5">
          <MapPin size={48} weight="fill" aria-hidden="true" className="text-accent" />
          <h2 id="plan-title" className="relative mt-8 text-display-xl">
            <span
              aria-hidden="true"
              className="display pointer-events-none absolute inset-0 translate-x-[0.05em] translate-y-[0.09em] select-none text-ink/[0.12]"
            >
              {plan.title}
            </span>
            <span className="display relative block">{plan.title}</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/80">{plan.subtitle}</p>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.08}>
          <PlanTripForm
            locale={locale}
            labels={{
              name: plan.name,
              namePlaceholder: plan.namePlaceholder,
              dates: plan.dates,
              dateFrom: plan.dateFrom,
              dateTo: plan.dateTo,
              tourType: plan.tourType,
              tourTypes: plan.tourTypes,
              submit: plan.submit,
              helper: plan.helper,
              replyTime: plan.replyTime,
              errorName: plan.errorName,
              errorDates: plan.errorDates,
              datesRange: plan.datesRange,
              dateFromOnly: plan.dateFromOnly,
              dateToOnly: plan.dateToOnly,
              sent: plan.sent,
              openWhatsapp: plan.openWhatsapp,
              newTab: t.a11y.newTab,
              message: plan.message,
            }}
          />
        </Reveal>
      </div>
    </section>
  );
}
