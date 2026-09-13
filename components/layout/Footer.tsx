import { EnvelopeSimple, InstagramLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getDictionary } from "@/lib/dictionaries";
import { localizedPath, type Locale } from "@/lib/i18n";
import { legalDocs } from "@/lib/legal";
import { mainNav } from "@/lib/nav";
import { site } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const year = new Date().getFullYear();
  const navItems = [
    ...mainNav(locale),
    { href: localizedPath(locale, "/#faq"), label: t.nav.faq },
    { href: localizedPath(locale, "/tours"), label: t.cta.exploreAll },
  ];

  const contacts = [
    {
      label: "WhatsApp",
      value: site.whatsapp.display,
      href: whatsappUrl(),
      icon: <WhatsappLogo size={20} aria-hidden="true" />,
    },
    {
      label: "Instagram",
      value: site.instagram.handle,
      href: site.instagram.url,
      icon: <InstagramLogo size={20} aria-hidden="true" />,
    },
    {
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
      icon: <EnvelopeSimple size={20} aria-hidden="true" />,
    },
  ];

  return (
    <footer className="border-t border-ink/15 bg-sand text-ink">
      <div className="mx-auto max-w-page px-5 pb-10 pt-16 sm:px-8 lg:px-12 lg:pt-20">
        <p className="font-condensed text-[clamp(3rem,1.6rem+6.4vw,8.75rem)] font-semibold uppercase leading-[0.88] tracking-[0.005em]">
          KAIFOTOUR BALI
        </p>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/80">{t.footer.tagline}</p>

        <div className="mt-14 grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="kicker text-ink/70">{t.footer.contactsTitle}</h2>
            <ul className="mt-6 space-y-5">
              {contacts.map((contact) => (
                <li key={contact.label}>
                  <span className="kicker block text-[0.75rem] text-ink/70">{contact.label}</span>
                  <a
                    href={contact.href}
                    target={contact.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={contact.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="mt-1 inline-flex items-center gap-3 text-xl font-medium sm:text-2xl"
                  >
                    {contact.icon}
                    <span className="link-underline">{contact.value}</span>
                  </a>
                </li>
              ))}
            </ul>
            <ButtonLink
              href={whatsappUrl()}
              external
              newTabLabel={t.a11y.newTab}
              variant="dark"
              icon={<WhatsappLogo size={18} aria-hidden="true" />}
              className="mt-8"
            >
              {t.cta.message}
            </ButtonLink>
          </div>

          <nav aria-label={t.a11y.footerNav} className="lg:col-span-3">
            <h2 className="kicker text-ink/70">{t.footer.navTitle}</h2>
            <ul className="mt-6 space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline text-lg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="kicker text-ink/70">{t.footer.legalTitle}</h2>
            <ul className="mt-6 space-y-3">
              {legalDocs.map((doc) => (
                <li key={doc}>
                  <Link href={localizedPath(locale, `/legal/${doc}`)} className="link-underline text-lg">
                    {t.legal.documents[doc]}
                  </Link>
                </li>
              ))}
            </ul>
            <LanguageSwitch locale={locale} label={t.a11y.language} tone="light" className="-ml-1.5 mt-8" />
          </div>
        </div>

        <div className="mt-14 grid gap-4 border-t border-ink/15 pt-6 text-sm leading-relaxed text-ink/75 lg:grid-cols-12">
          <p className="max-w-3xl lg:col-span-8">{t.footer.disclaimer}</p>
          <p className="lg:col-span-4 lg:text-right">
            © {year} KAIFOTOUR BALI. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
