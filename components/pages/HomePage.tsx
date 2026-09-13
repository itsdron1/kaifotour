import { BeyondTheBooking } from "@/components/home/BeyondTheBooking";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { HowWeRide } from "@/components/home/HowWeRide";
import { PlanYourTrip } from "@/components/home/PlanYourTrip";
import { ToursWorthRiding } from "@/components/home/ToursWorthRiding";
import { PageShell } from "@/components/layout/PageShell";
import { resolveMedia } from "@/data/media";
import { getDictionary } from "@/lib/dictionaries";
import { localizedPath, type Locale } from "@/lib/i18n";
import { jsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export function HomePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: site.name,
    url: `${site.url}${localizedPath(locale, "/")}`,
    description: t.meta.homeDescription,
    image: resolveMedia("hero", locale).src,
    telephone: site.whatsapp.display,
    email: site.email,
    sameAs: [site.instagram.url],
    areaServed: { "@type": "Place", name: "Bali, Indonesia" },
    availableLanguage: ["ru", "en"],
  };

  return (
    <PageShell locale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
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
