import type { NotificationData, NotificationType } from "./NotificationTypes";

export type ToastVariant = "success" | "error" | "info" | "default";
const TOAST_VARIANTS: Record<NotificationType, ToastVariant> = {
  welcome: "info",
  chat: "info",
  logout: "info",
  scan: "success",
  verification: "success",
  subscription: "success",
  general: "default",
};

export function getNotificationType(notification: NotificationData): NotificationType {
  return notification.notification_type ?? notification.data?.notification_type ?? "general";
}

export function getToastVariant(notification: NotificationData): ToastVariant {
  const type = getNotificationType(notification);

  if (type === "verification" && notification.verification_status === "rejected") {
    return "error";
  }

  return TOAST_VARIANTS[type];
}

export function getNotificationHref(notification: NotificationData, basePath: string): string | null {
  const type = getNotificationType(notification);

  const conversationId = notification.conversation_id ?? notification.data?.conversation_id;
  const predictionId = notification.prediction_id ?? notification.data?.prediction_id;

  switch (type) {
    case "chat":
      return conversationId ? `/user/consultations/${conversationId}` : null;
    case "scan":
      return predictionId ? `${basePath}/history/${predictionId}` : null;
    case "verification":
      return "/doctor/verification-status";
    case "subscription":
      return "/user/subscription";
    case "welcome":
    case "logout":
    case "general":
    default:
      return null;
  }
}
