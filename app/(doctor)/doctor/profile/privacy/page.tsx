import type { Metadata } from "next";

import { PrivacyContainer } from "@/features/user/components/PrivacyContainer";

export const metadata: Metadata = {
  title: "Privasi & Data",
  description: "Kelola persetujuan AI, ekspor data, dan penghapusan akun",
};

export default function DoctorPrivacyPage() {
  return <PrivacyContainer role="doctor" basePath="/doctor/profile" />;
}
