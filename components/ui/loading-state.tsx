import { cn } from "@/lib/utils";

/**
 * LoadingState — skeleton standarisasi (DESIGN.md §4.8).
 * Varian sesuai bentuk konten:
 * - rows      : 5 baris tabel (h-14)
 * - stat-grid : 4 kartu stat (h-28)
 * - detail    : judul + kartu besar (h-64)
 */

type LoadingStateVariant = "rows" | "stat-grid" | "detail";

type LoadingStateProps = {
  variant: LoadingStateVariant;
  className?: string;
};

export function LoadingState({ variant, className }: LoadingStateProps) {
  if (variant === "stat-grid") {
    return (
      <div className={cn("grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4", className)}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className={cn("w-full space-y-4", className)}>
        <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  // variant === "rows"
  return (
    <div className={cn("w-full overflow-hidden rounded-2xl border border-slate-100 bg-white", className)}>
      <div className="space-y-0">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={cn(
              "h-14 animate-pulse bg-slate-100/80",
              i === 1 && "rounded-t-none",
            )}
          />
        ))}
      </div>
    </div>
  );
}
