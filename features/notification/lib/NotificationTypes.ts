/**
 * Visual notification type — sesuai backend NotificationType enum
 * (success / warning / error / info). Digunakan untuk warna toast & badge.
 */
export type NotificationType = "success" | "warning" | "error" | "info";

/**
 * Business notification category — sesuai backend NotificationCategory enum.
 * Menentukan routing action & badge label.
 */
export type NotificationCategory =
  | "welcome"
  | "scan_complete"
  | "chat_message"
  | "logout"
  | "verification_approved"
  | "verification_rejected"
  | "verification_revision"
  | "subscription_active";

/**
 * Notification data shape — langsung dari backend NotificationResource.
 */
export type NotificationData = {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  action_url: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
};

export interface NotificationBellProps {
  userId?: number | string | null;
  userUuid?: string | null;
}
