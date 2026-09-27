import { cn } from "@/lib/utils";

/**
 * ErrorState — banner error standarisasi (DESIGN.md §4.8).
 * bg/token destructive, rounded-card p-8 text-center
 * + tombol retry (cta) opsional (via onRetry).
 */

type ErrorStateProps = {
  message: string;
  /** Render tombol retry bila handler tersedia. */
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

export function ErrorState({
  message,
  onRetry,
  retryLabel = "Coba Lagi",
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "w-full rounded-[var(--radius-card)] border border-[var(--destructive-fg)]/20 bg-[var(--destructive-bg)] p-8 text-center",
        className,
      )}
    >
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--destructive-fg)]/10 text-[var(--destructive-fg)]">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6"
        >
          <path
            d="M12 9v3.75m0 3.5h.007M10.3 3.9 2.4 17.5a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="mt-3 text-sm font-semibold text-[var(--destructive-fg)]">{message}</p>

      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex h-10 cursor-pointer items-center justify-center rounded-[var(--radius-control)] bg-[var(--cta)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--cta-hover)]"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
