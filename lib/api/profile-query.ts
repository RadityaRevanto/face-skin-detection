import { api } from "@/lib/api";

export type UserProfile = {
  uuid: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  google_avatar_url: string | null;
  date_of_birth: string | null;
  gender: "laki_laki" | "perempuan" | null;
  profile_completed: boolean;
  email_verified: boolean;

  // Role user
  subscription_status?: "Pro" | "Free";
  scan_count?: number;
  user_messages_count?: number;
  remaining_free_messages?: number;

  // Role doctor
  verification_status?: "pending" | "approved" | "rejected" | "needs_revision" | "unverified";
  product_count?: number;
  recommendation_count?: number;
};

type ProfileEnvelope = { data: UserProfile };

export async function getProfile() {
  const response = await api.get<ProfileEnvelope>("/profile");
  return response.data;
}

export async function updateProfile(payload: FormData) {
  const response = await api.patch("/profile", payload);
  return response.data;
}

export async function deleteAvatar() {
  const response = await api.delete("/profile/avatar");
  return response.data;
}
