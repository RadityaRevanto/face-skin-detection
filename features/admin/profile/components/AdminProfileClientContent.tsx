"use client";

import { useQuery } from "@tanstack/react-query";

import { adminService } from "@/features/admin/services/adminService";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
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
    return <LoadingState variant="detail" />;
  }

  if (!profile) {
    return <ErrorState message="Gagal memuat profil admin." />;
  }

  return <AdminProfileContent profile={profile} />;
}
