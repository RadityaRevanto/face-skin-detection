import { Loader2 } from "lucide-react";

export function NotificationsLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
      <p className="text-sm text-slate-500">Memuat notifikasi...</p>
    </div>
  );
}
