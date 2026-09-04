import { fetchEnvelope, fetchPaginated, mutate } from "@/lib/api/handlers";
import type { ApiEnvelope, PaginationMeta } from "@/lib/api/envelope";
import { paginationParams } from "@/lib/api/envelope";
import type { SkincareProduct } from "@/features/skin-types/services/catalogService";

export type { PaginationMeta as ApiPaginationMeta };

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
  meta: PaginationMeta;
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

export type CreateAdminUserPayload = {
  full_name: string;
  email: string;
  password: string;
  role: "admin" | "doctor" | "user";
  is_active?: boolean;
  gender?: string | null;
  date_of_birth?: string | null;
};

export type UpdateAdminUserPayload = {
  full_name?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
  gender?: string | null;
  date_of_birth?: string | null;
};

export type ReviewStatus = "approved" | "rejected" | "needs_revision";

export type UsersQueryParams = {
  page?: number;
  per_page?: number;
  role?: string;
  search?: string;
};

export type ActivityLogQueryParams = {
  page?: number;
  per_page?: number;
  log_name?: string;
  causer_id?: string | number;
};

function cleanParams<T extends Record<string, unknown>>(params?: T): Partial<T> {
  if (!params) return {};
  const clean: Record<string, unknown> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      clean[key] = value;
    }
  });
  return clean as Partial<T>;
}

export const adminService = {
  /** GET /admin/dashboard — stats + charts + pending actions. */
  dashboard: async (): Promise<AdminDashboard> => {
    const envelope = await fetchEnvelope<AdminDashboard>("/admin/dashboard");
    return envelope.data;
  },

  /** GET /admin/profile — profil admin + last_login + summary. */
  adminProfile: async (): Promise<AdminUser> => {
    const envelope = await fetchEnvelope<AdminUser>("/admin/profile");
    return envelope.data;
  },

  /** GET /admin/users — UserResource::collection + filter ?role= & ?per_page=. */
  users: (params?: UsersQueryParams): Promise<AdminUserListResponse> =>
    fetchPaginated<AdminUser>("/admin/users", cleanParams(params)),

  /** POST /admin/users — buat user (role: admin|doctor|user). */
  createUser: (payload: CreateAdminUserPayload): Promise<ApiEnvelope<AdminUser>> =>
    mutate("post", "/admin/users", payload),

  /** GET /admin/users/{uuid} — detail + doctorVerification. */
  user: async (uuid: string): Promise<AdminUser> => {
    const envelope = await fetchEnvelope<AdminUser>(`/admin/users/${uuid}`);
    return envelope.data;
  },

  /** PATCH /admin/users/{uuid} — update data user. */
  updateUser: (uuid: string, payload: UpdateAdminUserPayload): Promise<ApiEnvelope<AdminUser>> =>
    mutate("patch", `/admin/users/${uuid}`, payload),

  /** DELETE /admin/users/{uuid} — soft delete; 422 jika hapus akun sendiri. */
  destroyUser: (uuid: string): Promise<ApiEnvelope<null>> =>
    mutate("delete", `/admin/users/${uuid}`),

  /** PATCH /admin/users/{uuid}/role — ubah role user. */
  assignRole: (uuid: string, role: string): Promise<ApiEnvelope<AdminUser>> =>
    mutate("patch", `/admin/users/${uuid}/role`, { role }),

  /** PATCH /admin/users/{uuid}/toggle-active — suspend / aktifkan. */
  toggleActive: (uuid: string): Promise<ApiEnvelope<AdminUser>> =>
    mutate("patch", `/admin/users/${uuid}/toggle-active`),

  /** GET /admin/activity-log — filter ?log_name= & ?causer_id=. */
  activityLog: (params?: ActivityLogQueryParams) =>
    fetchPaginated<Record<string, unknown>>("/admin/activity-log", cleanParams(params)),

  /** GET /admin/verifications — filter ?verification_status= (atau ?status=). */
  verifications: (params?: { status?: string; page?: number; per_page?: number }) =>
    fetchPaginated<DoctorVerificationSummary>("/admin/verifications", cleanParams(params)),

  /** GET /admin/verifications/{uuid} — detail verifikasi dokter. */
  verification: async (uuid: string): Promise<DoctorVerificationSummary> => {
    const envelope = await fetchEnvelope<DoctorVerificationSummary>(
      `/admin/verifications/${uuid}`,
    );
    return envelope.data;
  },

  /**
   * PATCH /doctor-verifications/{uuid}/review — approve / reject / revise.
   * Body BE: { status, rejection_reason? (wajib jika rejected),
   *            revision_note? (wajib jika needs_revision) }.
   * Response: DoctorVerificationResource — {data: {...}} tanpa meta.
   */
  reviewVerification: (
    uuid: string,
    status: ReviewStatus,
    note?: string,
  ): Promise<ApiEnvelope<DoctorVerificationSummary>> =>
    mutate("patch", `/doctor-verifications/${uuid}/review`, {
      status,
      ...(note
        ? status === "rejected"
          ? { rejection_reason: note }
          : { revision_note: note }
        : {}),
    }),

  /** GET /admin/skincare-products — list semua produk (admin view). */
  adminProducts: (page = 1, perPage?: number) =>
    fetchPaginated<SkincareProduct>(
      "/admin/skincare-products",
      paginationParams(page, perPage),
    ),

  pendingVerificationCount: async (): Promise<number> => {
    const page = await fetchPaginated<DoctorVerificationSummary>(
      "/admin/verifications",
      { status: "pending", per_page: 1, page: 1 },
    );
    return page.meta?.total ?? 0;
  },
};
