export type ActivityLog = {
  id: string;
  causer_type: string;
  causer_id: string;
  causer_name: string;
  event: string;
  description: string;
  properties: Record<string, unknown>;
  created_at: string;
};

export type ActivityLogListResponse = {
  data: ActivityLog[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type ActivityLogEvent =
  | "created"
  | "updated"
  | "deleted"
  | "login"
  | "logout"
  | "verified"
  | "approved"
  | "rejected";

export const ACTIVITY_EVENT_LABELS: Record<string, string> = {
  created: "Dibuat",
  updated: "Diupdate",
  deleted: "Dihapus",
  login: "Login",
  logout: "Logout",
  verified: "Terverifikasi",
  approved: "Disetujui",
  rejected: "Ditolak",
};
