import type { Metadata } from "next";

import { VerificationsClientPage } from "@/features/admin/verifications/components/VerificationsClientPage";

export const metadata: Metadata = {
  title: "Pending Verifikasi Dokter",
  description: "Daftar dokter yang menunggu proses verifikasi",
};

export default function AdminPendingDoctorVerificationsPage() {
  return <VerificationsClientPage pageType="pending" />;
}
