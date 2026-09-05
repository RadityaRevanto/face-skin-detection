import { fetchEnvelope, mutate } from "@/lib/api/handlers";
import type { ApiEnvelope } from "@/lib/api/envelope";
import { paginationParams } from "@/lib/api/envelope";
import { api } from "@/lib/api";

export type Profile = {
  uuid: string;
  full_name: string;
  email: string;
  role: "user" | "doctor" | "admin";
  gender?: string | null;
  date_of_birth?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  google_avatar_url?: string | null;
  is_active?: boolean;
  verification_status?: string;
  email_verified?: boolean;
  profile_completed?: boolean;
  [key: string]: unknown;
};

export type ProfileUpdateResult = {
  uuid: string;
  full_name: string;
  avatar_url: string | null;
  google_avatar_url: string | null;
  date_of_birth: string | null;
  gender: string | null;
  profile_completed: boolean;
};

/** Bentuk LoginActivityResource (BE): device & location sudah di-resolve BE. */
export type LoginActivityResult = {
  uuid: string;
  device: string;
  ip_address: string | null;
  location: string | null;
  is_current: boolean;
  last_used_at: string | null;
  created_at: string | null;
};

/** Resource::collection tanpa paginator → `{ data: [...] }` polos. */
export type LoginActivityResponse = { data: LoginActivityResult[] };

export type profileServiceType = {
  get: () => Promise<Profile>;
  update: (payload: FormData | Record<string, unknown>) => Promise<ApiEnvelope<ProfileUpdateResult>>;
  destroy: () => Promise<ApiEnvelope<null>>;
  changePassword: (payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => Promise<ApiEnvelope<null>>;
  deleteAvatar: () => Promise<ApiEnvelope<{ avatar_url: string | null; google_avatar_url: string | null }>>;
  requestExport: () => Promise<ApiEnvelope<{ download_url: string; expires_in_minutes: number }>>;
  downloadExport: (downloadUrl: string) => Promise<void>;
  loginActivity: (page?: number, perPage?: number) => Promise<LoginActivityResponse>;
  revokeSession: (tokenId: string) => Promise<ApiEnvelope<null>>;
};

export const profileService: profileServiceType = {
  get: async (): Promise<Profile> => {
    const envelope = await fetchEnvelope<Profile>("/profile");
    return envelope.data;
  },

  update: (payload) => mutate("patch", "/profile", payload),

  destroy: () => mutate<null>("delete", "/profile"),

  changePassword: (payload) => mutate("post", "/profile/change-password", payload),

  deleteAvatar: () => mutate("delete", "/profile/avatar"),

  requestExport: () => mutate("post", "/profile/export"),

  /**
   * GET /profile/exports/download — signed URL TAPI masih di dalam middleware
   * auth:sanctum → wajib header Authorization. Unduh sebagai blob lalu trigger
   * save file (file dihapus BE setelah unduhan pertama).
   */
  downloadExport: async (downloadUrl: string): Promise<void> => {
    const response = await api.get(downloadUrl, { responseType: "blob" });
    const disposition = response.headers?.["content-disposition"] ?? "";
    const match = disposition.match(/filename="?([^";]+)"?/);
    const filename = match?.[1] ?? `skincek-export-${Date.now()}.json`;

    const url = URL.createObjectURL(response.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },

  loginActivity: (page?: number, perPage?: number) =>
    fetchEnvelope<LoginActivityResult[]>("/login-activity", {
      // Resource::collection tanpa paginator — page/per_page diabaikan BE,
      // dikirim hanya untuk konsistensi kontrak pagination.
      params: paginationParams(page ?? 1, perPage),
    }),

  revokeSession: (tokenId: string) => mutate<null>("delete", `/login-activity/${tokenId}`),
};
