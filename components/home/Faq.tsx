import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/whatsapp";

/** FAQ: 8 вопросов из docs/tz-main.md, раздел 3.9 */
export function Faq({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-deep py-20 text-on-dark lg:py-28">
      <div className="mx-auto grid max-w-page gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 id="faq-title" className="display text-display-lg">
              {t.faq.title}
            </h2>
            <p className="mt-6 max-w-xs text-lg leading-relaxed text-mist">{t.faq.stillQuestions}</p>
            <ButtonLink
              href={whatsappUrl(t.whatsapp.question)}
              external
              newTabLabel={t.a11y.newTab}
              variant="outline-dark"
              icon={<WhatsappLogo size={18} aria-hidden="true" />}
              className="mt-7"
            >
              {t.cta.message}
            </ButtonLink>
          </div>
        </div>
        <div className="lg:col-span-8">
          <FaqAccordion items={t.faq.items} />
        </div>
      </div>
    </section>
  );
}
