import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AppRole = "user" | "doctor" | "admin";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getCurrentProfile() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, avatar_url, is_active, created_at")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireProfile() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (!profile.is_active) {
    redirect("/login?error=account_inactive");
  }

  return profile;
}

export async function requireRole(role: AppRole) {
  const profile = await requireProfile();

  if (profile.role !== role) {
    redirect("/");
  }

  return profile;
}

export async function requireAdmin() {
  return requireRole("admin");
}

export async function requireUserRole() {
  return requireRole("user");
}

export async function requireDoctor() {
  return requireRole("doctor");
}

export async function requireApprovedDoctor() {
  const supabase = await createClient();
  const profile = await requireDoctor();

  const { data, error } = await supabase
    .from("doctor_verifications")
    .select("verification_status")
    .eq("doctor_id", profile.id)
    .single();

  if (error || !data) {
    redirect("/doctor/verification-status");
  }

  if (data.verification_status !== "approved") {
    redirect("/doctor/verification-status");
  }

  return profile;
}
