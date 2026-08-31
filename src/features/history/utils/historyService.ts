import { fetchApi } from "@/lib/api/server-client";
import type { PredictionResult } from "@/lib/api/scans-query";
import type { PagePagination } from "@/lib/types/pagination";

import type { PredictionHistory } from "../types";

export type HistorySortOrder = "newest" | "oldest";
export type HistoryScanModeFilter = "all" | "upload" | "livecam";

export type HistoryFilters = {
  scanMode: HistoryScanModeFilter;
  predictedClass: string;
  sort: HistorySortOrder;
};

export const DEFAULT_HISTORY_FILTERS: HistoryFilters = {
  scanMode: "all",
  predictedClass: "",
  sort: "newest",
};

const HISTORY_PAGE_SIZE = 5;

function toPredictionHistory(scan: PredictionResult): PredictionHistory {
  return {
    ...scan,
    id: scan.uuid,
    confidence: Number(scan.confidence),
  };
}

function buildHistoryQuery(
  page: number,
  filters: HistoryFilters,
): string {
  const params = new URLSearchParams();
  params.set("per_page", String(HISTORY_PAGE_SIZE));
  params.set("page", String(page));
  params.set(
    "sort",
    filters.sort === "newest" ? "-created_at" : "created_at",
  );
  if (filters.scanMode !== "all") {
    params.set("filter[scan_mode]", filters.scanMode);
  }
  if (filters.predictedClass) {
    params.set("filter[predicted_class]", filters.predictedClass);
  }
  return params.toString();
}

export type HistoryPageData = {
  histories: PredictionHistory[];
  pagination: PagePagination;
  filters: HistoryFilters;
};

export async function getHistoryPageData({
  page = 1,
  filters = DEFAULT_HISTORY_FILTERS,
}: {
  page?: number;
  filters?: HistoryFilters;
} = {}): Promise<HistoryPageData> {
  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;

  const pagination: PagePagination = {
    currentPage: safePage,
    totalPages: 1,
    totalItems: 0,
    pageSize: HISTORY_PAGE_SIZE,
    basePath: "/history",
    itemLabel: "pemeriksaan",
  };

  try {
    const response = await fetchApi<PredictionResult[]>(
      `scans?${buildHistoryQuery(safePage, filters)}`,
    );

    return {
      histories: (response.data ?? []).map(toPredictionHistory),
      pagination: {
        ...pagination,
        totalPages: response.meta?.last_page ?? 1,
        totalItems: response.meta?.total ?? 0,
      },
      filters,
    };
  } catch (error) {
    console.error("Failed to fetch prediction histories from Laravel:", error);
    return { histories: [], pagination, filters };
  }
}

export async function getHistoryDetail(
  uuid: string,
): Promise<PredictionHistory | null> {
  try {
    const response = await fetchApi<PredictionResult>(`scans/${uuid}`);
    if (!response.data) return null;
    return toPredictionHistory(response.data);
  } catch (error) {
    console.error("Failed to fetch scan detail from Laravel:", error);
    return null;
  }
}

/** Scan terakhir untuk homepage — embedded recommendations ikut terbawa. */
export async function getLatestHistory(): Promise<PredictionHistory | null> {
  try {
    const response = await fetchApi<PredictionResult[]>(
      "scans?per_page=1&page=1&sort=-created_at",
    );
    const latest = response.data?.[0];
    return latest ? toPredictionHistory(latest) : null;
  } catch (error) {
    console.error("Failed to fetch latest scan from Laravel:", error);
    return null;
  }
}
