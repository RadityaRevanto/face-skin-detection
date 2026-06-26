import type { Metadata } from "next";

import { CreateRecommendationContent } from "./components/create-recommendation-content";
import { getCreateRecommendationPageData } from "./lib/create-recommendation-query";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tambah Rekomendasi | Face Skin Detection",
  description: "Tambah rule rekomendasi skincare - Dashboard Dokter",
};

export default async function CreateRecommendationPage() {
  const pageData = await getCreateRecommendationPageData();

  return <CreateRecommendationContent {...pageData} />;
}
