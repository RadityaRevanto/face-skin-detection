import type { Metadata } from "next";
import { VerificationsClientPage } from "@/features/admin/verifications/components/VerificationsClientPage";

export const metadata: Metadata = {
  title: "Verifikasi Tenaga Medis - SkinCek Admin",
  description: "Tinjau dan validasi izin SIP/STR dokter spesialis kulit di SkinCek.",
};

export default function AdminDoctorVerificationsPage() {
  return <VerificationsClientPage pageType="pending" />;
}
