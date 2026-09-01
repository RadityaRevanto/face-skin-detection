import { api } from "@/lib/api";

import type {
  NotificationCategory,
  NotificationData,
} from "../lib/NotificationTypes";

export type { NotificationData } from "../lib/NotificationTypes";

export type NotificationListResponse = {
  data: NotificationData[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    unread_count?: number;
  };
};

export const notificationService = {
  list: async (params?: {
    page?: number;
    per_page?: number;
    unread_only?: boolean;
  }): Promise<NotificationListResponse> => {
    const response = await api.get("/notifications", { params });
    return response.data;
  },

  unreadCount: async (): Promise<number> => {
    // Endpoint ini mengembalikan { unread_count } tanpa envelope {data}.
    const response = await api.get("/notifications/unread-count");
    return response.data?.unread_count ?? 0;
  },

  markAllRead: async () => {
    const response = await api.post("/notifications/read-all");
    return response.data;
  },

  markRead: async (id: string) => {
    const response = await api.post(`/notifications/${id}/read`);
    return response.data;
  },

  destroy: async (id: string) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

/** Resolve URL tujuan notifikasi berdasarkan kategori (mapping UI navigation). */
export function resolveActionUrl(
  category: NotificationCategory,
  actionUrl: string | null,
  basePath: string,
): string | null {
  if (!actionUrl) return null;

  switch (category) {
    case "scan_complete": {
      // User sudah di /user/scan — jangan auto-navigate.
      return null;
    }
    case "chat_message": {
      // action_url berisi UUID conversation (bukan UUID dokter).
      // User → buka percakapan di /user/chats?c=<uuid>.
      // Doctor → buka halaman konsultasi dokter (chat container sendiri).
      const uuid = actionUrl.split("/").pop();
      if (!uuid) return null;
      return basePath.startsWith("/doctor")
        ? "/doctor/consultations"
        : `/user/chats?c=${uuid}`;
    }
    case "verification_approved":
    case "verification_rejected":
    case "verification_revision":
      return "/doctor/verification-status";
    case "subscription_active":
      return "/user/subscription";
    case "welcome":
    case "logout":
    default:
      return null;
  }
}
