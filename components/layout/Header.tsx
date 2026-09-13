"use client";

import { List, WhatsappLogo, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";
import type { NavItem } from "@/lib/nav";

export interface HeaderProps {
  locale: Locale;
  homeHref: string;
  navItems: NavItem[];
  whatsappHref: string;
  /** overlay: прозрачный поверх фото, тёмный после скролла. solid: всегда тёмный */
  variant?: "overlay" | "solid";
  labels: {
    home: string;
    mainNav: string;
    openMenu: string;
    closeMenu: string;
    language: string;
    message: string;
    newTab: string;
  };
}

function Wordmark() {
  return (
    <>
      <span className="font-display text-[1.375rem] font-semibold italic leading-none tracking-[0.02em]">KAIFOTOUR</span>
      <span className="kicker text-[0.6875rem] text-mist">BALI</span>
    </>
  );
}

export function Header({ locale, homeHref, navItems, whatsappHref, variant = "overlay", labels }: HeaderProps) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24));

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const solid = variant === "solid" || scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-header text-on-dark transition-colors duration-350 ease-editorial",
          solid ? "bg-deep" : "bg-transparent",
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-deep/70 to-transparent transition-opacity duration-350",
            solid ? "opacity-0" : "opacity-100",
          )}
        />
        <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-6 px-5 sm:px-8 lg:h-[72px] lg:px-12">
          <Link href={homeHref} aria-label={labels.home} className="flex items-baseline gap-2">
            <Wordmark />
          </Link>

          <nav aria-label={labels.mainNav} className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="kicker link-underline pb-1 text-mist transition-colors hover:text-on-dark">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3 lg:gap-5">
            <LanguageSwitch locale={locale} label={labels.language} className="hidden sm:flex" />
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="kicker hidden items-center gap-2 border border-steel/80 px-4 py-3 text-on-dark transition-colors duration-300 hover:border-accent hover:text-accent lg:inline-flex"
            >
              <WhatsappLogo size={16} aria-hidden="true" />
              WhatsApp
              <span className="sr-only">({labels.newTab})</span>
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-on-dark lg:hidden"
            >
              <List size={26} aria-hidden="true" />
              <span className="sr-only">{labels.openMenu}</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={labels.mainNav}
            className="fixed inset-0 z-menu flex flex-col bg-deep text-on-dark lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-16 items-center justify-between px-5 sm:px-8">
              <Link href={homeHref} onClick={() => setMenuOpen(false)} className="flex items-baseline gap-2">
                <Wordmark />
              </Link>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setMenuOpen(false)}
                className="-mr-2 inline-flex h-11 w-11 items-center justify-center"
              >
                <X size={26} aria-hidden="true" />
                <span className="sr-only">{labels.closeMenu}</span>
              </button>
            </div>

            <nav aria-label={labels.mainNav} className="flex flex-1 flex-col justify-center px-5 sm:px-8">
              <ul className="space-y-3">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="display block py-1 text-[2.75rem] leading-[1.15] text-on-dark"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-6 px-5 pb-10 sm:px-8">
              <ButtonLink
                href={whatsappHref}
                external
                newTabLabel={labels.newTab}
                icon={<WhatsappLogo size={18} aria-hidden="true" />}
                className="w-full"
              >
                {labels.message}
              </ButtonLink>
              <LanguageSwitch locale={locale} label={labels.language} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
