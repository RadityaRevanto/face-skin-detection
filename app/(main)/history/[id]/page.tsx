import { notFound } from "next/navigation";

import { HistoryDetail } from "@/src/features/history/components/HistoryDetail";
import { RecommendationCard } from "@/src/features/history/components/RecommendationCard";
import { getPredictionHistories, getRecommendations } from "@/src/features/history/utils/historyService";

type HistoryDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: HistoryDetailPageProps) {
  const resolvedParams = await params;
  const histories = await getPredictionHistories();
  const history = histories.find((h) => h.id === resolvedParams.id) ?? null;

  if (!history) {
    return {
      title: "History Not Found | Face Skin Detection",
    };
  }

  return {
    title: `History | ${history.predicted_class} | Face Skin Detection`,
    description: "Detail riwayat prediksi kondisi kulit Anda",
  };
}

export default async function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  const resolvedParams = await params;
  const histories = await getPredictionHistories();
  const history = histories.find((h) => h.id === resolvedParams.id) ?? null;

  if (!history) {
    notFound();
  }

  const { recommendations, mlLabel, hasMore } = await getRecommendations(history.predicted_class ?? null);

  return (
    <div className="grid w-full gap-6 lg:grid-cols-1 xl:grid-cols-[1fr_360px]">
      <HistoryDetail history={history} />
      <div className="space-y-6">
        <RecommendationCard recommendations={recommendations} mlLabel={mlLabel} hasMore={hasMore} historyId={history.id} />
      </div>
    </div>
  );
}
