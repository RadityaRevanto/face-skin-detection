import type { Metadata } from "next";

import { VerificationDetailContent } from "./components/verification-detail-content";
import { getDoctorVerificationDetail } from "./lib/verification-detail-query";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Detail Verifikasi Dokter | Face Skin Detection",
  description: "Detail review dokumen verifikasi dokter",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminDoctorVerificationDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const doctor = await getDoctorVerificationDetail(id);

  return <VerificationDetailContent doctor={doctor} />;
}
