import type { Metadata } from "next";

import { AnalysisPhotoCard } from "./_components/analysis-photo-card";
import { ConditionSummaryCard } from "./_components/condition-summary-card";
import { ExaminationInfoCard } from "./_components/examination-info-card";
import { HistoryResultHeader } from "./_components/history-result-header";
import { HistorySidebar } from "./_components/history-sidebar";
import { NoteCard } from "./_components/note-card";
import { ProblemDetailsCard } from "./_components/problem-details-card";
import { RecommendationCard } from "./_components/recommendation-card";
import {
  getCurrentUserId,
  getPredictionHistories,
  getRecommendations,
} from "./_lib/history-query";
import {
  formatDate,
  getConfidencePercent,
  getProblemDetails,
  getToneBySeverity,
} from "./_lib/history-utils";

export const metadata: Metadata = {
  title: "History | Face Skin Detection",
  description: "Riwayat prediksi kondisi kulit Anda",
};

type HistoryPageProps = {
  searchParams?: Promise<{
    id?: string;
  }>;
};

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const resolvedSearchParams = await searchParams;

  const userId = await getCurrentUserId();
  const histories = await getPredictionHistories(userId);

  const selectedHistory =
    histories.find((history) => history.id === resolvedSearchParams?.id) ??
    histories[0] ??
    null;

  const tone = getToneBySeverity(
    selectedHistory?.severity_level ?? null,
    selectedHistory?.severity_score ?? null,
  );

  const problemDetails = getProblemDetails(selectedHistory);

  const recommendations = await getRecommendations(
    selectedHistory?.predicted_class ?? null,
  );

  const selectedDate = selectedHistory
    ? formatDate(selectedHistory.created_at)
    : "-";

  const selectedConfidence = getConfidencePercent(selectedHistory?.confidence);

  const scanMethod =
    selectedHistory?.scan_mode === "livecam_yolo"
      ? "YOLOv8 - Real-time Detection"
      : "Upload Image - Classification";

  return (
    <main className='grid w-full items-start gap-6 px-4 py-6 sm:px-10 sm:py-8 lg:grid-cols-[360px_1fr] lg:px-12'>
      <HistorySidebar
        histories={histories}
        selectedHistoryId={selectedHistory?.id}
      />

      <section className='min-w-0 space-y-6'>
        <HistoryResultHeader
          selectedHistory={selectedHistory}
          selectedDate={selectedDate}
          tone={tone}
        />

        <div className='grid gap-6 xl:grid-cols-[1fr_430px]'>
          <div className='min-w-0 space-y-6'>
            <AnalysisPhotoCard
              selectedHistory={selectedHistory}
              problemDetails={problemDetails}
            />

            <ExaminationInfoCard
              selectedDate={selectedDate}
              scanMethod={scanMethod}
            />
          </div>

          <aside className='min-w-0 space-y-6'>
            <ConditionSummaryCard
              selectedHistory={selectedHistory}
              selectedConfidence={selectedConfidence}
              tone={tone}
            />

            <ProblemDetailsCard problemDetails={problemDetails} />

            <RecommendationCard recommendations={recommendations} />
          </aside>
        </div>

        <NoteCard />
      </section>
    </main>
  );
}
