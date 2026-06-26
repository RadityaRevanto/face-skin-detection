import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function requireDoctorProfile() {
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
    .select("id, full_name, email, role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    redirect("/login");
  }

  if (profile.role !== "doctor") {
    redirect("/login");
  }

  if (profile.is_active === false) {
    redirect("/doctor/verification-status");
  }

  return profile;
}
