import type { Metadata } from "next";

import { AdminDoctorsClientPage } from "@/features/admin/doctors/components/DoctorsClientPage";

export const metadata: Metadata = {
  title: "Manajemen Dokter",
  description: "Kelola daftar dokter terdaftar",
};

export default function AdminDoctorsPage() {
  return <AdminDoctorsClientPage />;
}
