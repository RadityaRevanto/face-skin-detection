"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import type { HistoryFilters } from "../types";

type HistoryFilterBarProps = {
  filters: HistoryFilters;
  /** Opsi kelas prediksi yang diketahui (dari daftar tetap kelas ML). */
  predictedClassOptions: string[];
};

function buildFilterUrl(
  filters: HistoryFilters,
  patch: Partial<HistoryFilters>,
): string {
  const next = { ...filters, ...patch };
  const params = new URLSearchParams();
  if (next.scanMode !== "all") params.set("mode", next.scanMode);
  if (next.predictedClass) params.set("class", next.predictedClass);
  if (next.sort !== "newest") params.set("sort", next.sort);
  const query = params.toString();
  return query ? `/user/history?${query}` : "/user/history";
}

const SCAN_MODE_OPTIONS: { value: HistoryFilters["scanMode"]; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "upload", label: "Upload" },
  { value: "livecam", label: "Kamera" },
];

/**
 * Filter bar riwayat scan — 100% URL-state: perubahan filter langsung
 * navigate via router.push sehingga shareable & kompatibel server-render.
 * Query params: mode, class, sort.
 */
export function HistoryFilterBar({
  filters,
  predictedClassOptions,
}: HistoryFilterBarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (patch: Partial<HistoryFilters>) => {
    startTransition(() => router.push(buildFilterUrl(filters, patch)));
  };

  const selectClassName =
    "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-emerald-300 disabled:opacity-50";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {SCAN_MODE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            disabled={isPending}
            onClick={() => navigate({ scanMode: opt.value })}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
              filters.scanMode === opt.value
                ? "bg-emerald-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filters.predictedClass}
          disabled={isPending}
          onChange={(e) => navigate({ predictedClass: e.target.value })}
          className={selectClassName}
          aria-label="Filter kondisi kulit"
        >
          <option value="">Semua kondisi</option>
          {predictedClassOptions.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>

        <Link
          href={buildFilterUrl(filters, {
            sort: filters.sort === "newest" ? "oldest" : "newest",
          })}
          prefetch={false}
          onClick={(e) => {
            e.preventDefault();
            navigate({
              sort: filters.sort === "newest" ? "oldest" : "newest",
            });
          }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-emerald-300"
        >
          {filters.sort === "newest" ? "Terbaru ↓" : "Terlama ↑"}
        </Link>
      </div>
    </div>
  );
}
