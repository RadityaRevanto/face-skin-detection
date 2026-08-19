import "server-only";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/**
 * Menentukan halaman dashboard tujuan berdasarkan role & status akun yang
 * sedang login. Mengembalikan null jika tidak ada sesi valid atau akun tidak
 * boleh masuk dashboard (mis. user/admin nonaktif) — agar tidak terjadi
 * redirect loop dengan guard di middleware.
 */
export async function getDashboardPathForCurrentUser(): Promise<string | null> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const userRole = cookieStore.get("user_role")?.value;
  const userStatus = cookieStore.get("user_status")?.value;

  if (!authToken || !userRole) {
    return null;
  }

  if (userRole === "admin") {
    return userStatus === "inactive" ? null : "/admin/dashboard";
  }

  if (userRole === "user") {
    return userStatus === "inactive" ? null : "/user/home";
  }

  if (userRole === "doctor") {
    if (userStatus === "approved") {
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
