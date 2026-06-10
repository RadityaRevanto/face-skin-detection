import type { Metadata } from "next";

import { SkincareContent } from "./components/skincare-content";
import { getSkincarePageData } from "./lib/skincare-query";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kelola Skincare | Face Skin Detection",
  description: "Kelola produk skincare - Dashboard Dokter",
};

type DoctorSkincarePageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function DoctorSkincarePage({
  searchParams,
}: DoctorSkincarePageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page ?? 1);

  const pageData = await getSkincarePageData({ page });

  return <SkincareContent {...pageData} />;
}
