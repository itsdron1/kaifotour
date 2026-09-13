import { BeyondTheBooking } from "@/components/home/BeyondTheBooking";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { HowWeRide } from "@/components/home/HowWeRide";
import { PlanYourTrip } from "@/components/home/PlanYourTrip";
import { ToursWorthRiding } from "@/components/home/ToursWorthRiding";
import { PageShell } from "@/components/layout/PageShell";
import type { Locale } from "@/lib/i18n";

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale}>
      <div className="relative">
        {/* На широких и достаточно высоких экранах следующая секция «наплывает» на hero */}
        <div className="lg:[@media(min-height:720px)]:sticky lg:[@media(min-height:720px)]:top-0">
          <Hero locale={locale} />
        </div>
        <div className="relative">
          <HowWeRide locale={locale} />
        </div>
      </div>
      <ToursWorthRiding locale={locale} />
      <BeyondTheBooking locale={locale} />
      <Faq locale={locale} />
      <PlanYourTrip locale={locale} />
    </PageShell>
  );
}
