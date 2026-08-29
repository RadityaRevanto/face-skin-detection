import type { Metadata } from "next";

import { DoctorRegisterView } from "@/src/features/auth/components/DoctorRegisterView";
import { redirectIfAuthenticated } from "@/lib/auth/session-redirect";

export const metadata: Metadata = {
  title: "Register Dokter | Face Skin Detection",
  description: "Daftar sebagai dokter terverifikasi",
};

export default async function RegisterDoctorPage() {
  await redirectIfAuthenticated();

  return <DoctorRegisterView />;
}
