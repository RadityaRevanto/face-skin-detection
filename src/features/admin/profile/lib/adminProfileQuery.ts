import { requireAdminProfile } from "@/lib/admin-auth";
import { fetchApi } from "@/lib/api/server-client";

import type { AdminProfileData } from "./adminProfileTypes";

export async function getAdminProfileData(): Promise<AdminProfileData | null> {
  await requireAdminProfile();

  try {
    const res = await fetchApi<AdminProfileData>("/admin/profile");
    return res.data ?? null;
  } catch (error) {
    console.error("Failed to fetch admin profile:", error);
    return null;
  }
}
