import type { Metadata } from "next";

import { DoctorRegisterView } from "@/features/auth/components/DoctorRegisterView";
import { RedirectIfAuthenticated } from "@/features/auth/components/RedirectIfAuthenticated";

export const metadata: Metadata = {
  title: "Register Dokter",
  description: "Daftar sebagai dokter terverifikasi",
};

export default function RegisterDoctorPage() {
  return (
    <RedirectIfAuthenticated>
      <DoctorRegisterView />
    </RedirectIfAuthenticated>
  );
}
