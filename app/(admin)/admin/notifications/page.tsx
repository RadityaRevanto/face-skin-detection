"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Trash2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { NotificationData } from "@/components/shared/notification-bell";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchNotifications = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/notifications?page=${page}&per_page=15`);
      const json = await res.json();
      
      if (json.data && Array.isArray(json.data)) {
        setNotifications(json.data);
      }
      if (json.meta) {
        setCurrentPage(json.meta.current_page || 1);
        setLastPage(json.meta.last_page || 1);
        setTotal(json.meta.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
      setNotifications(notifications.map((n) => ({ ...n, read_at: new Date().toISOString() })));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("notificationsReadAll"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" });
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("notificationReadSingle", { detail: { id } }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      setNotifications(notifications.filter((n) => n.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("notificationDeletedSingle", { detail: { id } }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f7fbf8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Riwayat Notifikasi</h1>
            <p className="text-sm text-slate-500 mt-1">
              {total} pemberitahuan diterima
            </p>
          </div>
          
          <button
            onClick={markAllAsRead}
            disabled={notifications.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-sm font-semibold text-slate-600 rounded-xl hover:bg-slate-50 hover:text-emerald-600 transition-colors disabled:opacity-50"
          >
            <Check size={16} /> Tandai semua dibaca
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {isLoading && notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
              <p className="text-sm text-slate-500">Memuat notifikasi...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="bg-slate-50 p-4 rounded-full mb-4 text-slate-300">
                <Bell size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Belum ada notifikasi</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                Segala pembaruan terkait konsultasi, pembayaran, dan informasi lainnya akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100">
              {notifications.map((notif) => {
                const title = notif.title || notif.data?.title || "Notifikasi Baru";
                const body = notif.body || notif.data?.body || "";
                const isRead = !!notif.read_at;

                return (
                  <div
                    key={notif.id}
                    className={`group relative flex flex-col sm:flex-row gap-4 p-5 transition-colors ${
                      isRead ? "bg-white hover:bg-slate-50" : "bg-emerald-50/30 hover:bg-emerald-50"
                    }`}
                  >
                    {!isRead && (
                      <div className="absolute top-6 left-2 sm:left-3 h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                    
                    <div className="hidden sm:flex mt-1 bg-white border border-slate-100 p-2.5 rounded-full h-fit text-emerald-500 shadow-sm">
                      <Bell size={18} />
                    </div>

                    <div className={`flex-1 ${!isRead ? "pl-2 sm:pl-0" : ""}`}>
                      <div className="flex justify-between items-start mb-1.5">
                        <h4 className={`text-base ${isRead ? "font-medium text-slate-700" : "font-bold text-slate-900"}`}>
                          {title}
                        </h4>
                        <span className="hidden sm:block text-xs font-medium text-slate-400 whitespace-nowrap ml-4">
                          {formatTime(notif.created_at)}
                        </span>
                      </div>
                      
                      <p className={`text-sm mb-3 leading-relaxed ${isRead ? "text-slate-500" : "text-slate-700"}`}>
                        {body}
                      </p>
                      
                      <span className="sm:hidden text-xs font-medium text-slate-400 block mb-3">
                        {formatTime(notif.created_at)}
                      </span>
                      
                      <div className="flex items-center gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        {!isRead && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                          >
                            <Check size={14} /> Tandai dibaca
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600"
                        >
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {lastPage > 1 && (
            <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Halaman {currentPage} dari {lastPage}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(lastPage, p + 1))}
                  disabled={currentPage === lastPage || isLoading}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
