import Link from "next/link";
import { cn } from "@/lib/cn";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  label: string;
  tone?: "dark" | "light";
  className?: string;
}

export function Breadcrumbs({ items, label, tone = "dark", className }: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={className}>
      <ol className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-sm", tone === "dark" ? "text-mist" : "text-label")}>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link
                href={item.href}
                className={cn("link-underline transition-colors", tone === "dark" ? "hover:text-on-dark" : "hover:text-ink")}
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={tone === "dark" ? "text-on-dark" : "text-ink"}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
