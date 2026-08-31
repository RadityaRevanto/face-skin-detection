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

export const ACTIVITY_EVENT_COLORS: Record<string, string> = {
  created: "bg-emerald-100 text-emerald-700",
  updated: "bg-blue-100 text-blue-700",
  deleted: "bg-rose-100 text-rose-700",
  login: "bg-purple-100 text-purple-700",
  logout: "bg-slate-100 text-slate-700",
  verified: "bg-cyan-100 text-cyan-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};
