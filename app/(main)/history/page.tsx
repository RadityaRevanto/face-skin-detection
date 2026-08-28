import type { Metadata } from "next";

import { HistoryList } from "@/src/features/history/components/HistoryList";
import { HistoryDetail } from "@/src/features/history/components/HistoryDetail";
import { RecommendationCard } from "@/src/features/history/components/RecommendationCard";
import { getPredictionHistories, getRecommendations } from "@/src/features/history/utils/historyService";

export const metadata: Metadata = {
  title: "History | Face Skin Detection",
  description: "Riwayat prediksi kondisi kulit Anda",
};

type HistoryPageProps = {
  searchParams?: Promise<{ id?: string }>;
};

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const resolvedSearchParams = await searchParams;
  const histories = await getPredictionHistories();
  const selectedHistory = histories.find((h) => h.id === resolvedSearchParams?.id) ?? histories[0] ?? null;
  const { recommendations, mlLabel, hasMore } = await getRecommendations(selectedHistory?.predicted_class ?? null);

  return (
    <div className="grid w-full gap-6 lg:grid-cols-[380px_1fr]">
      <div className="h-fit lg:sticky lg:top-20">
        <HistoryList histories={histories} selectedHistoryId={selectedHistory?.id} />
      </div>
      <div className="min-w-0 space-y-6">
        {selectedHistory ? (
          <>
            <HistoryDetail history={selectedHistory} />
            <RecommendationCard recommendations={recommendations} mlLabel={mlLabel} hasMore={hasMore} historyId={selectedHistory.id} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-slate-400">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="mt-4 text-lg font-bold text-slate-900">Belum Ada Riwayat</p>
            <p className="mt-1 text-sm text-slate-500">Lakukan pemeriksaan terlebih dahulu untuk melihat hasilnya di sini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
