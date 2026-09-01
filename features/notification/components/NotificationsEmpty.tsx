import { Bell } from "lucide-react";

export function NotificationsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="bg-slate-50 p-4 rounded-full mb-4 text-slate-300">
        <Bell size={32} />
      </div>
      <h3 className="text-lg font-bold text-slate-900">Belum ada notifikasi</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm">
        Segala pembaruan terkait konsultasi, pembayaran, dan informasi lainnya akan muncul di sini.
      </p>
    </div>
  );
}
