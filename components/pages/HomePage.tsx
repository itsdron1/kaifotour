import { Hero } from "@/components/home/Hero";
import { PageShell } from "@/components/layout/PageShell";
import type { Locale } from "@/lib/i18n";

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <PageShell locale={locale}>
      <Hero locale={locale} />
    </PageShell>
  );
}
