"use client";

import { useEffect, useState } from "react";
import type { NotificationData } from "@/components/ui/notification-types";
import { NotificationItem } from "@/components/ui/notifications/notification-item";
import { NotificationsHeader } from "@/components/ui/notifications/notifications-header";
import { NotificationsLoading } from "@/components/ui/notifications/notifications-loading";
import { NotificationsEmpty } from "@/components/ui/notifications/notifications-empty";
import { NotificationsPagination } from "@/components/ui/notifications/notifications-pagination";

export function NotificationsContainer() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchNotifications = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/notifications?page=${page}&per_page=10`);
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) setNotifications(json.data);
      if (json.meta) { setCurrentPage(json.meta.current_page || 1); setLastPage(json.meta.last_page || 1); setTotal(json.meta.total || 0); }
    } catch (error) { console.error("Failed to fetch notifications:", error); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchNotifications(currentPage); }, [currentPage]);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
      setNotifications(notifications.map((n) => ({ ...n, read_at: new Date().toISOString() })));
      if (typeof window !== "undefined") window.dispatchEvent(new Event("notificationsReadAll"));
    } catch (err) { console.error(err); }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" });
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
      if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("notificationReadSingle", { detail: { id } }));
    } catch (err) { console.error(err); }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      setNotifications(notifications.filter((n) => n.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("notificationDeletedSingle", { detail: { id } }));
    } catch (err) { console.error(err); }
  };

  const formatTime = (dateStr: string) => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(dateStr));

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f7fbf8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <NotificationsHeader total={total} hasNotifications={notifications.length > 0} onMarkAllAsRead={markAllAsRead} />
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {isLoading && notifications.length === 0 ? <NotificationsLoading />
            : notifications.length === 0 ? <NotificationsEmpty />
            : <div className="flex flex-col divide-y divide-slate-100">{notifications.map((notif) => <NotificationItem key={notif.id} notif={notif} formatTime={formatTime} onMarkAsRead={markAsRead} onDelete={deleteNotification} />)}</div>}
          <NotificationsPagination currentPage={currentPage} lastPage={lastPage} isLoading={isLoading} onPageChange={setCurrentPage} />
        </div>
      </div>
    </main>
  );
}
