import type { Metadata } from "next";

import { UsersClientPage } from "@/features/admin/users/components/UsersClientPage";

export const metadata: Metadata = {
  title: "Manajemen User",
  description: "Kelola daftar user terdaftar",
};

export default function AdminUsersPage() {
  return <UsersClientPage />;
}
