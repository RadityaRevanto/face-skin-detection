import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function requireAdminProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, avatar_url, is_active, created_at")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    profile.role !== "admin" ||
    !profile.is_active
  ) {
    redirect("/login");
  }

  return profile;
}
