"use client";

import { useQuery } from "@tanstack/react-query";

import { adminService } from "@/features/admin/services/adminService";
import { DetailPageSkeleton } from "@/components/skeletons";
import { ErrorState } from "@/components/ui/error-state";
import { AdminProfileContent } from "./AdminProfileContent";
import type { AdminProfileData } from "../types";

export function AdminProfileClientContent() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["admin", "profile"],
    queryFn: () => adminService.adminProfile(),
  });

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (!profile) {
    return <ErrorState message="Gagal memuat profil admin." />;
  }

  return <AdminProfileContent profile={profile} />;
}
