import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getDictionary } from "@/lib/dictionaries";
import { localizedPath, type Locale } from "@/lib/i18n";
import type { LegalDoc } from "@/lib/legal";
import { site } from "@/lib/site";

/** Страница-заглушка юридического документа: текст готовит заказчик */
export function LegalPage({ locale, doc }: { locale: Locale; doc: LegalDoc }) {
  const t = getDictionary(locale);
  const title = t.legal.documents[doc];

  return (
    <PageShell locale={locale} headerVariant="solid">
      <section aria-labelledby="legal-title" className="bg-paper pb-24 pt-32 lg:pb-32 lg:pt-40">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Breadcrumbs
            tone="light"
            label={t.a11y.breadcrumbs}
            items={[{ label: t.nav.home, href: localizedPath(locale, "/") }, { label: title }]}
          />
          <h1 id="legal-title" className="display mt-8 text-display-lg">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-label">{t.legal.pending}</p>
          <p className="mt-4 text-lg leading-relaxed">
            {t.legal.contact}{" "}
            <a href={`mailto:${site.email}`} className="link-underline font-medium text-secondary">
              {site.email}
            </a>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
