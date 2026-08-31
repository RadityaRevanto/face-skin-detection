import type { Metadata } from "next";

import { RecommendationContent } from "@/src/features/doctor/recommendations/components/RecommendationContent";
import { getRecommendationsPageData } from "@/src/features/doctor/recommendations/lib/recommendationsQuery";


export const metadata: Metadata = {
  title: "Kelola Rekomendasi",
  description: "Kelola rekomendasi skincare - Dashboard Dokter",
};

type DoctorRecommendationsPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function DoctorRecommendationsPage({
  searchParams,
}: DoctorRecommendationsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page ?? 1);

  const pageData = await getRecommendationsPageData({ page });

  return <RecommendationContent {...pageData} />;
}
