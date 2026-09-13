import { SummaryCardsRow } from "@/features/shared/components/SummaryCardsRow";

import type { RecommendationSummary } from "@/features/doctor/recommendations/lib/recommendationsTypes";

type RecommendationSummaryCardsProps = {
  summary: RecommendationSummary;
};

export function RecommendationSummaryCards({
  summary,
}: RecommendationSummaryCardsProps) {
  return (
    <SummaryCardsRow
      cards={[
        {
          label: "Total Rekomendasi",
          value: String(summary.totalRecommendations),
          helper: "Mapping rekomendasi aktif",
        },
        {
          label: "Skin Concern",
          value: String(summary.totalConcerns),
          helper: "Concern yang memiliki rule",
        },
        {
          label: "Routine Step",
          value: String(summary.totalRoutineSteps),
          helper: "Pagi dan malam",
        },
      ]}
    />
  );
}
