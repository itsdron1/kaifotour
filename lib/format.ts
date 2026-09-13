import type { Locale } from "@/lib/i18n";

const NBSP = " ";

function groupDigits(value: number, separator: string): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/** 1600000 → "1 600 000 IDR" (ru) или "1,600,000 IDR" (en). Без Intl, чтобы сервер и браузер совпадали. */
export function formatIDR(value: number, locale: Locale): string {
  return `${groupDigits(value, locale === "ru" ? NBSP : ",")}${NBSP}IDR`;
}

function trimDecimals(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

/** 850000 → "850K IDR", 1250000 → "1.25M IDR" (формат из docs/tz-main.md) */
export function formatIDRCompact(value: number): string {
  if (value >= 1_000_000) return `${trimDecimals(value / 1_000_000)}M${NBSP}IDR`;
  if (value >= 1_000) return `${trimDecimals(value / 1_000)}K${NBSP}IDR`;
  return `${value}${NBSP}IDR`;
}

export type PluralForms = { one: string; few?: string; many?: string; other: string };

export function plural(locale: Locale, count: number, forms: PluralForms): string {
  const rule = new Intl.PluralRules(locale).select(count) as keyof PluralForms;
  return forms[rule] ?? forms.other;
}

/** Подставляет значения в шаблон строки словаря: fill("{n} туров", { n: 3 }) */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
