import { fetchApi } from "@/lib/api/server-client";
import { redirect } from "next/navigation";
import { getAuthToken, removeAuthToken } from "./auth/token";

export type AppRole = "user" | "doctor" | "admin";

export interface ProfileApi {
  id: string;
  uuid?: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url?: string | null;
  google_avatar_url?: string | null;
  is_active?: boolean;
  verification_status?: string;
}

export async function getCurrentUser(): Promise<ProfileApi | null> {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const response = await fetchApi<ProfileApi>("profile");
    if (!response || !response.data) return null;
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function getCurrentProfile() {
  // Karena API Laravel /profile mengembalikan seluruh data (uuid, email, role, avatar),
  // getCurrentUser dan getCurrentProfile identik.
  return await getCurrentUser();
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?clear_session=true");
  }

  return user;
}

export async function requireProfile() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login?clear_session=true");
  }

  if (profile.is_active === false) {
    redirect("/login?error=account_inactive&clear_session=true");
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
  const profile = await requireDoctor();

  if (profile.verification_status !== "approved") {
    redirect("/doctor/verification-status");
  }

  return profile;
}
