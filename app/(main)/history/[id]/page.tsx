import { notFound } from "next/navigation";

import { HistoryDetail } from "@/src/features/history/components/HistoryDetail";
import { ScanRecommendationsSection } from "@/src/features/scan/components/ScanRecommendationsSection";
import { getHistoryDetail } from "@/src/features/history/utils/historyService";
import { getConcernDisplayName } from "@/lib/utils/skin-labels";

export const dynamic = "force-dynamic";

type HistoryDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: HistoryDetailPageProps) {
  const resolvedParams = await params;
  const history = await getHistoryDetail(resolvedParams.id);

  if (!history) {
    return { title: "History Not Found" };
  }

  return {
    title: `History | ${getConcernDisplayName(history.skin_concern?.name, history.predicted_class)}`,
    description: "Detail riwayat prediksi kondisi kulit Anda",
  };
}

export default async function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  const resolvedParams = await params;
  const history = await getHistoryDetail(resolvedParams.id);

  if (!history) {
    notFound();
  }

  return (
    <div className="w-full space-y-6">
      <HistoryDetail history={history} />
      <ScanRecommendationsSection
        treatmentRecommendations={history.treatment_recommendations}
        skincareRecommendations={history.skincare_recommendations}
      />
    </div>
  );
}
