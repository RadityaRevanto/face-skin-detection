import { Card } from "@/components/ui/card";

import type { AdminProfileData } from "../types";

export function AdminSessionInfo({ activeSessions }: { activeSessions: AdminProfileData["active_sessions"] }) {
  return (
    <Card className="rounded-2xl border-slate-100! bg-white! p-5 text-slate-950! shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <rect
              x="5"
              y="3"
              width="14"
              height="18"
              rx="2"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
            <path d="M12 17.5h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
          </svg>
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-950">Info Sesi</h3>
          <p className="mt-1 text-sm text-slate-600">
            Kamu login di{" "}
            <span className="font-bold text-slate-950">{activeSessions} perangkat</span> sekaligus.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Sesi mencakup semua device dengan token aktif. Logout semua device lewat menu keamanan akun bila perlu.
          </p>
        </div>
      </div>
    </Card>
  );
}
