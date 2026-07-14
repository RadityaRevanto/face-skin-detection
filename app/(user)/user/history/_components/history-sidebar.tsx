"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type { PredictionHistory } from "../_lib/history-types";
import {
  formatDate,
  getConfidencePercent,
  getHistoryImageUrl,
  getToneBySeverity,
} from "../_lib/history-utils";
import { CalendarIcon, ChevronDownIcon } from "./icons";

type HistorySidebarProps = {
  histories: PredictionHistory[];
  selectedHistoryId?: string;
};

type StatusFilter = "all" | "redness" | "wrinkles" | "dark spots" | "inflammatory acne" | "pores" | "non-inflammatory acne" | "pigmentation";
type SortOrder = "newest" | "oldest";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Semua Status" },
  { value: "redness", label: "Redness" },
  { value: "wrinkles", label: "Wrinkles" },
  { value: "dark spots", label: "Dark Spots" },
  { value: "inflammatory acne", label: "Inflammatory Acne" },
  { value: "pores", label: "Pores" },
  { value: "non-inflammatory acne", label: "Non-Inflammatory Acne" },
  { value: "pigmentation", label: "Pigmentation" },
];

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
];

const INITIAL_VISIBLE_HISTORIES = 4;
const LOAD_MORE_STEP = 4;

function useDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return { isOpen, setIsOpen, ref };
}

function getStatusForHistory(history: PredictionHistory): StatusFilter {
  const predictedClass = (history.predicted_class || "").toLowerCase();
  
  if (predictedClass.includes("non-inflammatory acne") || predictedClass.includes("non inflammatory acne")) return "non-inflammatory acne";
  if (predictedClass.includes("inflammatory acne")) return "inflammatory acne";
  if (predictedClass.includes("redness")) return "redness";
  if (predictedClass.includes("wrinkles")) return "wrinkles";
  if (predictedClass.includes("dark spots")) return "dark spots";
  if (predictedClass.includes("pores")) return "pores";
  if (predictedClass.includes("pigmentation")) return "pigmentation";

  return "all"; // Fallback if no exact match
}

export function HistorySidebar({
  histories,
  selectedHistoryId,
}: HistorySidebarProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const statusDropdown = useDropdown();
  const sortDropdown = useDropdown();

  const filteredAndSortedHistories = useMemo(() => {
    let result = [...histories];

    if (statusFilter !== "all") {
      result = result.filter((h) => getStatusForHistory(h) === statusFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [histories, statusFilter, sortOrder]);

  const selectedIndex = filteredAndSortedHistories.findIndex(
    (history) => history.id === selectedHistoryId,
  );
  const initialVisibleCount =
    selectedIndex >= INITIAL_VISIBLE_HISTORIES
      ? selectedIndex + 1
      : INITIAL_VISIBLE_HISTORIES;

  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  const visibleHistories = useMemo(
    () => filteredAndSortedHistories.slice(0, visibleCount),
    [filteredAndSortedHistories, visibleCount],
  );

  const hasMoreHistories = visibleCount < filteredAndSortedHistories.length;
  const shouldShowLoadButton =
    filteredAndSortedHistories.length > INITIAL_VISIBLE_HISTORIES;

  const currentStatusLabel =
    STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "Semua Status";
  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortOrder)?.label ?? "Terbaru";

  return (
    <aside className='h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
        Riwayat Pemeriksaan
      </h1>
      <p className='mt-2 text-sm font-medium text-slate-500'>
        Lihat hasil pemeriksaan kulit Anda sebelumnya.
      </p>

      <div className='mt-6 grid grid-cols-2 gap-3'>
        {/* Status Filter Dropdown */}
        <div className="relative" ref={statusDropdown.ref}>
          <button
            type="button"
            onClick={() => statusDropdown.setIsOpen(!statusDropdown.isOpen)}
            className='flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50'
          >
            <span className='flex items-center truncate'>{currentStatusLabel}</span>
            <span className={`grid h-4 w-4 shrink-0 place-items-center text-slate-400 transition-transform ${statusDropdown.isOpen ? "rotate-180" : ""}`}>
              <ChevronDownIcon />
            </span>
          </button>

          {statusDropdown.isOpen && (
            <div className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg shadow-slate-200/60">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setStatusFilter(option.value);
                    setVisibleCount(INITIAL_VISIBLE_HISTORIES);
                    statusDropdown.setIsOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                    statusFilter === option.value
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Order Dropdown */}
        <div className="relative" ref={sortDropdown.ref}>
          <button
            type="button"
            onClick={() => sortDropdown.setIsOpen(!sortDropdown.isOpen)}
            className='flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50'
          >
            <span className='inline-flex items-center gap-2 truncate'>
              <CalendarIcon />
              {currentSortLabel}
            </span>
            <span className={`grid h-4 w-4 shrink-0 place-items-center text-slate-400 transition-transform ${sortDropdown.isOpen ? "rotate-180" : ""}`}>
              <ChevronDownIcon />
            </span>
          </button>

          {sortDropdown.isOpen && (
            <div className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg shadow-slate-200/60">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSortOrder(option.value);
                    setVisibleCount(INITIAL_VISIBLE_HISTORIES);
                    sortDropdown.setIsOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                    sortOrder === option.value
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className='mt-5 space-y-4'>
        {filteredAndSortedHistories.length > 0 ? (
          visibleHistories.map((item) => {
            const itemTone = getToneBySeverity(
              item.severity_level,
              item.severity_score,
            );

            const isActive = item.id === selectedHistoryId;
            const confidencePercent = getConfidencePercent(item.confidence);
            const imageUrl = getHistoryImageUrl(item);

            return (
              <Link
                key={item.id}
                href={`/user/history?id=${item.id}`}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "group flex gap-4 rounded-2xl border bg-white p-4 transition-colors",
                  isActive
                    ? "border-emerald-300 ring-2 ring-emerald-100"
                    : "border-slate-100 hover:border-emerald-200",
                ].join(" ")}
              >
                <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100'>
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={`Foto pemeriksaan ${item.predicted_class}`}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center bg-linear-to-br from-amber-200 to-emerald-100 text-[10px] font-bold text-slate-500'>
                      No Image
                    </div>
                  )}
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-start justify-between gap-3'>
                    <p className='truncate text-xs font-semibold text-slate-500'>
                      {formatDate(item.created_at)}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${itemTone.badge}`}
                    >
                      {confidencePercent}%
                    </span>
                  </div>
                  <h2 className={`mt-2 font-bold ${itemTone.title}`}>
                    {item.predicted_class}
                  </h2>
                  <span className='mt-3 inline-block text-sm font-bold text-emerald-700 transition-colors group-hover:text-emerald-800'>
                    Lihat Detail ›
                  </span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-semibold leading-6 text-slate-500'>
            {statusFilter !== "all"
              ? "Tidak ada riwayat dengan status yang dipilih."
              : "Belum ada riwayat pemeriksaan. Silakan lakukan scan terlebih dahulu."}
          </div>
        )}
      </div>

      {shouldShowLoadButton ? (
        <button
          type='button'
          onClick={() =>
            setVisibleCount((currentCount) =>
              hasMoreHistories
                ? Math.min(currentCount + LOAD_MORE_STEP, filteredAndSortedHistories.length)
                : initialVisibleCount,
            )
          }
          className='mt-5 h-12 w-full rounded-2xl bg-slate-50 text-sm font-bold text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700'
        >
          {hasMoreHistories ? "Muat Lebih Banyak" : "Tampilkan Lebih Sedikit"}
          <span
            className={[
              "ml-2 inline-grid h-4 w-4 place-items-center align-middle transition-transform",
              hasMoreHistories ? "" : "rotate-180",
            ].join(" ")}
          >
            <ChevronDownIcon />
          </span>
        </button>
      ) : null}
    </aside>
  );
}
