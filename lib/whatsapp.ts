import { site } from "@/lib/site";

/** Ссылка на WhatsApp с предзаполненным текстом (docs/tz-main.md, раздел 5) */
export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${site.whatsapp.number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
