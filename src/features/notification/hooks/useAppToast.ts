"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
 * `notification_type` payload.
 */
export function useAppToast({ basePath, onNewNotification }: UseAppToastOptions) {
  const router = useRouter();

  const showNotificationToast = useCallback(
    (notification: NotificationData) => {
      onNewNotification?.(notification);

      const variant: ToastVariant = getToastVariant(notification);
      const href = getNotificationHref(notification, basePath);

      const title = notification.title ?? notification.data?.title ?? "Notifikasi Baru";
      const body = notification.body ?? notification.data?.body;

      const options = {
        description: body,
        action: href
          ? {
              label: "Lihat",
              onClick: () => router.push(href),
            }
          : undefined,
      };

      switch (variant) {
        case "success":
          toast.success(title, options);
          break;
        case "error":
          toast.error(title, options);
          break;
        case "info":
          toast.info(title, options);
          break;
        default:
          toast(title, options);
      }
    },
    [basePath, onNewNotification, router],
  );

  return { showNotificationToast };
}
