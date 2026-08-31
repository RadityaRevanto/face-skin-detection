"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

import type { NotificationBellProps } from "../lib/NotificationTypes";
import { useNotificationBell } from "../hooks/useNotificationBell";
import { NotificationModal } from "./NotificationModal";

function formatNotificationTime(dateStr: string) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  }).format(new Date(dateStr));
}

/** Ikon lonceng notifikasi + dropdown (state via useNotificationBell). */
export function NotificationBell({ userId, userUuid }: NotificationBellProps) {
  const pathname = usePathname();

  const basePath = pathname.startsWith("/doctor")
    ? "/doctor"
    : pathname.startsWith("/admin")
      ? "/admin"
      : "/user";

  const {
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
  } = useNotificationBell({ userId, userUuid, basePath });

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
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Dropdown / Modal */}
      {isOpen && (
        <NotificationModal
          notifications={notifications}
          unreadCount={unreadCount}
          isLoading={isLoading}
          basePath={basePath}
          formatTime={formatNotificationTime}
          markAllAsRead={markAllAsRead}
          markAsRead={markAsRead}
          deleteNotification={deleteNotification}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
