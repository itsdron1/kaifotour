import { Clock, EnvelopeSimple, InstagramLogo, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/analytics/CookieSettingsButton";
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
      // тот же номер, но звонком: с телефона по нему можно сразу позвонить
      label: t.footer.phone,
      value: site.whatsapp.display,
      href: `tel:+${site.whatsapp.number}`,
      icon: <Phone size={20} aria-hidden="true" />,
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
    <footer data-placement="footer" className="border-t border-ink/15 bg-sand text-ink">
      <div className="mx-auto max-w-page px-5 pb-10 pt-16 sm:px-8 lg:px-12 lg:pt-20">
        <Link href={localizedPath(locale, "/")} prefetch={false} className="inline-flex items-center">
          <Image src="/brand/kaifo-logo.svg" alt="KAIFO" width={156} height={44} unoptimized className="h-11 w-[156px]" />
        </Link>
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
                    // почта и звонок открываются приложением, а не новой вкладкой
                    target={/^(mailto|tel):/.test(contact.href) ? undefined : "_blank"}
                    rel={/^(mailto|tel):/.test(contact.href) ? undefined : "noopener noreferrer"}
                    className="mt-1 inline-flex items-center gap-3 text-xl font-medium sm:text-2xl"
                  >
                    {contact.icon}
                    <span className="link-underline">{contact.value}</span>
                  </a>
                </li>
              ))}
              {/* Часы работы видны на странице и совпадают с разметкой компании в Google */}
              <li>
                <span className="kicker block text-[0.75rem] text-ink/70">{t.footer.hours}</span>
                <span className="mt-1 inline-flex items-center gap-3 text-xl font-medium sm:text-2xl">
                  <Clock size={20} aria-hidden="true" />
                  {t.footer.hoursValue}
                </span>
              </li>
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
                  <Link href={item.href} prefetch={false} className="link-underline text-lg">
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
                  <Link href={localizedPath(locale, `/legal/${doc}`)} prefetch={false} className="link-underline text-lg">
                    {t.legal.documents[doc]}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton label={t.consent.settings} className="link-underline text-left text-lg" />
              </li>
            </ul>
            <LanguageSwitch locale={locale} label={t.a11y.language} tone="light" className="-ml-1.5 mt-8" />
          </div>
        </div>

        <div className="mt-14 grid gap-4 border-t border-ink/15 pt-6 text-sm leading-relaxed text-ink/75 lg:grid-cols-12">
          <p className="max-w-3xl lg:col-span-8">{t.footer.disclaimer}</p>
          <p className="lg:col-span-4 lg:text-right">
            © {year} KAIFO. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
