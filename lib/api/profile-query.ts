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

export async function getProfile() {
  const res = await fetch("/api/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?clear_session=true";
    return new Promise(() => {}); // Prevent execution
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal mengambil profil");
  }

  return res.json();
}

export async function updateProfile(payload: FormData) {
  const res = await fetch("/api/profile", {
    method: "PATCH",
    body: payload,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal memperbarui profil");
  }

  return res.json();
}

export async function deleteAvatar() {
  const res = await fetch("/api/profile/avatar", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal menghapus foto profil");
  }

  return res.json();
}
