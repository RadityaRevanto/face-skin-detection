import { redirect } from "next/navigation";

import { fetchApi } from "@/lib/api/server-client";
import { removeAuthToken } from "@/lib/auth/token";

interface ProfileApi {
  id: string;
  uuid: string;
  role: string;
  is_active?: boolean;
}

export async function requireDoctorProfile() {
  try {
    const res = await fetchApi<ProfileApi>("/profile");
    const profile = res.data;

    if (!profile || profile.role !== "doctor") {
      redirect("/login?clear_session=true");
    }

    if (profile.is_active === false) {
      redirect("/doctor/verification-status");
    }

    return profile;
  } catch (error) {
    redirect("/login?clear_session=true");
  }
}
