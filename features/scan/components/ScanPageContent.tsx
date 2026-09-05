"use client";

import { useQuery } from "@tanstack/react-query";

import { scanService } from "@/features/scan/services/scanService";
import { profileService } from "@/features/profile/services/profileService";
import { PemeriksaanContent } from "./ScanContent";

export function ScanPageContent() {
  // Gate SCAN_FLOW: scan pertama butuh DOB + gender lengkap.
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.get(),
  });

  const { data: latestScan } = useQuery({
    queryKey: ["scans", "latest"],
    queryFn: async () => {
      const response = await scanService.list({
        page: 1,
        per_page: 1,
        sort: "-created_at",
      });
      const latest = response.data?.[0] ?? null;
      if (!latest) return null;

      return {
        ...latest,
        id: latest.uuid,
        confidence: Number(latest.confidence),
        severity_score: latest.severity_score ?? null,
        model_used: latest.model_used ?? null,
      };
    },
  });

  return (
    <main className="w-full px-4 py-6 sm:px-10 sm:py-8 lg:px-12">
      <PemeriksaanContent
        initialPrediction={latestScan ?? null}
        initialProfile={
          profile
            ? {
                uuid: profile.uuid,
                full_name: profile.full_name,
                gender: (profile.gender as string | null) ?? null,
                date_of_birth: (profile.date_of_birth as string | null) ?? null,
              }
            : null
        }
      />
    </main>
  );
}
