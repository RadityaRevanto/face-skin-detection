import type { Metadata } from "next";

import { AdminProfileClientContent } from "@/features/admin/profile/components/AdminProfileClientContent";

export const metadata: Metadata = {
  title: "Profil Admin",
  description: "Profil admin, ringkasan platform, dan info sesi",
};

export default function AdminProfilePage() {
  return <AdminProfileClientContent />;
}
