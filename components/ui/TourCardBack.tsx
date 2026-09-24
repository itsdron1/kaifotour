import { ArrowRight, WhatsappLogo, X } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import type { TourCardData } from "@/lib/tour-view";

export interface TourCardBackLabels {
  book: string;
  details: string;
  newTab: string;
  close: string;
}

interface TourCardBackProps {
  card: TourCardData;
  labels: TourCardBackLabels;
  /** Сколько пунктов включений помещается на карточке этого размера */
  includes?: number;
  /** Крестик в углу: нужен там, где карточку переворачивают тапом */
  onClose?: () => void;
  className?: string;
}

/**
 * Оборот открытки: одинаковый вид в круге туров и в колоде hero.
 * Иконки берутся из клиентской сборки Phosphor, поэтому компонент используется внутри клиентских компонентов.
 */
export function TourCardBack({ card, labels, includes = 3, onClose, className }: TourCardBackProps) {
  return (
    <div className={cn("flex h-full flex-col border border-divider bg-paper p-2.5 text-left text-ink", className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="kicker text-[0.5625rem] text-secondary">{card.kicker}</p>
        {/* Латунный штамп с номером тура: декор в духе почтовой открытки */}
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center border border-accent font-condensed text-[0.625rem] font-semibold text-accent-ink"
        >
          {card.number}
        </span>
      </div>

      <p className="display mt-1 line-clamp-2 text-[0.9375rem] leading-tight">{card.title}</p>
      <p className="mt-1 truncate text-[0.8125rem] leading-snug text-label">{card.durationLabel}</p>
      <p className="font-condensed text-[0.875rem] font-semibold uppercase tracking-caps text-accent-ink">
        {card.priceLabel}
      </p>

      <ul className="mt-2 space-y-0.5 border-t border-dashed border-divider pt-2 text-[0.8125rem] leading-snug text-ink/85">
        {card.includes.slice(0, includes).map((item) => (
          <li key={item} className="line-clamp-1">
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-1 pt-2">
        {/* Кнопка живёт над растянутой ссылкой карточки, иначе тап по ней открыл бы страницу тура */}
        <a
          href={card.bookHref}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto relative z-10 flex items-center justify-center gap-1.5 bg-accent px-2 py-1.5 text-center font-condensed text-[0.8125rem] font-semibold uppercase leading-tight tracking-caps text-ink"
        >
          <WhatsappLogo size={14} aria-hidden="true" />
          {labels.book}
          <span className="sr-only">({labels.newTab})</span>
        </a>
        {/* Не ссылка: на страницу тура ведёт вся карточка, вложенные ссылки недопустимы */}
        <span className="flex items-center justify-center gap-1 font-condensed text-[0.8125rem] font-semibold uppercase tracking-caps text-ink">
          {labels.details}
          <ArrowRight size={12} aria-hidden="true" />
        </span>
      </div>

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center text-ink/60 transition-colors hover:text-ink"
        >
          <X size={12} aria-hidden="true" />
          <span className="sr-only">{labels.close}</span>
        </button>
      ) : null}
    </div>
  );
}
