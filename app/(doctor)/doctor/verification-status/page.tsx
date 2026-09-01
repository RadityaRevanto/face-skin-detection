import type { Metadata } from "next";

import { VerificationStatusClientContent } from "@/features/doctor/verification/components/VerificationStatusClientContent";

export const metadata: Metadata = {
  title: "Status Verifikasi",
  description: "Status verifikasi akun dokter Anda",
};

export default function VerificationStatusPage() {
  return <VerificationStatusClientContent />;
}
