import type { Metadata } from "next";

import { PrivacyContainer } from "@/src/features/user/components/PrivacyContainer";

export const metadata: Metadata = {
  title: "Privasi & Data",
  description: "Ekspor data pribadi dan penghapusan akun admin",
};

export default function AdminPrivacyPage() {
  return <PrivacyContainer role="admin" basePath="/admin/profile" />;
}
