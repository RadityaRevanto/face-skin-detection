import { CameraPanel } from "./_components/camera-panel";
import { ProblemDetectionCard } from "./_components/problem-detection-card";
import { RecommendationCard } from "./_components/recommendation-card";
import { SkinStatusCard } from "./_components/skin-status-card";
import { StepsCard } from "./_components/steps-card";
import {
  getCurrentUserId,
  getLatestPrediction,
  getRecommendationsByPredictedClass,
} from "./_lib/pemeriksaan-query";
import {
  getConfidencePercent,
  getSkinProblemsFromPrediction,
  getToneBySeverity,
} from "./_lib/pemeriksaan-utils";

export default async function PemeriksaanPage() {
  const userId = await getCurrentUserId();

  const latestPrediction = await getLatestPrediction(userId);

  const confidencePercent = getConfidencePercent(latestPrediction?.confidence);

  const tone = getToneBySeverity(
    latestPrediction?.severity_level ?? null,
    latestPrediction?.severity_score ?? null,
  );

  const skinProblems = getSkinProblemsFromPrediction(latestPrediction);

  const recommendations = await getRecommendationsByPredictedClass(
    latestPrediction?.predicted_class ?? null,
  );

  return (
    <main className='w-full px-8 py-8 sm:px-10 lg:px-12'>
      <div className='grid gap-8 xl:grid-cols-[1.65fr_0.75fr]'>
        <div className='space-y-6'>
          <CameraPanel />
          <StepsCard />
        </div>

        <aside className='space-y-6'>
          <SkinStatusCard
            latestPrediction={latestPrediction}
            confidencePercent={confidencePercent}
            tone={tone}
          />

          <ProblemDetectionCard skinProblems={skinProblems} />

          <RecommendationCard recommendations={recommendations} />
        </aside>
      </div>
    </main>
  );
}
