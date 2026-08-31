import { Bell, Check, Trash2 } from "lucide-react";
import type { NotificationData } from "../lib/NotificationTypes";
import { getCategoryBadge } from "../lib/notificationToast";

interface NotificationItemProps {
  notif: NotificationData;
  formatTime: (dateStr: string) => string;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({ notif, formatTime, onMarkAsRead, onDelete }: NotificationItemProps) {
  const title = notif.title || "Notifikasi Baru";
  const body = notif.message || "";
  const isRead = notif.is_read;
  const typeBadge = getCategoryBadge(notif.category);

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
            <span className={`mr-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold align-middle ${typeBadge.className}`}>
              {typeBadge.label}
            </span>
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
              onClick={() => onMarkAsRead(notif.id)}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              <Check size={14} /> Tandai dibaca
            </button>
          )}
          <button
            onClick={() => onDelete(notif.id)}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600"
          >
            <Trash2 size={14} /> Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
