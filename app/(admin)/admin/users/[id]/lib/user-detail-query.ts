import { notFound } from "next/navigation";

import { requireAdminProfile } from "@/lib/admin-auth";
import { fetchApi } from "@/lib/api/server-client";

import type { UserDetail } from "./user-detail-types";
import { formatDate } from "./user-detail-utils";

interface UserDetailApi {
  id: string;
  uuid?: string;
  full_name: string;
  email: string;
  role?: string;
  roles?: { name: string }[];
  is_active?: boolean;
  avatar_url?: string;
  created_at: string;
}

export async function getUserDetail(id: string): Promise<UserDetail> {
  await requireAdminProfile();

  try {
    const res = await fetchApi<UserDetailApi>(`/admin/users/${id}`);
    const profile = res.data;

    if (!profile) {
      notFound();
    }

    const roleObj = profile.roles?.[0];
    const role = roleObj ? roleObj.name : profile.role;

    return {
      id: profile.uuid ?? profile.id ?? "unknown",
      name: profile.full_name ?? "User",
      email: profile.email ?? "-",
      role: (role as "user" | "doctor" | "admin") ?? "user",
      avatarUrl: profile.avatar_url ?? null,
      isActive: profile.is_active ?? true,
      createdAt: formatDate(profile.created_at),
    };
  } catch (error) {
    console.error("Failed to fetch user profile detail:", error);
    notFound();
  }
}
