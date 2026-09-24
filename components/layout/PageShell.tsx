import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { getDictionary } from "@/lib/dictionaries";
import { localizedPath, type Locale } from "@/lib/i18n";
import { mainNav } from "@/lib/nav";
import { whatsappUrl } from "@/lib/whatsapp";

interface PageShellProps {
  locale: Locale;
  children: ReactNode;
  headerVariant?: "overlay" | "solid";
  /** Элементы после футера, например фиксированная панель брони на мобильных */
  after?: ReactNode;
}

export function PageShell({ locale, children, headerVariant = "overlay", after }: PageShellProps) {
  const t = getDictionary(locale);

  return (
    <>
      <ScrollToTop />
      <a
        href="#main"
        className="kicker sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-menu focus:bg-accent focus:px-5 focus:py-3 focus:text-ink"
      >
        {t.a11y.skip}
      </a>
      <Header
        locale={locale}
        homeHref={localizedPath(locale, "/")}
        navItems={mainNav(locale)}
        whatsappHref={whatsappUrl(t.whatsapp.general)}
        variant={headerVariant}
        labels={{
          home: `KAIFO, ${t.nav.home}`,
          mainNav: t.a11y.mainNav,
          openMenu: t.a11y.openMenu,
          closeMenu: t.a11y.closeMenu,
          language: t.a11y.language,
          message: t.cta.message,
          newTab: t.a11y.newTab,
        }}
      />
      <main id="main">{children}</main>
      <Footer locale={locale} />
      {after}
    </>
  );
}
