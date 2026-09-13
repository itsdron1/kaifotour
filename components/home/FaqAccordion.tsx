"use client";

import { Plus } from "@phosphor-icons/react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";

interface FaqAccordionProps {
  items: { q: string; a: string }[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <ul className="border-t border-on-dark/15">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-question-${index}`;
        const panelId = `${baseId}-answer-${index}`;

        return (
          <li key={item.q} className="border-b border-on-dark/15">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="group flex w-full items-start gap-5 py-6 text-left"
              >
                <span className="kicker mt-2 w-7 shrink-0 text-accent">{String(index + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-xl font-medium leading-snug text-on-dark sm:text-2xl">{item.q}</span>
                <Plus
                  size={22}
                  aria-hidden="true"
                  className={cn("mt-1 shrink-0 text-accent transition-transform duration-300 ease-editorial", isOpen && "rotate-45")}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-350 ease-editorial",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-prose pb-7 pl-12 text-lg leading-relaxed text-mist">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
