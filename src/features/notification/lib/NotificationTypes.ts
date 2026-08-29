export type NotificationType =
  | "welcome"
  | "chat"
  | "logout"
  | "scan"
  | "verification"
  | "subscription"
  | "general";

export type NotificationData = {
  id: string;
  title?: string;
  body?: string;
  read_at: string | null;
  created_at: string;
  /** Field payload berada di level root (bukan nested di data) — sesuai backend AppNotification. */
  notification_type?: NotificationType;
  prediction_id?: string;
  conversation_id?: string;
  verification_status?: string;
  subscription_id?: string;
  data?: {
    title?: string;
    body?: string;
    conversation_id?: string;
    notification_type?: NotificationType;
    prediction_id?: string;
    verification_status?: string;
    subscription_id?: string;
  };
};

export interface NotificationBellProps {
  userId?: number | string | null;
  userUuid?: string | null;
}
