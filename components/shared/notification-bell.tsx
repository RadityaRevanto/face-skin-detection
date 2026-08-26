"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Bell, Check, Trash2, X } from "lucide-react";
import { getEcho } from "@/lib/echo";

export type NotificationData = {
  id: string;
  title?: string;
  body?: string;
  read_at: string | null;
  created_at: string;
  data?: {
    title?: string;
    body?: string;
    conversation_id?: string;
  };
};

interface NotificationBellProps {
  userId?: number | string | null;
  userUuid?: string | null;
}

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
      const res = await fetch("/api/notifications?per_page=15");
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

      const handleNewNotification = (e: any) => {
        fetchNotifications();
      };

      let channel: any;
      let uuidChannel: any;

      if (userId) {
        channel = echo.private(`App.Models.User.${userId}`);
        channel.notification(handleNewNotification);
      }

      if (userUuid) {
        uuidChannel = echo.private(`user.${userUuid}`);
        uuidChannel.notification(handleNewNotification);
        uuidChannel.listen(".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated", handleNewNotification);
      }
      
      return () => {
        if (channel) {
          channel.stopListening("Illuminate\\Notifications\\Events\\BroadcastNotificationCreated");
          echo.leave(`App.Models.User.${userId}`);
        }
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
        <div
          className={`
            fixed md:absolute right-0 z-50 flex flex-col bg-white overflow-hidden shadow-2xl transition-all
            
            /* Mobile: Fullscreen sliding from bottom or center */
            bottom-0 left-0 w-full h-[85vh] rounded-t-3xl md:bottom-auto md:left-auto
            
            /* Desktop: Dropdown */
            md:top-full md:mt-3 md:w-80 md:h-auto md:max-h-125 md:rounded-2xl md:border md:border-slate-100
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="font-bold text-slate-900">Notifikasi</h3>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <Check size={14} /> Tandai dibaca
                </button>
              )}
              <button
                className="md:hidden text-slate-400 hover:text-slate-600 p-1"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
            {isLoading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="bg-slate-50 p-3 rounded-full mb-3 text-slate-300">
                  <Bell size={24} />
                </div>
                <p className="text-sm font-medium text-slate-900">Belum ada notifikasi</p>
                <p className="text-xs text-slate-500 mt-1">Notifikasi baru akan muncul di sini</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {notifications.map((notif) => {
                  const title = notif.title || notif.data?.title || "Notifikasi Baru";
                  const body = notif.body || notif.data?.body || "";
                  const isRead = !!notif.read_at;

                  return (
                    <div
                      key={notif.id}
                      className={`group relative flex gap-3 rounded-xl p-3 transition-colors ${
                        isRead ? "bg-white hover:bg-slate-50" : "bg-emerald-50/50 hover:bg-emerald-50"
                      }`}
                    >
                      {!isRead && (
                        <div className="absolute top-4 left-2 h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                      <div className={`flex-1 ${!isRead ? "pl-3" : ""}`}>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm ${isRead ? "font-medium text-slate-700" : "font-semibold text-slate-900"}`}>
                            {title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-2 leading-relaxed">
                          {body}
                        </p>
                        <span className="text-[10px] font-medium text-slate-400">
                          {formatTime(notif.created_at)}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity absolute right-2 top-2">
                        {!isRead && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="p-1.5 text-emerald-600 bg-white rounded-md shadow-sm border border-emerald-100 hover:bg-emerald-50"
                            title="Tandai dibaca"
                          >
                            <Check size={12} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-1.5 text-rose-500 bg-white rounded-md shadow-sm border border-rose-100 hover:bg-rose-50"
                          title="Hapus"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Footer Link to Dedicated Page */}
          <div className="border-t border-slate-100 p-2 bg-slate-50/50">
            <a 
              href={`${basePath}/notifications`}
              onClick={() => setIsOpen(false)}
              className="block w-full py-2 text-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Lihat Semua Notifikasi
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
