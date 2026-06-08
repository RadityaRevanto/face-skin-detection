import type { Metadata } from "next";

import { UserDetailContent } from "./components/user-detail-content";
import { getUserDetail } from "./lib/user-detail-query";

export const dynamic = "force-dynamic";

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
