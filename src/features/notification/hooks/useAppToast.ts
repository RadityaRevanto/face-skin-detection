"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { customToast } from "@/lib/custom-toast";
import type { NotificationData } from "../lib/NotificationTypes";
import type { ToastVariant } from "../lib/notificationToast";
import { getNotificationHref, getToastVariant } from "../lib/notificationToast";

type UseAppToastOptions = {
  /** Base path sesuai role (/user, /doctor, /admin) untuk routing notifikasi scan. */
  basePath: string;
  onNewNotification?: (notification: NotificationData) => void;
};

/**
 * Integration point terpusat untuk memicu toast Sonner dari event
 * real-time BE (welcome / chat / logout / scan / verification /
 * subscription / general). Varian & routing otomatis dipetakan dari
 * `category` payload backend.
 */
export function useAppToast({ basePath, onNewNotification }: UseAppToastOptions) {
  const router = useRouter();

  const showNotificationToast = useCallback(
    (notification: NotificationData) => {
      onNewNotification?.(notification);

      const variant: ToastVariant = getToastVariant(notification);
      const href = getNotificationHref(notification, basePath);

      const opts = {
        description: notification.message,
      };

      switch (variant) {
        case "success":
          customToast.success(notification.title, opts);
          break;
        case "error":
          customToast.error(notification.title, opts);
          break;
        case "info":
          customToast.info(notification.title, opts);
          break;
        case "warning":
          customToast.warning(notification.title, opts);
          break;
        default:
          customToast.info(notification.title, opts);
      }

      // Navigate ke action_url setelah toast muncul
      if (href) {
        setTimeout(() => router.push(href), 300);
      }
    },
    [basePath, onNewNotification, router],
  );

  return { showNotificationToast };
}
