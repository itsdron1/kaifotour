"use client";

import { CaretDown, WarningCircle, WhatsappLogo } from "@phosphor-icons/react";
import { useId, useRef, useState, type FormEvent } from "react";
import { buttonClassName } from "@/components/ui/ButtonLink";
import { cn } from "@/lib/cn";
import { fill } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/whatsapp";

const TOUR_TYPES = ["ocean", "offroad", "sunset", "dayTours", "rides", "unsure"] as const;
type TourType = (typeof TOUR_TYPES)[number];

export interface PlanTripFormLabels {
  name: string;
  namePlaceholder: string;
  dates: string;
  dateFrom: string;
  dateTo: string;
  tourType: string;
  tourTypes: Record<TourType, string>;
  submit: string;
  helper: string;
  replyTime: string;
  errorName: string;
  errorDates: string;
  datesRange: string;
  dateFromOnly: string;
  dateToOnly: string;
  sent: string;
  openWhatsapp: string;
  newTab: string;
  message: { greeting: string; dates: string; type: string };
}

interface PlanTripFormProps {
  locale: Locale;
  labels: PlanTripFormLabels;
}

const fieldClass =
  "w-full border border-steel bg-paper px-4 py-3.5 text-lg text-ink transition-colors duration-300 placeholder:text-label hover:border-ink focus:border-secondary aria-[invalid=true]:border-accent-ink";

function isTourType(value: string): value is TourType {
  return (TOUR_TYPES as readonly string[]).includes(value);
}

function formatDate(value: string, locale: Locale): string {
  const [year, month, day] = value.split("-").map(Number);
  // Год добавляется вручную: ru-RU с year: "numeric" дописывает «г.», и в сообщении появлялось «г..»
  const dayMonth = new Date(year, month - 1, day).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-GB", {
    day: "numeric",
    month: "long",
  });
  return `${dayMonth} ${year}`;
}

/**
 * Форма «Plan Your Bali Trip» без бэкенда: на submit собирает текст из полей
 * и открывает https://wa.me/6285190101270?text=... в новой вкладке.
 */
export function PlanTripForm({ locale, labels }: PlanTripFormProps) {
  const id = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{ name?: string; dates?: string }>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("from") ?? "");
    const to = String(data.get("to") ?? "");
    const rawType = String(data.get("tourType") ?? "");
    const type: TourType = isTourType(rawType) ? rawType : "unsure";

    const nextErrors: { name?: string; dates?: string } = {};
    if (!name) nextErrors.name = labels.errorName;
    if (from && to && to < from) nextErrors.dates = labels.errorDates;
    setErrors(nextErrors);

    if (nextErrors.name) {
      nameRef.current?.focus();
      return;
    }
    if (nextErrors.dates) {
      toRef.current?.focus();
      return;
    }

    const lines = [fill(labels.message.greeting, { name })];
    let dates = "";
    if (from && to) dates = fill(labels.datesRange, { from: formatDate(from, locale), to: formatDate(to, locale) });
    else if (from) dates = fill(labels.dateFromOnly, { from: formatDate(from, locale) });
    else if (to) dates = fill(labels.dateToOnly, { to: formatDate(to, locale) });
    if (dates) lines.push(fill(labels.message.dates, { dates }));
    lines.push(fill(labels.message.type, { type: labels.tourTypes[type] }));

    const url = whatsappUrl(lines.join("\n"));
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="bg-paper p-6 shadow-postcard sm:p-10">
      <div className="grid gap-7">
        <div className="grid gap-2">
          <label htmlFor={`${id}-name`} className="kicker text-label">
            {labels.name}
          </label>
          <input
            ref={nameRef}
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={labels.namePlaceholder}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            className={fieldClass}
          />
          {errors.name ? (
            <p id={`${id}-name-error`} className="flex items-center gap-2 text-sm font-medium text-accent-ink">
              <WarningCircle size={16} aria-hidden="true" />
              {errors.name}
            </p>
          ) : null}
        </div>

        <fieldset className="grid gap-2">
          <legend className="kicker mb-2 text-label">{labels.dates}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <label htmlFor={`${id}-from`} className="text-sm text-label">
                {labels.dateFrom}
              </label>
              <input id={`${id}-from`} name="from" type="date" className={cn(fieldClass, "[color-scheme:light]")} />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor={`${id}-to`} className="text-sm text-label">
                {labels.dateTo}
              </label>
              <input
                ref={toRef}
                id={`${id}-to`}
                name="to"
                type="date"
                aria-invalid={errors.dates ? true : undefined}
                aria-describedby={errors.dates ? `${id}-dates-error` : undefined}
                className={cn(fieldClass, "[color-scheme:light]")}
              />
            </div>
          </div>
          {errors.dates ? (
            <p id={`${id}-dates-error`} className="flex items-center gap-2 text-sm font-medium text-accent-ink">
              <WarningCircle size={16} aria-hidden="true" />
              {errors.dates}
            </p>
          ) : null}
        </fieldset>

        <div className="grid gap-2">
          <label htmlFor={`${id}-type`} className="kicker text-label">
            {labels.tourType}
          </label>
          <div className="relative">
            <select id={`${id}-type`} name="tourType" defaultValue="unsure" className={cn(fieldClass, "appearance-none pr-12")}>
              {TOUR_TYPES.map((type) => (
                <option key={type} value={type}>
                  {labels.tourTypes[type]}
                </option>
              ))}
            </select>
            <CaretDown
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink"
            />
          </div>
        </div>

        <div className="grid gap-4 pt-1">
          <button type="submit" className={buttonClassName("primary", "w-full sm:w-auto sm:justify-self-start")}>
            <WhatsappLogo size={18} aria-hidden="true" />
            <span>{labels.submit}</span>
          </button>
          <p className="text-sm leading-relaxed text-label">
            {labels.helper} {labels.replyTime}.
          </p>
          <p aria-live="polite" className="text-sm leading-relaxed text-ink">
            {sentUrl ? (
              <>
                {labels.sent}{" "}
                <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="link-underline font-medium text-secondary">
                  {labels.openWhatsapp}
                  <span className="sr-only"> ({labels.newTab})</span>
                </a>
              </>
            ) : null}
          </p>
        </div>
      </div>
    </form>
  );
}
