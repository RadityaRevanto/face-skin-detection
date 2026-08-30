import type { Metadata } from "next";

import { HistoryContent } from "@/src/features/history/components/HistoryContent";
import {
  getHistoryPageData,
  type HistoryFilters,
  type HistoryScanModeFilter,
} from "@/src/features/history/utils/historyService";

export const metadata: Metadata = {
  title: "History",
  description: "Riwayat prediksi kondisi kulit Anda",
};

type HistoryPageProps = {
  searchParams?: Promise<{
    page?: string;
    mode?: string;
    class?: string;
    sort?: string;
  }>;
};

function resolveFilters(params: {
  mode?: string;
  class?: string;
  sort?: string;
}): HistoryFilters {
  const scanMode: HistoryScanModeFilter =
    params.mode === "upload" || params.mode === "livecam"
      ? params.mode
      : "all";

  return {
    scanMode,
    predictedClass: params.class ?? "",
    sort: params.sort === "oldest" ? "oldest" : "newest",
  };
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Math.max(1, Number(resolvedSearchParams?.page ?? "1") || 1);
  const filters = resolveFilters(resolvedSearchParams ?? {});

  const pageData = await getHistoryPageData({ page, filters });

  return <HistoryContent {...pageData} />;
}
