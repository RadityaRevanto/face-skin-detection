import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Breadcrumb — pola shadcn/ui (compact untuk mobile, penuh untuk desktop).
 *
 * - Mobile: tampilkan 2 item terakhir (truncation otomatis).
 * - Desktop: tampilkan semua item.
 * - Separator: "/" dengan opacity rendah.
 */

export type BreadcrumbItem = {
  label: string;
  /** Bila null, item terakhir (tidak di-link). */
  href: string | null;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

function ChevronRight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-3 w-3 shrink-0 text-slate-400"
    >
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  // Mobile: tampilkan 2 item terakhir; desktop: semua.
  const mobileItems = items.length > 2 ? items.slice(-2) : items;

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      {/* Mobile — 2 item terakhir */}
      <ol className="flex items-center gap-1.5 text-sm lg:hidden">
        {mobileItems.map((item, i) => {
          const isLast = i === mobileItems.length - 1;
          const isPrevLast = i === mobileItems.length - 2 && mobileItems.length > 2;

          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 ? <ChevronRight /> : null}

              {/* Ellipsis sebelum item pertama mobile bila ada item tersembunyi */}
              {isPrevLast && items.length > 2 ? (
                <span className="text-slate-400">...</span>
              ) : null}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="truncate font-medium text-slate-500 transition-colors hover:text-slate-800"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "truncate font-semibold",
                    isLast ? "text-slate-800" : "text-slate-500",
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* Desktop — semua item */}
      <ol className="hidden items-center gap-1.5 text-sm lg:flex">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 ? <ChevronRight /> : null}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="truncate font-medium text-slate-500 transition-colors hover:text-slate-800"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "truncate font-semibold",
                    isLast ? "text-slate-800" : "text-slate-500",
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
