import Link from "next/link";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * SummaryCard (DESIGN.md §4.7) — pola Dasher "Project Budget".
 *
 * Kartu angka besar + baris meta label:value + 2 CTA berdampingan
 * (primary emerald-600 + secondary outline), w-full masing-masing.
 * Mobile: CTA berdampingan 2 kolom jika label pendek, stack jika panjang.
 */

type SummaryCardProps = {
  title: string;
  /** Nilai utama (angka besar text-2xl font-bold). */
  value: string;
  /** Baris meta label:value (mis. Total/Spent Skincek). */
  meta: { label: string; value: string }[];
  /** CTA primary — dirender sebagai Link emerald-600. */
  primaryAction?: { label: string; href: string };
  /** CTA secondary — outline. */
  secondaryAction?: { label: string; href: string };
  className?: string;
};

export function SummaryCard({
  title,
  value,
  meta,
  primaryAction,
  secondaryAction,
  className,
}: SummaryCardProps) {
  const hasBothActions = Boolean(primaryAction && secondaryAction);

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-2xl border-slate-100 bg-white text-slate-950 shadow-sm",
        className,
      )}
    >
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
        <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
          {title}
        </h3>
        <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          {value}
        </p>
      </div>

      {meta.length > 0 ? (
        <div className="space-y-2.5 border-b border-slate-100 px-4 py-4 sm:px-6">
          {meta.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">{row.label}</span>
              <span className="text-xs font-semibold text-slate-700">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {primaryAction || secondaryAction ? (
        <div
          className={cn(
            "grid gap-3 p-4 sm:p-6",
            hasBothActions && "grid-cols-2",
          )}
        >
          {primaryAction ? (
            <Link
              href={primaryAction.href}
              className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              {primaryAction.label}
            </Link>
          ) : null}

          {secondaryAction ? (
            <Link
              href={secondaryAction.href}
              className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              {secondaryAction.label}
            </Link>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
