import type { Metadata } from "next";

import { VerificationsClientPage } from "@/features/admin/verifications/components/VerificationsClientPage";

export const metadata: Metadata = {
  title: "Verifikasi Ditolak",
  description: "Daftar verifikasi dokter yang ditolak",
};

export default function AdminRejectedDoctorVerificationsPage() {
  return <VerificationsClientPage pageType="rejected" />;
}
