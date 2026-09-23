"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { cn } from "@/lib/cn";
import { localeCookie, localeCookieMaxAge, locales, switchLocalePath, type Locale } from "@/lib/i18n";

interface LanguageSwitchProps {
  locale: Locale;
  label: string;
  /** dark: на тёмном фоне (активный язык акцентом), light: на песочном фоне */
  tone?: "dark" | "light";
  className?: string;
}

/** Выбор языка помнится год: middleware читает эту cookie и отдаёт корень на выбранном языке */
function rememberLocale(code: Locale) {
  document.cookie = `${localeCookie}=${code}; path=/; max-age=${localeCookieMaxAge}; samesite=lax`;
}

export function LanguageSwitch({ locale, label, tone = "dark", className }: LanguageSwitchProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className={cn("flex items-center gap-1", className)}>
      {locales.map((code, index) => {
        const active = code === locale;
        return (
          <Fragment key={code}>
            {index > 0 ? (
              <span aria-hidden="true" className={tone === "dark" ? "text-steel" : "text-ink/40"}>
                /
              </span>
            ) : null}
            <Link
              href={switchLocalePath(pathname, code)}
              hrefLang={code}
              lang={code}
              prefetch={false}
              onClick={() => rememberLocale(code)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "kicker px-1.5 py-2 transition-colors duration-300",
                tone === "dark" && (active ? "text-accent" : "text-mist hover:text-on-dark"),
                tone === "light" && (active ? "text-accent-ink underline underline-offset-4" : "text-ink/70 hover:text-ink"),
              )}
            >
              {code.toUpperCase()}
            </Link>
          </Fragment>
        );
      })}
    </nav>
  );
}
