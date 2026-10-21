import { About } from "@/components/home/About";
import { BeyondTheBooking } from "@/components/home/BeyondTheBooking";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { HowWeRide } from "@/components/home/HowWeRide";
import { PlanYourTrip } from "@/components/home/PlanYourTrip";
import { Reviews } from "@/components/home/Reviews";
import { ToursWorthRiding } from "@/components/home/ToursWorthRiding";
import { PageShell } from "@/components/layout/PageShell";
import { resolveMedia } from "@/data/media";
import { getDictionary } from "@/lib/dictionaries";
import { localizedPath, locales, type Locale } from "@/lib/i18n";
import { showReviewsSection } from "@/lib/reviews";
import { jsonLd, organizationId, schemaLogo, schemaTelephone } from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * Главная. Разметка компании — TravelAgency. Часов работы в ней нет, пока заказчик их не прислал;
 * рейтинга и отзывов нет намеренно: Google не показывает звёзды по отзывам на сайте самой компании.
 */
export function HomePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [latitude, longitude] = site.googleMaps.destination.split(",").map(Number);
  const address = site.address[locale];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": organizationId,
    name: site.name,
    url: `${site.url}${localizedPath(locale, "/")}`,
    logo: schemaLogo,
    image: resolveMedia("hero", locale).src,
    description: t.meta.homeDescription,
    telephone: schemaTelephone,
    email: site.email,
    sameAs: [site.instagram.url],
    ...(Number.isFinite(latitude) && Number.isFinite(longitude)
      ? { geo: { "@type": "GeoCoordinates", latitude, longitude }, hasMap: site.googleMaps.placeUrl }
      : {}),
    ...(address ? { address: { "@type": "PostalAddress", streetAddress: address, addressCountry: "ID" } } : {}),
    areaServed: { "@type": "Place", name: "Bali, Indonesia" },
    availableLanguage: [...locales],
  };

  return (
    <PageShell locale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      {/* Hero сам прилипает к экрану, пока колода туров превращается из круга в дугу */}
      <Hero locale={locale} />
      <HowWeRide locale={locale} />
      <ToursWorthRiding locale={locale} />
      <About locale={locale} />
      <BeyondTheBooking locale={locale} />
      <Faq locale={locale} />
      {showReviewsSection ? <Reviews locale={locale} /> : null}
      <PlanYourTrip locale={locale} />
    </PageShell>
  );
}
