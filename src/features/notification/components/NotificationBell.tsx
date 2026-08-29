"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { getEcho } from "@/lib/echo";
import type { NotificationBellProps, NotificationData } from "../lib/NotificationTypes";
import { NotificationModal } from "./NotificationModal";

export function NotificationBell({ userId, userUuid }: NotificationBellProps) {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Menentukan basePath (apakah /user, /doctor, atau /admin)
  const basePath = pathname.startsWith("/doctor")
    ? "/doctor"
    : pathname.startsWith("/admin")
      ? "/admin"
      : "/user";

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Sync state with NotificationsPage
  useEffect(() => {
    const handleReadAll = () => {
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
    };

    const handleReadSingle = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      const { id } = customEvent.detail;
      setNotifications((prev) => {
        const target = prev.find((n) => n.id === id);
        if (target && !target.read_at) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
      });
    };

    const handleDeleteSingle = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      const { id } = customEvent.detail;
      setNotifications((prev) => {
        const target = prev.find((n) => n.id === id);
        if (target && !target.read_at) {
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

  // Fetch initial notifications
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/notifications?per_page=10");
      const json = await res.json();

      if (json.data && Array.isArray(json.data)) {
        setNotifications(json.data);
      }
      if (json.meta && typeof json.meta.unread_count !== "undefined") {
        setUnreadCount(json.meta.unread_count);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Listen to WebSocket for real-time notifications
  useEffect(() => {
    if (!userId && !userUuid) return;

    try {
      const echo = getEcho();
      if (!echo) return;

      const handleNewNotification = () => {
        fetchNotifications();
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
  }, [userId, userUuid]);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
      setUnreadCount(0);
      setNotifications(notifications.map((n) => ({ ...n, read_at: new Date().toISOString() })));
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" });
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      const deletedItem = notifications.find((n) => n.id === id);
      setNotifications(notifications.filter((n) => n.id !== id));
      if (deletedItem && !deletedItem.read_at) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
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
