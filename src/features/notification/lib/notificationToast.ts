import type { NotificationData, NotificationCategory } from "./NotificationTypes";
import { resolveActionUrl } from "../services/notificationService";

export type ToastVariant = "success" | "error" | "info" | "warning" | "default";

const CATEGORY_BADGE: Record<string, { label: string; className: string }> = {
  welcome: { label: "Info", className: "bg-sky-50 text-sky-600" },
  scan_complete: { label: "Scan", className: "bg-emerald-50 text-emerald-600" },
  chat_message: { label: "Chat", className: "bg-violet-50 text-violet-600" },
  logout: { label: "Logout", className: "bg-slate-100 text-slate-600" },
  verification_approved: { label: "Verifikasi", className: "bg-emerald-50 text-emerald-600" },
  verification_rejected: { label: "Verifikasi", className: "bg-rose-50 text-rose-600" },
  verification_revision: { label: "Verifikasi", className: "bg-amber-50 text-amber-600" },
  subscription_active: { label: "Langganan", className: "bg-emerald-50 text-emerald-600" },
};

/**
 * Backend `type` field (success/warning/error/info) == Sonner toast variant.
 */
export function getToastVariant(notification: NotificationData): ToastVariant {
  return notification.type ?? "default";
}

export function getCategoryBadge(category: NotificationCategory): { label: string; className: string } {
  return CATEGORY_BADGE[category] ?? { label: "Umum", className: "bg-slate-100 text-slate-600" };
}

/**
 * Translate backend action_url + category ke frontend route.
 */
export function getNotificationHref(notification: NotificationData, basePath: string): string | null {
  return resolveActionUrl(notification.category, notification.action_url, basePath);
}
