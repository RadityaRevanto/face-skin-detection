"use server";

import { fetchApi } from "@/lib/api/server-client";
import { setAuthToken, removeAuthToken, setUserRole } from "./token";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Email dan password wajib diisi." };
  }

  try {
    const response = await fetchApi<{ token: string; user: any }>("login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.data && response.data.token) {
      await setAuthToken(response.data.token);
      
      // Ambil profile menggunakan server-client yang akan otomatis pasang header Authorization
      const profileResponse = await fetchApi<any>("profile");
      const profile = profileResponse.data;
      
      const role = profile.role || "user";
      const status = profile.verification_status || (profile.is_active === false ? "inactive" : "active");
      await setUserRole(role, status);

      return { success: true, user: profile };
    }
    
    return { success: false, message: "Gagal login. Token tidak ditemukan." };
  } catch (error: any) {
    return { success: false, message: error.message || "Email atau password salah." };
  }
}

export async function registerAction(formData: FormData) {
  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const privacyConsent = formData.get("privacy_consent") === "on";

  if (!fullName || !email || !password || !privacyConsent) {
    return { success: false, message: "Semua kolom wajib diisi dan persetujuan privasi wajib dicentang." };
  }

  try {
    const response = await fetchApi<{ token: string; user: any }>("register", {
      method: "POST",
      body: JSON.stringify({
        full_name: fullName,
        email,
        password,
        privacy_consent: privacyConsent,
      }),
    });

    if (response.data && response.data.token) {
      await setAuthToken(response.data.token);

      const profileResponse = await fetchApi<any>("profile");
      const profile = profileResponse.data;
      
      const role = profile.role || "user";
      const status = profile.verification_status || (profile.is_active === false ? "inactive" : "active");
      await setUserRole(role, status);

      return { success: true, user: profile };
    }

    return { success: false, message: "Gagal registrasi." };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal registrasi. Email mungkin sudah terdaftar." };
  }
}

export async function logoutAction() {
  try {
    await fetchApi("logout", { method: "POST" });
  } catch (error) {
    console.error("Gagal logout di sisi server:", error);
  } finally {
    await removeAuthToken();
  }
  return { success: true };
}
