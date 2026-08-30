import {
  CtaReminder,
  FeatureHero,
  HealthScoreCard,
  LatestProblemsCard,
  RecentHistoryCard,
  getCurrentUserProfile,
  getUserPredictionHistories,
  getConfidencePercent,
  getProblemsFromPrediction,
  getToneBySeverity,
} from "@/src/features/home";
import { EmergencyHotlinesContainer } from "@/src/features/emergency/components/EmergencyHotlinesContainer";
import { ScanRecommendationsSection } from "@/src/features/scan/components/ScanRecommendationsSection";

// Halaman memakai fetchApi server-side (cookies) — wajib dynamic.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, histories] = await Promise.all([getCurrentUserProfile(), getUserPredictionHistories()]);
  const latestPrediction = histories[0] ?? null;
  const selectedConfidence = getConfidencePercent(latestPrediction?.confidence);
  const tone = getToneBySeverity(latestPrediction?.severity_level ?? null, latestPrediction?.severity_score ?? null);
  const problems = getProblemsFromPrediction(latestPrediction);

  return (
    <main className="w-full px-8 py-8 sm:px-10 lg:px-12">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Selamat datang kembali, {profile.full_name}!</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">Yuk, jaga kesehatan kulitmu setiap hari.</p>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.55fr_0.95fr]">
        <FeatureHero />
        <div className="grid gap-5">
          <HealthScoreCard latestPrediction={latestPrediction} selectedConfidence={selectedConfidence} tone={tone} />
          <LatestProblemsCard problems={problems} />
        </div>
      </div>
      <div className="mt-5">
        <RecentHistoryCard histories={histories} />
      </div>
      <div className="mt-5">
        <ScanRecommendationsSection
          treatmentRecommendations={latestPrediction?.treatment_recommendations}
          skincareRecommendations={latestPrediction?.skincare_recommendations}
        />
      </div>
      <div className="mt-5">
        <EmergencyHotlinesContainer />
      </div>
      <CtaReminder />
    </main>
  );
}
