import type { HistoryPageData } from "../utils/historyService";
import { HistoryFilterBar } from "./HistoryFilterBar";
import { HistoryList } from "./HistoryList";

type HistoryContentProps = HistoryPageData;

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

export function HistoryContent({
  histories,
  pagination,
  filters,
}: HistoryContentProps) {
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

      <HistoryList
        histories={histories}
        pagination={pagination}
        filters={filters}
      />
    </div>
  );
}
