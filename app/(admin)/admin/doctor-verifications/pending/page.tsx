import type { Metadata } from "next";

import { DoctorVerificationContent } from "@/src/features/admin/verifications/components/DoctorVerificationContent";
import { getDoctorVerificationPageData } from "@/src/features/admin/verifications/lib/doctorVerificationsQuery";


export const metadata: Metadata = {
  title: "Pending Verifikasi Dokter",
  description: "Daftar dokter yang menunggu proses verifikasi",
};

type AdminPendingDoctorVerificationsPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function AdminPendingDoctorVerificationsPage({
  searchParams,
}: AdminPendingDoctorVerificationsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page ?? 1);

  const pageData = await getDoctorVerificationPageData({
    page,
    pageType: "pending",
  });

  return <DoctorVerificationContent {...pageData} />;
}
