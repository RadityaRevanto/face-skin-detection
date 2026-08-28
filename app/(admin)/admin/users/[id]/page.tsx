import type { Metadata } from "next";

import { UserDetailContent } from "@/src/features/admin/users/[id]/components/UserDetailContent";
import { getUserDetail } from "@/src/features/admin/users/[id]/lib/userDetailQuery";


export const metadata: Metadata = {
  title: "Detail User | Face Skin Detection",
  description: "Detail profil user",
};

type AdminUserDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminUserDetailPage({
  params,
}: AdminUserDetailPageProps) {
  const { id } = await params;

  const user = await getUserDetail(id);

  return <UserDetailContent user={user} />;
}
