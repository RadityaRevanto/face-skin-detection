import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Pagination shared — 2 mode:
 * 1. Link mode (server components): kirim `basePath` + `searchParams` — tombol
 *    dirender sebagai <a href="?page=N"> navigasi URL.
 * 2. Callback mode (client containers): kirim `onPageChange(page)` — tombol
 *    dirender sebagai <button onClick>.
 * Format meta mengikuti pagination Laravel backend (current_page, last_page,
 * per_page, total, from, to).
 */

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  /** Label item untuk teks ringkasan, default "data". */
  itemLabel?: string;
  /** Link mode: path halaman (mis. "/admin/users"). */
  basePath?: string;
  /** Link mode: searchParams aktif selain page, dipertahankan saat navigasi. */
  searchParams?: Record<string, string | undefined>;
  /** Callback mode: dipanggil dengan nomor halaman tujuan. */
  onPageChange?: (page: number) => void;
  className?: string;
};

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
}

export function buildPageUrl(
  basePath: string,
  page: number,
  searchParams?: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined && value !== "" && key !== "page") {
      params.set(key, value);
    }
  }
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={cn("h-4 w-4", direction === "right" && "rotate-180")}
    >
      <path
        d="m12 5-5 5 5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

type PageButtonProps = {
  page: number;
  disabled?: boolean;
  basePath?: string;
  searchParams?: Record<string, string | undefined>;
  onPageChange?: (page: number) => void;
  variant?: "outline" | "success";
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

function PageButton({
  page,
  disabled,
  basePath,
  searchParams,
  onPageChange,
  variant = "outline",
  className,
  children,
  ariaLabel,
}: PageButtonProps) {
  const isLinkMode = Boolean(basePath);

  if (isLinkMode && !disabled) {
    return (
      <Link
        href={buildPageUrl(basePath!, page, searchParams)}
        aria-label={ariaLabel}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-200 dark:bg-white dark:text-gray-600",
          variant === "success" && "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700",
          className
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onPageChange ? () => onPageChange(page) : undefined}
      className={cn(
        "h-9 w-9 rounded-lg p-0",
        variant === "success"
          ? "bg-emerald-600 text-white hover:bg-emerald-700"
          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-200 dark:bg-white dark:text-gray-600 dark:hover:bg-gray-50",
        disabled && "cursor-not-allowed opacity-40",
        className
      )}
    >
      {children}
    </Button>
  );
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  itemLabel = "data",
  basePath,
  searchParams,
  onPageChange,
  className,
}: PaginationProps) {
  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-gray-100 bg-white px-4 py-4 dark:bg-white sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8",
        className
      )}
    >
      {/* Mobile: ringkas "1/5" (§4.2) — info lengkap tampil sm+ */}
      <p className="text-xs text-gray-500 sm:text-sm">
        <span className="sm:hidden">
          Halaman{" "}
          <span className="font-semibold text-gray-700">{currentPage}</span>
          {" "}dari{" "}
          <span className="font-semibold text-gray-700">{totalPages}</span>
          {totalItems > 0 ? (
            <>
              {" "}·{" "}
              <span className="font-medium text-gray-700">{totalItems}</span>{" "}
              {itemLabel}
            </>
          ) : null}
        </span>
        <span className="hidden sm:inline">
          Menampilkan{" "}
          <span className="font-medium text-gray-700">{firstItem}</span>–
          <span className="font-medium text-gray-700">{lastItem}</span> dari{" "}
          <span className="font-medium text-gray-700">{totalItems}</span>{" "}
          {itemLabel}
        </span>
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-2">
        <PageButton
          page={currentPage - 1}
          disabled={currentPage === 1}
          basePath={basePath}
          searchParams={searchParams}
          onPageChange={onPageChange}
          ariaLabel="Halaman sebelumnya"
          className="text-gray-500"
        >
          <ChevronIcon direction="left" />
        </PageButton>

        {/* Mobile: hanya angka halaman aktif — daftar lengkap sm+ */}
        <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-emerald-600 px-2 text-sm font-semibold text-white sm:hidden">
          {currentPage}
        </span>

        <div className="hidden items-center gap-2 sm:flex">
          {visiblePages.map((page, index) => {
            const previousPage = visiblePages[index - 1];
            const showEllipsis = previousPage && page - previousPage > 1;

            return (
              <React.Fragment key={page}>
                {showEllipsis ? (
                  <span className="flex h-9 w-9 items-center justify-center text-sm text-gray-400">
                    ...
                  </span>
                ) : null}
                <PageButton
                  page={page}
                  basePath={basePath}
                  searchParams={searchParams}
                  onPageChange={onPageChange}
                  variant={page === currentPage ? "success" : "outline"}
                >
                  {page}
                </PageButton>
              </React.Fragment>
            );
          })}
        </div>

        <PageButton
          page={currentPage + 1}
          disabled={currentPage === totalPages}
          basePath={basePath}
          searchParams={searchParams}
          onPageChange={onPageChange}
          ariaLabel="Halaman berikutnya"
          className="text-gray-500"
        >
          <ChevronIcon direction="right" />
        </PageButton>
      </nav>
    </div>
  );
}
