"use client";

import { useEffect } from "react";

import { getEcho } from "@/lib/echo";

import type { NotificationData } from "../lib/NotificationTypes";
import { useAppToast } from "./useAppToast";

type UseRealtimeNotificationsOptions = {
  userId?: number | string | null;
  userUuid?: string | null;
  basePath: string;
  onNewNotification: (notification: NotificationData) => void;
};

/**
 * Subscribe ke private channel `user.{uuid}` (Reverb) dan teruskan
 * setiap `BroadcastNotificationCreated` ke hook terpusat useAppToast.
 * WebSocket/Echo setup tetap di sini — pemetaan varian & tampilan
 * toast ada di useAppToast.
 */
export function useRealtimeNotifications({
  userId,
  userUuid,
  basePath,
  onNewNotification,
}: UseRealtimeNotificationsOptions) {
  const { showNotificationToast } = useAppToast({ basePath, onNewNotification });

  useEffect(() => {
    if (!userId && !userUuid) return;

    try {
      const echo = getEcho();
      if (!echo) return;

      const handleNewNotification = (notification: NotificationData) => {
        showNotificationToast(notification);
      };

      // Backend broadcast notifikasi ke PrivateChannel('user.{uuid}')
      // via receivesBroadcastNotificationsOn() pada model User.
      let uuidChannel: any;

      if (userUuid) {
        uuidChannel = echo.private(`user.${userUuid}`);
        uuidChannel.notification(handleNewNotification);
        uuidChannel.listen(".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated", handleNewNotification);
      }

      return () => {
        if (uuidChannel) {
          uuidChannel.stopListening(".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated");
          echo.leave(`user.${userUuid}`);
        }
      };
    } catch (err) {
      console.error("WebSocket subscription error:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, userUuid, basePath]);
}
