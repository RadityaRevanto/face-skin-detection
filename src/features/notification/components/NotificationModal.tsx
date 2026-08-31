import { Bell, Check, X } from "lucide-react";
import type { NotificationData } from "../lib/NotificationTypes";
import { NotificationList } from "./NotificationList";

interface NotificationModalProps {
  notifications: NotificationData[];
  unreadCount: number;
  isLoading: boolean;
  basePath: string;
  formatTime: (dateStr: string) => string;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  onClose: () => void;
}

export function NotificationModal({
  notifications,
  unreadCount,
  isLoading,
  basePath,
  formatTime,
  markAllAsRead,
  markAsRead,
  deleteNotification,
  onClose,
}: NotificationModalProps) {
  return (
    <div
      className={`
        fixed lg:absolute right-0 z-50 flex flex-col bg-white overflow-hidden shadow-2xl transition-all

        /* Mobile: Fullscreen sliding from bottom or center */
        bottom-0 left-0 w-full h-[85vh] rounded-t-3xl lg:bottom-auto lg:left-auto

        /* Desktop: Dropdown */
        lg:top-full lg:mt-3 lg:w-80 lg:h-auto lg:max-h-125 lg:rounded-2xl lg:border lg:border-slate-100
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
            className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
        <NotificationList
          notifications={notifications}
          isLoading={isLoading}
          formatTime={formatTime}
          markAsRead={markAsRead}
          deleteNotification={deleteNotification}
        />
      </div>

      {/* Footer Link to Dedicated Page */}
      <div className="border-t border-slate-100 p-2 bg-slate-50/50">
        <a
          href={`${basePath}/notifications`}
          onClick={onClose}
          className="block w-full py-2 text-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
        >
          Lihat Semua Notifikasi
        </a>
      </div>
    </div>
  );
}
