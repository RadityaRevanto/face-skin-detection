"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { HistoryClientContent } from "@/features/history/components/HistoryClientContent";
import type {
  HistoryFilters,
  HistoryScanModeFilter,
} from "@/features/history/types";

export default function HistoryPage() {
  return (
    <Suspense>
      <HistoryPageInner />
    </Suspense>
  );
}

function HistoryPageInner() {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const mode = searchParams.get("mode");
  const scanMode: HistoryScanModeFilter =
    mode === "upload" || mode === "livecam" ? mode : "all";

  const filters: HistoryFilters = {
    scanMode,
    predictedClass: searchParams.get("class") ?? "",
    sort: searchParams.get("sort") === "oldest" ? "oldest" : "newest",
  };

  return (
    <main className="w-full px-8 py-8 sm:px-10 lg:px-12">
      <HistoryClientContent page={page} filters={filters} />
    </main>
  );
}
