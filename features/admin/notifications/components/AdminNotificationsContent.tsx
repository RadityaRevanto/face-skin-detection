"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Search, Inbox } from "lucide-react";
import type { NotificationData } from "@/features/notification/lib/NotificationTypes";
import { notificationService } from "@/features/notification/services/notificationService";
import { AdminNotificationsHeader } from "./AdminNotificationsHeader";
import { AdminNotificationItem } from "./AdminNotificationItem";
import { AdminNotificationsPagination } from "./AdminNotificationsPagination";

export function AdminNotificationsContent() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      const [listRes, count] = await Promise.all([
        notificationService.list({ page, limit: 15 }),
        notificationService.unreadCount().catch(() => 0),
      ]);
      if (listRes.data && Array.isArray(listRes.data)) {
        setNotifications(listRes.data);
      }
      if (listRes.meta) {
        setCurrentPage(listRes.meta.current_page || 1);
        setLastPage(listRes.meta.last_page || 1);
        setTotal(listRes.meta.total || 0);
        setUnreadCount(listRes.meta.unread_count ?? count);
      } else {
        setUnreadCount(count);
      }
    } catch (err) {
      console.error("Gagal memuat notifikasi admin:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage, loadData]);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
      setUnreadCount(0);
      window.dispatchEvent(new Event("notificationsReadAll"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      window.dispatchEvent(new CustomEvent("notificationReadSingle", { detail: { id } }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.remove(id);
      const target = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      if (target && !target.is_read) setUnreadCount((prev) => Math.max(0, prev - 1));
      window.dispatchEvent(new CustomEvent("notificationDeletedSingle", { detail: { id } }));
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (dateStr: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    }).format(new Date(dateStr));

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      if (activeTab === "unread" && notif.is_read) return false;
      if (activeTab === "read" && !notif.is_read) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return notif.title?.toLowerCase().includes(q) || notif.message?.toLowerCase().includes(q);
    });
  }, [notifications, activeTab, searchQuery]);

  return (
    <div className="flex flex-col w-full space-y-6">
      <AdminNotificationsHeader
        total={total}
        unreadCount={unreadCount}
        isLoading={isLoading}
        onMarkAllAsRead={handleMarkAllAsRead}
        onRefresh={() => loadData(currentPage)}
      />

      {/* Filter Tabs & Search Bar */}
      <div className="bg-surface p-2 rounded-2xl shadow-sm border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(["all", "unread", "read"] as const).map((tab) => {
            const labels = { all: "Semua", unread: "Belum Dibaca", read: "Sudah Dibaca" };
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl font-caption text-caption font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-role-accent-admin text-surface shadow-sm"
                    : "bg-surface text-ink-muted hover:text-ink hover:bg-surface-alt"
                }`}
              >
                {labels[tab]}
                {tab === "unread" && unreadCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-warning/20 text-warning font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-ink-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari notifikasi..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface-alt border border-border/60 text-caption font-caption text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-role-accent-admin/30 focus:border-role-accent-admin transition-all"
          />
        </div>
      </div>

      {/* Notification Items Card */}
      <div className="bg-surface rounded-2xl shadow-sm border border-border/50 overflow-hidden divide-y divide-border/50">
        {isLoading && notifications.length === 0 ? (
          <div className="p-12 text-center text-ink-muted flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-role-accent-admin border-t-transparent animate-spin" />
            <span className="font-caption text-caption">Memuat notifikasi sistem...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-ink-muted flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-surface-alt flex items-center justify-center text-ink-subtle mb-1">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="font-headline-sm text-headline-sm text-ink font-semibold">
              Tidak Ada Notifikasi
            </p>
            <p className="font-body-default text-caption text-ink-muted max-w-sm">
              {searchQuery
                ? `Tidak ditemukan notifikasi dengan kata kunci "${searchQuery}".`
                : "Semua pesan dan peringatan sistem sudah ditinjau."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <AdminNotificationItem
              key={notif.id}
              notif={notif}
              formatTime={formatTime}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))
        )}

        <AdminNotificationsPagination
          currentPage={currentPage}
          lastPage={lastPage}
          isLoading={isLoading}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
