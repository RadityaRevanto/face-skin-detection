"use client";

import { useQuery } from "@tanstack/react-query";

import { scanService } from "@/features/scan/services/scanService";
import { profileService } from "@/features/profile/services/profileService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  getConfidencePercent,
  getProblemsFromPrediction,
  getToneBySeverity,
} from "../utils/homeUtils";
import type { PredictionHistory, Problem } from "../types";

import { CtaReminder } from "./CtaReminder";
import { FeatureHero } from "./FeatureHero";
import { HealthScoreCard } from "./HealthScoreCard";
import { LatestProblemsCard } from "./LatestProblemsCard";
import { RecentHistoryCard } from "./RecentHistoryCard";
import { EmergencyHotlinesContainer } from "@/features/emergency/components/EmergencyHotlinesContainer";
import { ScanRecommendationsSection } from "@/features/scan/components/ScanRecommendationsSection";

type HomeContentProps = {
  displayName?: string;
};

export function HomeContent({ displayName }: HomeContentProps) {
  const { currentUser } = useAuth();

  const { data: scansResponse } = useQuery({
    queryKey: ["scans", { page: 1, per_page: 5 }],
    queryFn: () => scanService.list({ page: 1, per_page: 5, sort: "-created_at" }),
  });

  const { data: profileName } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.get(),
    select: (profile) => profile.full_name,
  });

  const histories: PredictionHistory[] = (scansResponse?.data ?? []).map((scan) => ({
    ...scan,
    id: scan.uuid,
    confidence: Number(scan.confidence),
    severity_score: scan.severity_score ?? null,
    model_used: scan.model_used ?? null,
  }));

  const latestPrediction = histories[0] ?? null;
  const selectedConfidence = getConfidencePercent(latestPrediction?.confidence);
  const tone = getToneBySeverity(
    latestPrediction?.severity_level ?? null,
    latestPrediction?.severity_score ?? null,
  );
  const problems: Problem[] = getProblemsFromPrediction(latestPrediction ?? undefined);

  const name = displayName ?? profileName ?? currentUser?.full_name ?? "Pengguna";

  return (
    <main className="w-full px-8 py-8 sm:px-10 lg:px-12">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Selamat datang kembali, {name}!
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Yuk, jaga kesehatan kulitmu setiap hari.
          </p>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.55fr_0.95fr]">
        <FeatureHero />
        <div className="grid gap-5">
          <HealthScoreCard
            latestPrediction={latestPrediction}
            selectedConfidence={selectedConfidence}
            tone={tone}
          />
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
