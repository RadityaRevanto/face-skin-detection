import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireDoctorProfile } from "@/lib/doctor-auth";
import { fetchApi } from "@/lib/api/server-client";
import { SkinConcernDetail } from "@/src/features/doctor/skin-concerns/components/SkinConcernDetail";
import type { SkinConcern } from "@/src/features/doctor/skin-concerns/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Detail Skin Concern",
  description: "Detail skin concern - Dashboard Dokter",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SkinConcernDetailPage({ params }: PageProps) {
  const { id } = await params;

  await requireDoctorProfile();

  let skinConcern: SkinConcern | null = null;

  try {
    const res = await fetchApi<SkinConcern>(`/skin-concerns/${id}`);
    skinConcern = res.data ?? null;
  } catch (error) {
    console.error("Failed to fetch skin concern detail:", error);
  }

  if (!skinConcern) {
    notFound();
  }

  return <SkinConcernDetail skinConcern={skinConcern} />;
}
