"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { PredictionHistory } from "../_lib/history-types";
import {
  formatDate,
  getConfidencePercent,
  getToneBySeverity,
} from "../_lib/history-utils";
import { CalendarIcon, ChevronDownIcon } from "./icons";

type HistorySidebarProps = {
  histories: PredictionHistory[];
  selectedHistoryId?: string;
};
  
const INITIAL_VISIBLE_HISTORIES = 4;
const LOAD_MORE_STEP = 4;

export function HistorySidebar({
  histories,
  selectedHistoryId,
}: HistorySidebarProps) {
  const selectedIndex = histories.findIndex(
    (history) => history.id === selectedHistoryId,
  );
  const initialVisibleCount =
    selectedIndex >= INITIAL_VISIBLE_HISTORIES
      ? selectedIndex + 1
      : INITIAL_VISIBLE_HISTORIES;

  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  const visibleHistories = useMemo(
    () => histories.slice(0, visibleCount),
    [histories, visibleCount],
  );

  const hasMoreHistories = visibleCount < histories.length;
  const shouldShowLoadButton = histories.length > INITIAL_VISIBLE_HISTORIES;

  return (
    <aside className='h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100'>
      <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
        Riwayat Pemeriksaan
      </h1>
      <p className='mt-2 text-sm font-medium text-slate-500'>
        Lihat hasil pemeriksaan kulit Anda sebelumnya.
      </p>

      <div className='mt-6 grid grid-cols-2 gap-3'>
        <button className='flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600'>
          <span className='flex items-center'>Semua Status</span>
          <span className='grid h-4 w-4 place-items-center text-slate-400'>
            <ChevronDownIcon />
          </span>
        </button>
        <button className='flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600'>
          <span className='inline-flex items-center gap-2'>
            <CalendarIcon />
            Terbaru
          </span>
          <span className='grid h-4 w-4 place-items-center text-slate-400'>
            <ChevronDownIcon />
          </span>
        </button>
      </div>

      <div className='mt-5 space-y-4'>
        {histories.length > 0 ? (
          visibleHistories.map((item) => {
            const itemTone = getToneBySeverity(
              item.severity_level,
              item.severity_score,
            );

            const isActive = item.id === selectedHistoryId;
            const confidencePercent = getConfidencePercent(item.confidence);

            return (
              <article
                key={item.id}
                className={[
                  "flex gap-4 rounded-2xl border bg-white p-4 transition-colors",
                  isActive
                    ? "border-emerald-300 ring-2 ring-emerald-100"
                    : "border-slate-100 hover:border-emerald-200",
                ].join(" ")}
              >
                <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-linear-to-br from-amber-200 to-emerald-100'>
                  <div className='absolute left-1/2 top-3 h-9 w-9 -translate-x-1/2 rounded-full bg-amber-100' />
                  <div className='absolute bottom-0 left-1/2 h-12 w-14 -translate-x-1/2 rounded-t-full bg-slate-900' />
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
                  <Link
                    href={`/user/history?id=${item.id}`}
                    className='mt-3 inline-block text-sm font-bold text-emerald-700'
                  >
                    Lihat Detail ›
                  </Link>
                </div>
              </article>
            );
          })
        ) : (
          <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-semibold leading-6 text-slate-500'>
            Belum ada riwayat pemeriksaan. Silakan lakukan scan terlebih dahulu.
          </div>
        )}
      </div>

      {shouldShowLoadButton ? (
        <button
          type='button'
          onClick={() =>
            setVisibleCount((currentCount) =>
              hasMoreHistories
                ? Math.min(currentCount + LOAD_MORE_STEP, histories.length)
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
