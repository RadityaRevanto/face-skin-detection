"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

import type { NotificationBellProps, NotificationData } from "../lib/NotificationTypes";
import { useRealtimeNotifications } from "../hooks/useRealtimeNotifications";
import { notificationService } from "../services/notificationService";
import { NotificationModal } from "./NotificationModal";

const POLL_INTERVAL_MS = 60_000;

export function NotificationBell({ userId, userUuid }: NotificationBellProps) {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const basePath = pathname.startsWith("/doctor")
    ? "/doctor"
    : pathname.startsWith("/admin")
      ? "/admin"
      : "/user";

  // Close dropdown when clicking outside
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

  // Sync state with NotificationsPage via DOM events
  useEffect(() => {
    const handleReadAll = () => {
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
    };

    const handleReadSingle = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      const { id } = customEvent.detail;
      setNotifications((prev) => {
        const target = prev.find((n) => n.id === id);
        if (target && !target.is_read) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n));
      });
    };

    const handleDeleteSingle = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      const { id } = customEvent.detail;
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

  // Fetch notifications via centralized service
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
      if (typeof countRes.unread_count !== "undefined") {
        setUnreadCount(countRes.unread_count);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch + polling fallback (60s)
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Realtime via Echo: prepend notification + toast
  const handleNewNotification = useCallback((notification: NotificationData) => {
    setUnreadCount((prev) => prev + 1);
    setNotifications((prev) => {
      if (prev.some((n) => n.id === notification.id)) return prev;
      return [notification, ...prev];
    });
  }, []);

  useRealtimeNotifications({ userId, userUuid, basePath, onNewNotification: handleNewNotification });

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
      window.dispatchEvent(new Event("notificationsReadAll"));
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      window.dispatchEvent(new CustomEvent("notificationReadSingle", { detail: { id } }));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id: string) => {
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
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    }).format(d);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && notifications.length === 0) {
            fetchNotifications();
          }
        }}
        className="relative p-2 text-slate-500 hover:text-emerald-600 transition-colors rounded-full hover:bg-slate-100 focus:outline-none"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Overlay for mobile modal */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Dropdown / Modal */}
      {isOpen && (
        <NotificationModal
          notifications={notifications}
          unreadCount={unreadCount}
          isLoading={isLoading}
          basePath={basePath}
          formatTime={formatTime}
          markAllAsRead={markAllAsRead}
          markAsRead={markAsRead}
          deleteNotification={deleteNotification}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
