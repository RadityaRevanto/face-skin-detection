import type { Metadata } from "next";

import { AdminProfileContent } from "@/src/features/admin/profile/components/AdminProfileContent";
import { getAdminProfileData } from "@/src/features/admin/profile/lib/adminProfileQuery";

export const metadata: Metadata = {
  title: "Profil Admin",
  description: "Profil admin, ringkasan platform, dan info sesi",
};

export default async function AdminProfilePage() {
  const profile = await getAdminProfileData();

  if (!profile) {
    return (
      <div className="w-full rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-slate-500">Gagal memuat profil admin.</p>
      </div>
    );
  }

  return <AdminProfileContent profile={profile} />;
}
