import type { Metadata } from "next";

import { DoctorRegisterView } from "@/components/auth/doctor-register-view";

export const metadata: Metadata = {
  title: "Register Dokter | Face Skin Detection",
  description: "Daftar sebagai dokter terverifikasi",
};

export default function RegisterDoctorPage() {
  return <DoctorRegisterView />;
}
