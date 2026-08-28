"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";

import type { PredictionHistory } from "../types";
import {
  formatDate,
  getConfidencePercent,
  getHistoryImageUrl,
  getToneBySeverity,
} from "../utils/historyHelpers";
import { getConcernDisplayName } from "@/lib/utils/skin-labels";

type HistoryListProps = {
  histories: PredictionHistory[];
  selectedHistoryId?: string;
};

type SortOrder = "newest" | "oldest";

function useClickOutside(ref: React.RefObject<HTMLDivElement | null>, handler: () => void) {
  useEffect(() => {
    function listener(event: MouseEvent) {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    }
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

export function HistoryList({ histories, selectedHistoryId }: HistoryListProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  useClickOutside(sortRef, () => setSortOpen(false));

  const sorted = useMemo(() => {
    return [...histories].sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });
  }, [histories, sortOrder]);

  return (
    <div className="space-y-4">
      {/* Header + sort */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Riwayat Pemeriksaan</h2>
          <p className="text-sm text-slate-500">{sorted.length} pemeriksaan</p>
        </div>

        <div className="relative" ref={sortRef}>
          <button
            type="button"
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M3 6h18M6 12h12M9 18h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            {sortOrder === "newest" ? "Terbaru" : "Terlama"}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className={`h-3 w-3 text-slate-400 transition-transform ${sortOpen ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full z-20 mt-2 w-40 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
              {(
                [
                  { value: "newest", label: "Terbaru" },
                  { value: "oldest", label: "Terlama" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSortOrder(opt.value);
                    setSortOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                    sortOrder === opt.value
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card list */}
      <div className="space-y-3">
        {sorted.length > 0 ? (
          sorted.map((item) => {
            const isActive = item.id === selectedHistoryId;
            const confidencePercent = getConfidencePercent(item.confidence);
            const imageUrl = getHistoryImageUrl(item);
            const tone = getToneBySeverity(item.severity_level, item.severity_score);
            const label = getConcernDisplayName(item.skin_concern?.name, item.predicted_class);

            return (
              <Link
                key={item.id}
                href={`/history?id=${item.id}`}
                aria-current={isActive ? "page" : undefined}
                className={`group flex gap-4 rounded-2xl border bg-white p-4 transition-all ${
                  isActive
                    ? "border-emerald-300 ring-2 ring-emerald-100 shadow-sm"
                    : "border-slate-100 hover:border-emerald-200 hover:shadow-sm"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={label}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-cyan-50 text-[10px] font-bold text-slate-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-slate-400">
                      {formatDate(item.created_at)}
                    </p>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${tone.badge}`}>
                      {tone.status}
                    </span>
                  </div>

                  <h3 className="mt-1.5 truncate text-sm font-bold text-slate-900">
                    {label}
                  </h3>

                  <div className="mt-2 flex items-center gap-3">
                    {/* Confidence bar */}
                    <div className="flex flex-1 items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${confidencePercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{confidencePercent}%</span>
                    </div>

                    {/* Scan mode badge */}
                    <span className="flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                      {item.scan_mode === "livecam" ? (
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-3 w-3">
                          <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <rect x="3" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      ) : (
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-3 w-3">
                          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      )}
                      {item.scan_mode === "livecam" ? "Kamera" : "Upload"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-sm font-semibold text-slate-500">Belum ada riwayat pemeriksaan.</p>
            <p className="mt-1 text-xs text-slate-400">Lakukan scan terlebih dahulu.</p>
          </div>
        )}
      </div>
    </div>
  );
}
