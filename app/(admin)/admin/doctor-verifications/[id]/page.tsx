import type { Metadata } from "next";

import { VerificationDetailContent } from "@/src/features/admin/verifications/[id]/components/VerificationDetailContent";
import { getDoctorVerificationDetail } from "@/src/features/admin/verifications/[id]/lib/verificationDetailQuery";


export const metadata: Metadata = {
  title: "Detail Verifikasi Dokter",
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
