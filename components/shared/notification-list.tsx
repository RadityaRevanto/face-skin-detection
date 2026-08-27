import { Bell, Check, Trash2 } from "lucide-react";
import type { NotificationData } from "./notification-types";

interface NotificationListProps {
  notifications: NotificationData[];
  isLoading: boolean;
  formatTime: (dateStr: string) => string;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
}

export function NotificationList({
  notifications,
  isLoading,
  formatTime,
  markAsRead,
  deleteNotification,
}: NotificationListProps) {
  if (isLoading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="bg-slate-50 p-3 rounded-full mb-3 text-slate-300">
          <Bell size={24} />
        </div>
        <p className="text-sm font-medium text-slate-900">Belum ada notifikasi</p>
        <p className="text-xs text-slate-500 mt-1">Notifikasi baru akan muncul di sini</p>
      </div>
    );
  }

  return (
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
  );
}
