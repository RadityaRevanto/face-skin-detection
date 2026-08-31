import type { Metadata } from "next";

import { UsersContent } from "@/src/features/admin/users/components/UsersContent";
import { getUsersPageData } from "@/src/features/admin/users/lib/usersQuery";


export const metadata: Metadata = {
  title: "Manajemen User",
  description: "Kelola daftar user terdaftar",
};

type AdminUsersPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page ?? 1);

  const pageData = await getUsersPageData({ page });

  return <UsersContent {...pageData} />;
}
