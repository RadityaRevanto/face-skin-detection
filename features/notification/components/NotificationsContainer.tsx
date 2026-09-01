"use client";

import { useEffect, useState, useCallback } from "react";
import type { NotificationData } from "../lib/NotificationTypes";
import { notificationService } from "../services/notificationService";
import { NotificationItem } from "./NotificationItem";
import { NotificationsHeader } from "./NotificationsHeader";
import { NotificationsLoading } from "./NotificationsLoading";
import { NotificationsEmpty } from "./NotificationsEmpty";
import { NotificationsPagination } from "./NotificationsPagination";

export function NotificationsContainer() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchNotifications = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      const result = await notificationService.list({ page, per_page: 10 });
      if (result.data && Array.isArray(result.data)) {
        setNotifications(result.data);
      }
      if (result.meta) {
        setCurrentPage(result.meta.current_page || 1);
        setLastPage(result.meta.last_page || 1);
        setTotal(result.meta.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage, fetchNotifications]);

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllRead();
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
      window.dispatchEvent(new CustomEvent("notificationReadSingle", { detail: { id } }));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.remove(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      window.dispatchEvent(new CustomEvent("notificationDeletedSingle", { detail: { id } }));
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (dateStr: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));

  return (
    <main className="min-h-[calc(100vh-72px)] bg-shell p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <NotificationsHeader
          total={total}
          hasNotifications={notifications.length > 0}
          onMarkAllAsRead={markAllAsRead}
        />
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {isLoading && notifications.length === 0 ? (
            <NotificationsLoading />
          ) : notifications.length === 0 ? (
            <NotificationsEmpty />
          ) : (
            <div className="flex flex-col divide-y divide-slate-100">
              {notifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notif={notif}
                  formatTime={formatTime}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))}
            </div>
          )}
          <NotificationsPagination
            currentPage={currentPage}
            lastPage={lastPage}
            isLoading={isLoading}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </main>
  );
}
