"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { NotificationData } from "../lib/NotificationTypes";
import { useRealtimeNotifications } from "./useRealtimeNotifications";
import { notificationService } from "../services/notificationService";
const POLL_INTERVAL_MS = 60_000;

export type UseNotificationBellArgs = {
  userId?: string | number | null;
  userUuid?: string | null;
  basePath: string;
};

/**
 * Logic NotificationBell: fetch + polling notifikasi, sync state lintas
 * halaman via DOM events, realtime Echo, dan aksi read/delete.
 * Komponen UI tinggal konsumsi state + handler dari hook ini.
 */
export function useNotificationBell({
  userId,
  userUuid,
  basePath,
}: UseNotificationBellArgs) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Sync state dengan halaman notifikasi via DOM events.
  useEffect(() => {
    const handleReadAll = () => {
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
    };

    const handleReadSingle = (e: Event) => {
      const { id } = (e as CustomEvent<{ id: string }>).detail;
      setNotifications((prev) => {
        const target = prev.find((n) => n.id === id);
        if (target && !target.is_read) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n));
      });
    };

    const handleDeleteSingle = (e: Event) => {
      const { id } = (e as CustomEvent<{ id: string }>).detail;
      setNotifications((prev) => {
        const target = prev.find((n) => n.id === id);
        if (target && !target.is_read) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n.id !== id);
      });
    };

    window.addEventListener("notificationsReadAll", handleReadAll);
    window.addEventListener("notificationReadSingle", handleReadSingle);
    window.addEventListener("notificationDeletedSingle", handleDeleteSingle);

    return () => {
      window.removeEventListener("notificationsReadAll", handleReadAll);
      window.removeEventListener("notificationReadSingle", handleReadSingle);
      window.removeEventListener("notificationDeletedSingle", handleDeleteSingle);
    };
  }, []);

  // Ambil daftar + jumlah belum dibaca via service terpusat.
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const [listRes, countRes] = await Promise.all([
        notificationService.list({ per_page: 10 }),
        notificationService.unreadCount(),
      ]);

      if (listRes.data && Array.isArray(listRes.data)) {
        setNotifications(listRes.data);
      }
      if (typeof countRes === "number") {
        setUnreadCount(countRes);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch awal + polling fallback tiap 60 detik.
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Realtime via Echo: prepend notifikasi baru.
  const handleNewNotification = useCallback((notification: NotificationData) => {
    setUnreadCount((prev) => prev + 1);
    setNotifications((prev) => {
      if (prev.some((n) => n.id === notification.id)) return prev;
      return [notification, ...prev];
    });
  }, []);

  useRealtimeNotifications({ userId, userUuid, basePath, onNewNotification: handleNewNotification });

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
      window.dispatchEvent(new Event("notificationsReadAll"));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      window.dispatchEvent(new CustomEvent("notificationReadSingle", { detail: { id } }));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationService.remove(id);
      const deletedItem = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (deletedItem && !deletedItem.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      window.dispatchEvent(new CustomEvent("notificationDeletedSingle", { detail: { id } }));
    } catch (err) {
      console.error(err);
    }
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    isOpen,
    setIsOpen,
    isLoading,
    dropdownRef,
    fetchNotifications,
    markAllAsRead,
    markAsRead,
    deleteNotification,
  };
}
