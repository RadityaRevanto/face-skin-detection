import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/**
 * Menentukan halaman dashboard tujuan berdasarkan role & status akun yang
 * sedang login. Mengembalikan null jika tidak ada sesi valid atau akun tidak
 * boleh masuk dashboard (mis. user/admin nonaktif) — agar tidak terjadi
 * redirect loop dengan guard di middleware.
 */
export async function getDashboardPathForCurrentUser(): Promise<string | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return null;
  }

  if (profile.role === "admin") {
    return profile.is_active === false ? null : "/admin/dashboard";
  }

  if (profile.role === "user") {
    return profile.is_active === false ? null : "/user/home";
  }

  if (profile.role === "doctor") {
    const { data: verification } = await supabase
      .from("doctor_verifications")
      .select("verification_status")
      .eq("doctor_id", user.id)
      .maybeSingle();

    const status =
      verification?.verification_status?.toLowerCase().trim() || "pending";

    if (status === "approved" && profile.is_active !== false) {
      return "/doctor/dashboard";
    }

    // Dokter pending/belum aktif tetap punya halaman sendiri.
    return "/doctor/verification-status";
  }

  return null;
}

/**
 * Jika sudah login, langsung arahkan ke dashboard sesuai role. Dipakai di
 * halaman publik (landing, login, register) supaya pengguna dengan sesi aktif
 * tidak perlu login ulang dan langsung masuk dashboard.
 */
export async function redirectIfAuthenticated(): Promise<void> {
  const path = await getDashboardPathForCurrentUser();

  if (path) {
    redirect(path);
  }
}
