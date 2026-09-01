"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { scanService } from "@/features/scan/services/scanService";
import type { PagePagination } from "@/lib/types/pagination";

import type { PredictionHistory } from "../types";
import type { HistoryFilters } from "../types";
import { HistoryFilterBar } from "./HistoryFilterBar";
import { HistoryList } from "./HistoryList";

const HISTORY_PAGE_SIZE = 5;

/** 8 label ML yang diketahui backend — opsi filter kondisi. */
const PREDICTED_CLASS_OPTIONS = [
  "Redness",
  "dark spots",
  "inflammatory acne",
  "non inflammatory acne black heads",
  "non inflammatory acne white heads",
  "pigmentation",
  "pores",
  "wrinkles",
];

type HistoryClientContentProps = {
  page: number;
  filters: HistoryFilters;
};

export function HistoryClientContent({ page, filters }: HistoryClientContentProps) {
  const queryParams = useMemo(
    () => ({
      page,
      per_page: HISTORY_PAGE_SIZE,
      sort: filters.sort === "newest" ? "-created_at" : "created_at",
      ...(filters.scanMode !== "all"
        ? { "filter[scan_mode]": filters.scanMode }
        : {}),
      ...(filters.predictedClass
        ? { "filter[predicted_class]": filters.predictedClass }
        : {}),
    }),
    [page, filters],
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["scans", queryParams],
    queryFn: () => scanService.list(queryParams),
    placeholderData: keepPreviousData,
  });

  const histories: PredictionHistory[] = (data?.data ?? []).map((scan) => ({
    ...scan,
    id: scan.uuid,
    confidence: Number(scan.confidence),
    severity_score: scan.severity_score ?? null,
    model_used: scan.model_used ?? null,
  }));

  const pagination: PagePagination = {
    currentPage: page,
    totalPages: data?.meta?.last_page ?? 1,
    totalItems: data?.meta?.total ?? 0,
    pageSize: HISTORY_PAGE_SIZE,
    basePath: "/user/history",
    itemLabel: "pemeriksaan",
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Riwayat Pemeriksaan
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Pantau hasil scan dan perkembangan kondisi kulitmu.
        </p>
      </div>

      <HistoryFilterBar
        filters={filters}
        predictedClassOptions={PREDICTED_CLASS_OPTIONS}
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center text-sm text-rose-600">
          Gagal memuat riwayat pemeriksaan. Coba muat ulang halaman.
        </div>
      ) : (
        <HistoryList histories={histories} pagination={pagination} filters={filters} />
      )}
    </div>
  );
}
