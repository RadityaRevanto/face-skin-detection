import type { Metadata } from "next";

import { RecommendationContent } from "./components/recommendation-content";
import { getRecommendationsPageData } from "./lib/recommendations-query";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kelola Rekomendasi | Face Skin Detection",
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
