import { notFound } from "next/navigation";

import { requireAdminProfile } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

import type { UserDetail } from "./user-detail-types";
import { formatDate } from "./user-detail-utils";

export async function getUserDetail(id: string): Promise<UserDetail> {
  await requireAdminProfile();

  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, avatar_url, is_active, created_at")
    .eq("id", id)
    .eq("role", "user")
    .maybeSingle();

  if (profileError) {
    console.error("Failed to fetch user profile detail:", {
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint,
      code: profileError.code,
    });

    notFound();
  }

  if (!profile) {
    notFound();
  }

  return {
    id: profile.id,
    username: profile.full_name ?? "User",
    email: profile.email ?? "-",
    role: "user",
    avatarUrl: profile.avatar_url ?? null,
    isActive: profile.is_active ?? true,
    joinedAt: formatDate(profile.created_at),
  };
}
