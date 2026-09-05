"use client";

import { useQuery } from "@tanstack/react-query";

import { scanService } from "@/features/scan/services/scanService";
import { catalogService } from "@/features/skin-types/services/catalogService";
import type { TipItem, TipsGroup } from "../types";

import { DisclaimerCard } from "./DisclaimerCard";
import { HeroSection } from "./HeroSection";
import { PersonalizedTipsCard } from "./PersonalizedTipsCard";
import { TipsGrid } from "./TipsGrid";

type PredictionLite = {
  id: string;
  predicted_class: string;
  skin_concern: { name: string | null } | null;
  created_at: string;
};

export function TipsClientContent() {
  const { data: scansResponse } = useQuery({
    queryKey: ["scans", "latest"],
    queryFn: async () => {
      const response = await scanService.list({
        page: 1,
        per_page: 1,
        sort: "-created_at",
      });
      return response.data?.[0] ?? null;
    },
  });

  const latest: PredictionLite | null = scansResponse
    ? {
        id: scansResponse.uuid,
        predicted_class: scansResponse.predicted_class,
        skin_concern: scansResponse.skin_concern,
        created_at: scansResponse.created_at,
      }
    : null;

  const { data: personalizedTips } = useQuery({
    queryKey: ["tips", "personalized", latest?.predicted_class ?? null],
    queryFn: async (): Promise<TipItem[]> => {
      const predictedClass = latest?.predicted_class;
      if (!predictedClass) return [];

      const response = await catalogService.recommendations({
        ml_label: predictedClass,
        per_page: 20,
        page: 1,
      });

      // Backend sudah mengurutkan prioritas high → medium → low.
      return (response.data ?? []).slice(0, 4).map((rec) => ({
        uuid: rec.uuid,
        title: rec.title,
        recommendation_text: rec.recommendation_text,
        priority_level: rec.priority_level,
      }));
    },
  });

  const { data: tipsGroups } = useQuery({
    queryKey: ["tips", "groups"],
    queryFn: async (): Promise<TipsGroup[]> => {
      const [concernsResponse, recsResponse] = await Promise.all([
        catalogService.skinConcerns(),
        catalogService.recommendations({ per_page: 50, page: 1 }),
      ]);

      const concerns = concernsResponse.data ?? [];
      const allRecs = recsResponse.data ?? [];

      const groups = concerns.map((concern) => {
        const tips = allRecs
          .filter((rec) => rec.concern?.uuid === concern.uuid)
          .slice(0, 4);

        return {
          concernId: concern.uuid,
          concernName: concern.name,
          concernDescription: concern.description ?? null,
          tips: tips.map((rec) => ({
            uuid: rec.uuid,
            title: rec.title,
            recommendation_text: rec.recommendation_text,
            priority_level: rec.priority_level,
          })),
        } satisfies TipsGroup;
      });

      return groups.filter((group) => group.tips.length > 0);
    },
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="space-y-6">
        <HeroSection latestPrediction={latest} />

        <PersonalizedTipsCard
          latestPrediction={latest}
          tips={personalizedTips ?? []}
        />

        <TipsGrid groups={tipsGroups ?? []} />

        <DisclaimerCard />
      </div>
    </main>
  );
}
