import type {
  NotificationData,
  NotificationCategory,
} from "../lib/NotificationTypes";

export type NotificationListParams = {
  page?: number;
  per_page?: number;
  unread_only?: boolean;
};

export type NotificationListResponse = {
  data: NotificationData[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    unread_count: number;
  };
};

export type UnreadCountResponse = {
  unread_count: number;
};

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `Request failed with status ${res.status}`);
  }

  return res.json();
}

function cleanParams(params?: NotificationListParams): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.per_page) searchParams.set("per_page", String(params.per_page));
  if (params.unread_only) searchParams.set("unread_only", "true");
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export const notificationService = {
  async list(params?: NotificationListParams): Promise<NotificationListResponse> {
    return apiFetch<NotificationListResponse>(
      `/api/notifications${cleanParams(params)}`,
    );
  },

  async unreadCount(): Promise<UnreadCountResponse> {
    return apiFetch<UnreadCountResponse>("/api/notifications/unread-count");
  },

  async markRead(
    id: string,
  ): Promise<{ data: NotificationData; message: string }> {
    return apiFetch(`/api/notifications/${id}/read`, { method: "POST" });
  },

  async markAllRead(): Promise<{ message: string; updated: number }> {
    return apiFetch("/api/notifications/read-all", { method: "POST" });
  },

  async remove(id: string): Promise<{ message: string }> {
    return apiFetch(`/api/notifications/${id}`, { method: "DELETE" });
  },
};

/**
 * Map backend NotificationCategory ke frontend route.
 * Backend action_url bersifat hint, frontend tetap butuh mapping
 * karena route structure berbeda (mis. /scan/history → /history).
 */
export function resolveActionUrl(
  category: NotificationCategory,
  actionUrl: string | null,
  basePath: string,
): string | null {
  if (!actionUrl) return null;

  switch (category) {
    case "scan_complete": {
      const uuid = actionUrl.split("/").pop();
      return uuid ? `/history/${uuid}` : null;
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
