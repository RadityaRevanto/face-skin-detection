import { CtaReminder } from "./_components/cta-reminder";
import { FeatureHero } from "./_components/feature-hero";
import { HealthScoreCard } from "./_components/health-score-card";
import { LatestProblemsCard } from "./_components/latest-problems-card";
import { RecommendationCard } from "./_components/recommendation-card";
import { RecentHistoryCard } from "./_components/recent-history-card";
import { TodayTipCard } from "./_components/today-tip-card";
import {
  getCurrentUserProfile,
  getRecommendationsByPredictedClass,
  getUserPredictionHistories,
} from "./_lib/home-query";
import {
  getConfidencePercent,
  getProblemsFromPrediction,
  getToneBySeverity,
} from "./_lib/home-utils";

export default async function HomePage() {
  const profile = await getCurrentUserProfile();
  const histories = await getUserPredictionHistories(profile.id);

  const latestPrediction = histories[0] ?? null;

  const selectedConfidence = getConfidencePercent(latestPrediction?.confidence);

  const tone = getToneBySeverity(
    latestPrediction?.severity_level ?? null,
    latestPrediction?.severity_score ?? null,
  );

  const problems = getProblemsFromPrediction(latestPrediction);

  const recommendations = await getRecommendationsByPredictedClass(
    latestPrediction?.predicted_class ?? null,
  );

  return (
    <main className='w-full px-8 py-8 sm:px-10 lg:px-12'>
      <div className='mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
            Selamat datang kembali, {profile.full_name}!
          </h1>
          <p className='mt-2 text-sm font-medium text-slate-500'>
            Yuk, jaga kesehatan kulitmu setiap hari.
          </p>
        </div>
      </div>

      <div className='grid gap-5 lg:grid-cols-[1.55fr_0.95fr]'>
        <FeatureHero />

        <div className='grid gap-5'>
          <HealthScoreCard
            latestPrediction={latestPrediction}
            selectedConfidence={selectedConfidence}
            tone={tone}
          />

          <LatestProblemsCard problems={problems} />
        </div>
      </div>

      <div className='mt-5 grid gap-5 lg:grid-cols-[0.95fr_0.65fr_0.95fr]'>
        <RecentHistoryCard histories={histories} />

        <TodayTipCard />

        <RecommendationCard recommendations={recommendations} />
      </div>

      <CtaReminder />
    </main>
  );
}
