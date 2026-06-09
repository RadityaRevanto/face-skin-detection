import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  className?: string;
};

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
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

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  className,
}: PaginationProps) {
  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-t border-gray-100 bg-white px-6 py-4 dark:bg-white sm:flex-row sm:items-center sm:justify-between sm:px-8",
        className
      )}
    >
      <p className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-medium text-gray-700">{firstItem}</span> to{" "}
        <span className="font-medium text-gray-700">{lastItem}</span> of{" "}
        <span className="font-medium text-gray-700">{totalItems}</span> users
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          className="h-9 w-9 rounded-lg border-gray-200 bg-white p-0 text-gray-500 disabled:opacity-40 dark:border-gray-200 dark:bg-white dark:text-gray-500"
        >
          <ChevronIcon direction="left" />
        </Button>

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
              <Button
                type="button"
                variant={page === currentPage ? "success" : "outline"}
                size="sm"
                className={cn(
                  "h-9 w-9 rounded-lg p-0",
                  page === currentPage
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "border-gray-200 bg-white text-gray-600 dark:border-gray-200 dark:bg-white dark:text-gray-600 dark:hover:bg-gray-50"
                )}
              >
                {page}
              </Button>
            </React.Fragment>
          );
        })}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          className="h-9 w-9 rounded-lg border-gray-200 bg-white p-0 text-gray-500 disabled:opacity-40 dark:border-gray-200 dark:bg-white dark:text-gray-500"
        >
          <ChevronIcon direction="right" />
        </Button>
      </nav>
    </div>
  );
}
