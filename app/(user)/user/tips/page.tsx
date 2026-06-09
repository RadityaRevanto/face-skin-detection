import type { Metadata } from "next";

import { DisclaimerCard } from "./components/disclaimer-card";
import { HeroSection } from "./components/hero-section";
import { PersonalizedTipsCard } from "./components/personalized-tips-card";
import { TipsGrid } from "./components/tips-grid";
import {
  getAllTipsGroups,
  getCurrentUserId,
  getLatestPrediction,
  getPersonalizedTips,
} from "./lib/tips-query";

export const metadata: Metadata = {
  title: "Tips | Face Skin Detection",
  description: "Tips perawatan kulit wajah berdasarkan kondisi kulit Anda",
};

export default async function TipsPage() {
  const userId = await getCurrentUserId();

  const latestPrediction = await getLatestPrediction(userId);

  const personalizedTips = await getPersonalizedTips(
    latestPrediction?.predicted_class ?? null,
  );

  const tipsGroups = await getAllTipsGroups();

  return (
    <main className='mx-auto w-full max-w-7xl px-6 py-10'>
      <div className='space-y-6'>
        <HeroSection latestPrediction={latestPrediction} />

        <PersonalizedTipsCard
          latestPrediction={latestPrediction}
          tips={personalizedTips}
        />

        <TipsGrid groups={tipsGroups} />

        <DisclaimerCard />
      </div>
    </main>
  );
}
