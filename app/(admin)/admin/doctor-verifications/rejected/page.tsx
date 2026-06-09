import type { Metadata } from "next";

import { DoctorVerificationContent } from "../components/doctor-verification-content";
import { getDoctorVerificationPageData } from "../lib/doctor-verifications-query";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rejected Verifikasi Dokter | Face Skin Detection",
  description: "Riwayat dokter yang ditolak saat proses verifikasi",
};

type AdminRejectedDoctorVerificationsPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function AdminRejectedDoctorVerificationsPage({
  searchParams,
}: AdminRejectedDoctorVerificationsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page ?? 1);

  const pageData = await getDoctorVerificationPageData({
    page,
    pageType: "rejected",
  });

  return <DoctorVerificationContent {...pageData} />;
}
