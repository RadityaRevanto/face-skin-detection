import { api } from "@/lib/api";

/** Meta pagination standar BE SkinCek. */
export type ApiPaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type AdminUser = {
  uuid: string;
  id?: number | string;
  full_name: string;
  email: string;
  role: string;
  is_active?: boolean;
  avatar_url?: string | null;
  google_avatar_url?: string | null;
  created_at?: string;
  email_verified_at?: string | null;
  gender?: string | null;
  date_of_birth?: string | null;
  phone?: string | null;
};

export type AdminUserListResponse = {
  data: AdminUser[];
  meta: ApiPaginationMeta;
};

export type AdminDashboard = {
  total_users?: number;
  total_doctors?: number;
  total_scans?: number;
  pending_verifications?: number;
  [key: string]: unknown;
};

export type DoctorVerificationSummary = {
  id: string | number;
  uuid: string;
  specialization: string;
  str_number?: string | null;
  documents?: { uuid: string; url: string; file_name: string }[];
  verification_status: string;
  created_at?: string | null;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
  doctor?: {
    id?: string | number;
    uuid?: string;
    full_name?: string;
    email?: string;
    avatar_url?: string | null;
  };
};

function cleanParams(params?: Record<string, unknown>): Record<string, unknown> {
  if (!params) return {};
  const clean: Record<string, unknown> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      clean[key] = value;
    }
  });
  return clean;
}

export const adminService = {
  dashboard: async (): Promise<AdminDashboard> => {
    const response = await api.get("/admin/dashboard");
    return response.data.data;
  },

  adminProfile: async (): Promise<AdminUser> => {
    const response = await api.get("/admin/profile");
    return response.data.data;
  },

  users: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    role?: string;
  }) => {
    const response = await api.get<AdminUserListResponse>("/admin/users", {
      params: cleanParams(params),
    });
    return response.data;
  },

  user: async (uuid: string): Promise<AdminUser> => {
    const response = await api.get(`/admin/users/${uuid}`);
    return response.data.data;
  },

  assignRole: async (uuid: string, role: string) => {
    const response = await api.patch(`/admin/users/${uuid}/role`, { role });
    return response.data;
  },

  toggleActive: async (uuid: string) => {
    const response = await api.patch(`/admin/users/${uuid}/toggle-active`);
    return response.data;
  },

  activityLog: async (params?: { page?: number; per_page?: number }) => {
    const response = await api.get("/admin/activity-log", {
      params: cleanParams(params),
    });
    return response.data;
  },

  verifications: async (params?: {
    status?: string;
    page?: number;
    per_page?: number;
  }) => {
    const response = await api.get("/admin/verifications", {
      params: cleanParams(params),
    });
    return response.data as {
      data: DoctorVerificationSummary[];
      meta: ApiPaginationMeta;
    };
  },

  verification: async (uuid: string): Promise<DoctorVerificationSummary> => {
    const response = await api.get(`/admin/verifications/${uuid}`);
    return response.data.data;
  },

  reviewVerification: async (
    uuid: string,
    status: "approved" | "rejected",
    reason?: string,
  ) => {
    const response = await api.patch(`/doctor-verifications/${uuid}/review`, {
      status,
      ...(reason ? { reason } : {}),
    });
    return response.data;
  },

  pendingVerificationCount: async (): Promise<number> => {
    const response = await api.get("/admin/verifications", {
      params: { status: "pending", per_page: 1 },
    });
    return response.data?.meta?.total ?? 0;
  },
};
