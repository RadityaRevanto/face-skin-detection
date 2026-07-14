import type { Metadata } from "next";

import { DoctorRegisterView } from "@/components/auth/doctor-register-view";
import { redirectIfAuthenticated } from "@/lib/auth/session-redirect";

export const metadata: Metadata = {
  title: "Register Dokter | Face Skin Detection",
  description: "Daftar sebagai dokter terverifikasi",
};

export default async function RegisterDoctorPage() {
  await redirectIfAuthenticated();

  return <DoctorRegisterView />;
}
