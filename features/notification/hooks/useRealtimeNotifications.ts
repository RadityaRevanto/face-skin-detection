"use client";

import { useEffect, useRef } from "react";

import { getEcho } from "@/lib/echo";

import type { NotificationData } from "../lib/NotificationTypes";
import { useAppToast } from "./useAppToast";

type UseRealtimeNotificationsOptions = {
  userId?: number | string | null;
  userUuid?: string | null;
  basePath: string;
  onNewNotification: (notification: NotificationData) => void;
};

const seenNotificationIds = new Set<string>();

function markAsSeen(id: string) {
  seenNotificationIds.add(id);
}

function isAlreadySeen(id: string): boolean {
  return seenNotificationIds.has(id);
}

/**
 * Subscribe ke private channel `user.{uuid}` (Reverb) dan trigger
 * toast Sonner saat notifikasi baru masuk via WebSocket.
 *
 * - Hanya Echo-delivered notifications yang trigger toast (bukan REST polling)
 * - Deduplication: notifikasi yang sudah pernah dilihat tidak trigger toast lagi
 * - Backend event name: `.notification.new` (bukan BroadcastNotificationCreated)
 */
export function useRealtimeNotifications({
  userId,
  userUuid,
  basePath,
  onNewNotification,
}: UseRealtimeNotificationsOptions) {
  const { showNotificationToast } = useAppToast({ basePath, onNewNotification });
  const echoSubscribedRef = useRef(false);

  useEffect(() => {
    if (!userId && !userUuid) return;

    let uuidChannel: any = null;

    try {
      const echo = getEcho();
      if (!echo) return;

      if (echoSubscribedRef.current) return;
      echoSubscribedRef.current = true;

      const handleNewNotification = (rawPayload: any) => {
        const notification: NotificationData = rawPayload?.notification ?? rawPayload;
        if (!notification || !notification.id) return;

        const strId = String(notification.id);

        onNewNotification(notification);

        if (isAlreadySeen(strId)) return;
        markAsSeen(strId);
        showNotificationToast(notification);
      };

      if (userUuid) {
        uuidChannel = echo.private(`user.${userUuid}`);
        uuidChannel.listen(".notification.new", handleNewNotification);
      }

      return () => {
        echoSubscribedRef.current = false;
        if (uuidChannel) {
          uuidChannel.stopListening(".notification.new");
          echo.leaveChannel(`private-user.${userUuid}`);
        }
      };
    } catch (err) {
      console.error("WebSocket subscription error:", err);
      echoSubscribedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, userUuid, basePath]);
}
