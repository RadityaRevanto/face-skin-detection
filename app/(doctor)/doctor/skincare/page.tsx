import type { Metadata } from "next";

import { SkincareContent } from "@/src/features/doctor/skincare/components/SkincareContent";
import { getSkincarePageData } from "@/src/features/doctor/skincare/lib/skincareQuery";


export const metadata: Metadata = {
  title: "Kelola Skincare",
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
