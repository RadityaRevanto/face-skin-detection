import { Check } from "lucide-react";

interface NotificationsHeaderProps {
  total: number;
  hasNotifications: boolean;
  onMarkAllAsRead: () => void;
}

export function NotificationsHeader({ total, hasNotifications, onMarkAllAsRead }: NotificationsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Riwayat Notifikasi</h1>
        <p className="text-sm text-slate-500 mt-1">
          {total} pemberitahuan diterima
        </p>
      </div>

      <button
        onClick={onMarkAllAsRead}
        disabled={!hasNotifications}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-sm font-semibold text-slate-600 rounded-xl hover:bg-slate-50 hover:text-emerald-600 transition-colors disabled:opacity-50"
      >
        <Check size={16} /> Tandai semua dibaca
      </button>
    </div>
  );
}
