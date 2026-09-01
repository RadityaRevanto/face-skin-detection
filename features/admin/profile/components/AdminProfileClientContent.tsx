"use client";

import { useQuery } from "@tanstack/react-query";

import { adminService } from "@/features/admin/services/adminService";
import { AdminProfileContent } from "./AdminProfileContent";
import type { AdminProfileData } from "../types";

export function AdminProfileClientContent() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["admin", "profile"],
    queryFn: async () => {
      const response = await adminService.adminProfile();
      return response as unknown as AdminProfileData;
    },
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-slate-500">
          Gagal memuat profil admin.
        </p>
      </div>
    );
  }

  return <AdminProfileContent profile={profile} />;
}
