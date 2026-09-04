import { api } from "@/lib/api";
import { fetchEnvelope } from "@/lib/api/handlers";

import type {
  NotificationCategory,
  NotificationData,
} from "../lib/NotificationTypes";

export type { NotificationData } from "../lib/NotificationTypes";

/**
 * BE memakai `?limit=` (bukan per_page standar) dengan cap 50 + `?page=`.
 * Meta menambah `unread_count`.
 */
export type NotificationListMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  unread_count: number;
};

export type NotificationListResponse = {
  data: NotificationData[];
  meta?: NotificationListMeta;
};

export type NotificationQueryParams = {
  page?: number;
  /** Jumlah item per halaman — BE cap 50. */
  limit?: number;
  unread_only?: boolean;
};

/** Response markRead — BE return {message, data: NotificationResource}. */
export type MarkReadResponse = {
  message: string;
  data: NotificationData;
};

export const notificationService = {
  list: (params?: NotificationQueryParams): Promise<NotificationListResponse> =>
    fetchEnvelope<NotificationData[], NotificationListMeta>("/notifications", { params }),

  /** BE return `{ unread_count }` polos — tanpa envelope {data, meta}. */
  unreadCount: async (): Promise<number> => {
    const response = await api.get<{ unread_count: number }>(
      "/notifications/unread-count",
    );
    return response.data?.unread_count ?? 0;
  },

  /** BE return `{ message, updated }` polos. */
  markAllRead: async (): Promise<{ message: string; updated: number }> => {
    const response = await api.post<{ message: string; updated: number }>(
      "/notifications/read-all",
    );
    return response.data;
  },

  /** BE return `{ message, data }` polos (bukan envelope meta). */
  markRead: async (id: string): Promise<MarkReadResponse> => {
    const response = await api.post<MarkReadResponse>(`/notifications/${id}/read`);
    return response.data;
  },

  /** BE return `{ message }` polos. */
  destroy: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/notifications/${id}`);
    return response.data;
  },

  remove: (id: string): Promise<{ message: string }> =>
    (async () => notificationService.destroy(id))(),
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
