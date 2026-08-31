import type { Metadata } from "next";

import { DisclaimerCard } from "@/src/features/tips/components/DisclaimerCard";
import { HeroSection } from "@/src/features/tips/components/HeroSection";
import { PersonalizedTipsCard } from "@/src/features/tips/components/PersonalizedTipsCard";
import { TipsGrid } from "@/src/features/tips/components/TipsGrid";
import {
  getAllTipsGroups,
  getLatestPrediction,
  getPersonalizedTips,
} from "@/src/features/tips/lib/tipsQuery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tips",
  description: "Tips perawatan kulit wajah berdasarkan kondisi kulit Anda",
};

export default async function TipsPage() {
  const latestPrediction = await getLatestPrediction();

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
