import Link from "next/link";

import { Pagination } from "@/components/ui/pagination";
import type { PagePagination } from "@/lib/types/pagination";

import type { PredictionHistory } from "../types";
import type { HistoryFilters } from "../types";
import { HistoryRecommendationChips } from "./HistoryRecommendationChips";
import {
  formatDate,
  getConfidencePercent,
  getHistoryImageUrl,
  getToneBySeverity,
} from "../utils/historyHelpers";
import { getConcernDisplayName } from "@/lib/utils/skin-labels";

type HistoryListProps = {
  histories: PredictionHistory[];
  pagination: PagePagination;
  filters: HistoryFilters;
};

/** searchParams aktif (tanpa page) — diteruskan ke tombol pagination. */
function toSearchParams(filters: HistoryFilters) {
  return {
    mode: filters.scanMode !== "all" ? filters.scanMode : undefined,
    class: filters.predictedClass || undefined,
    sort: filters.sort !== "newest" ? filters.sort : undefined,
  };
}

/**
 * Daftar kartu riwayat scan. Setiap kartu menuju halaman detail
 * /user/history/detail?id=<uuid> (static route), urutan & halaman dikendalikan URL.
 */
export function HistoryList({ histories, pagination, filters }: HistoryListProps) {
  return (
    <div className="space-y-5">
      {histories.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {histories.map((item) => {
            const confidencePercent = getConfidencePercent(item.confidence);
            const imageUrl = getHistoryImageUrl(item);
            const tone = getToneBySeverity(item.severity_level, item.severity_score);
            const label = getConcernDisplayName(item.skin_concern?.name, item.predicted_class);

            return (
              <Link
                key={item.id}
                href={`/user/history/detail?id=${encodeURIComponent(item.id)}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all hover:border-emerald-200 hover:shadow-md"
              >
                <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={label}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-cyan-50 text-xs font-bold text-slate-400">
                      Foto sudah dihapus (retensi 90 hari)
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-slate-900/70 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                    {tone.status}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs font-medium text-slate-400">
                    {formatDate(item.created_at)}
                  </p>
                  <h3 className="mt-1 truncate text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                    {label}
                  </h3>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex flex-1 items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${confidencePercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        {confidencePercent}%
                      </span>
                    </div>

                    <span className="flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                      {item.scan_mode === "livecam" ? "📷 Kamera" : "🖼️ Upload"}
                    </span>
                  </div>

                  <HistoryRecommendationChips history={item} />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-sm font-semibold text-slate-500">
            Belum ada riwayat pemeriksaan.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Lakukan scan terlebih dahulu.
          </p>
        </div>
      )}

      {pagination.totalItems > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          itemLabel={pagination.itemLabel}
          basePath={pagination.basePath}
          searchParams={toSearchParams(filters)}
        />
      )}
    </div>
  );
}
