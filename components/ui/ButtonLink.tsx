import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "outline-dark" | "outline-light" | "dark";

const base =
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap px-6 py-3.5 font-condensed text-[0.9375rem] font-semibold uppercase leading-none tracking-caps transition-[background-color,border-color,color,filter,transform] duration-300 ease-editorial active:translate-y-px";

const variants: Record<ButtonVariant, string> = {
  /** Бронирование: латунная заливка (правило 4.3.3, не WhatsApp-зелёный) */
  primary: "bg-accent text-ink hover:brightness-110",
  /** Вторичная кнопка на тёмном фоне: контур #7E8E99 */
  "outline-dark": "border border-steel text-on-dark hover:border-on-dark",
  /** Вторичная кнопка на светлом фоне: контур #14545C */
  "outline-light": "border border-secondary text-secondary hover:bg-secondary hover:text-on-dark",
  /** «Написать нам» в футере: тёмная заливка, текст акцентом */
  dark: "bg-deep text-accent hover:bg-secondary",
};

/** Классы кнопки для <button>, где нельзя использовать ссылку */
export function buttonClassName(variant: ButtonVariant = "primary", className?: string): string {
  return cn(base, variants[variant], className);
}

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  /** Внешняя ссылка: откроется в новой вкладке */
  external?: boolean;
  /** Подпись для скринридера о новой вкладке */
  newTabLabel?: string;
  icon?: ReactNode;
  iconAfter?: ReactNode;
  className?: string;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
  newTabLabel,
  icon,
  iconAfter,
  className,
}: ButtonLinkProps) {
  const classes = buttonClassName(variant, className);
  const content = (
    <>
      {icon}
      <span>{children}</span>
      {iconAfter}
      {external && newTabLabel ? <span className="sr-only">({newTabLabel})</span> : null}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
