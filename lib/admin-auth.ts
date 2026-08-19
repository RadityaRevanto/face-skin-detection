import { redirect } from "next/navigation";

import { fetchApi } from "@/lib/api/server-client";
import { removeAuthToken } from "@/lib/auth/token";

interface ProfileApi {
  id: string;
  uuid: string;
  role: string;
  is_active?: boolean;
}

export async function requireAdminProfile() {
  try {
    const res = await fetchApi<ProfileApi>("/profile");
    const profile = res.data;

    if (!profile || profile.role !== "admin" || profile.is_active === false) {
      redirect("/login?clear_session=true");
    }

    return profile;
  } catch (error) {
    redirect("/login?clear_session=true");
  }
}
