import type { Metadata } from "next";

import { UsersContent } from "./components/users-content";
import { getUsersPageData } from "./lib/users-query";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manajemen User | Face Skin Detection",
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
