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
  [key: string]: unknown;
};

export type LoginActivityResult = {
  uuid: string;
  token_name?: string;
  ip_address?: string | null;
  user_agent?: string | null;
  last_used_at?: string | null;
  created_at?: string;
  current?: boolean;
  [key: string]: unknown;
};

export type LoginActivityResponse = {
  data: LoginActivityResult[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export const profileService = {
  get: async (): Promise<Profile> => {
    const response = await api.get("/profile");
    return response.data.data;
  },

  update: async (payload: FormData | Record<string, unknown>): Promise<Profile> => {
    const response = await api.patch("/profile", payload);
    return response.data.data;
  },

  destroy: async (): Promise<void> => {
    await api.delete("/profile");
  },

  changePassword: async (payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => {
    const response = await api.post("/profile/change-password", payload);
    return response.data;
  },

  deleteAvatar: async (): Promise<void> => {
    await api.delete("/profile/avatar");
  },

  requestExport: async () => {
    const response = await api.post("/profile/export");
    return response.data;
  },

  loginActivity: async (params?: { page?: number; per_page?: number }) => {
    const response = await api.get<LoginActivityResponse>("/login-activity", {
      params,
    });
    return response.data;
  },

  revokeSession: async (tokenId: string) => {
    const response = await api.delete(`/login-activity/${tokenId}`);
    return response.data;
  },
};
