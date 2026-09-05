import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * TableWidget (DESIGN.md §4.2) — pola Dasher "Active Projects".
 *
 * Shell presentational slot-based: konten tabel & card list dirender
 * oleh halaman (logic data tidak berpindah ke widget ini).
 * - Desktop (md+): tabel asli via slot `table` (hidden md:block + overflow-x-auto).
 * - Mobile (<md): card list via slot `cards` (md:hidden) — bukan scroll horizontal
 *   (keputusan eksplisit §4.2).
 * - Header: judul + deskripsi + count chip opsional + link "View all" kanan.
 * - Footer: slot `footer` (Pagination).
 */

type TableWidgetProps = {
  title?: string;
  description?: string;
  /** Chip jumlah (mis. "24 user") di samping judul. */
  countChip?: ReactNode;
  /** Link "View all" kanan header. */
  viewAllHref?: string;
  viewAllLabel?: string;
  /** Slot tabel desktop — dirender dalam Card + overflow wrapper. */
  table: ReactNode;
  /** Slot card list mobile. */
  cards?: ReactNode;
  /** Footer (Pagination). */
  footer?: ReactNode;
  /** Konten saat list kosong (EmptyState). */
  empty?: ReactNode;
  /** Pakai bila slot cards/empty perlu dirender dalam Card mobile. */
  className?: string;
};

export function TableWidget({
  title,
  description,
  countChip,
  viewAllHref,
  viewAllLabel = "View all",
  table,
  cards,
  footer,
  empty,
  className,
}: TableWidgetProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-2xl border-slate-100 bg-white text-slate-950 shadow-sm",
        className,
      )}
    >
      {title ? (
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                {title}
              </h2>
              {countChip ? (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                  {countChip}
                </span>
              ) : null}
            </div>
            {description ? (
              <p className="mt-0.5 text-xs text-slate-500">{description}</p>
            ) : null}
          </div>

          {viewAllHref ? (
            <a
              href={viewAllHref}
              className="shrink-0 text-xs font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
            >
              {viewAllLabel}
            </a>
          ) : null}
        </div>
      ) : null}

      {/* Desktop table (md+) */}
      <div className="hidden overflow-x-auto md:block">{table}</div>

      {/* Mobile card list (<md) */}
      {cards ? <div className="md:hidden">{cards}</div> : null}

      {/* Empty state di luar slot (halaman yang mengirim list kosong) */}
      {empty ? (
        <div className="px-4 py-8 sm:px-6 lg:px-8">{empty}</div>
      ) : null}

      {footer ? <div className="border-t border-slate-100">{footer}</div> : null}
    </Card>
  );
}
