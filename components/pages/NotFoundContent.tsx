import { PageShell } from "@/components/layout/PageShell";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getDictionary } from "@/lib/dictionaries";
import { localizedPath, type Locale } from "@/lib/i18n";

export function NotFoundContent({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <PageShell locale={locale} headerVariant="solid">
      <section aria-labelledby="not-found-title" className="flex min-h-[80svh] items-center bg-deep pb-20 pt-32 text-on-dark">
        <div className="mx-auto w-full max-w-page px-5 sm:px-8 lg:px-12">
          <p className="kicker text-accent">404</p>
          <h1 id="not-found-title" className="display mt-5 text-display-xl">
            {t.notFound.title}
          </h1>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-mist">{t.notFound.text}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href={localizedPath(locale, "/")}>{t.notFound.home}</ButtonLink>
            <ButtonLink href={localizedPath(locale, "/tours")} variant="outline-dark">
              {t.cta.exploreAll}
            </ButtonLink>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
