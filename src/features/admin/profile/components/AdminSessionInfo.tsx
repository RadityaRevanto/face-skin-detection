import { Card } from "@/components/ui/card";

import type { AdminProfileData } from "../types";

type AdminSessionInfoProps = {
  activeSessions: AdminProfileData["active_sessions"];
  lastLogin: AdminProfileData["last_login"];
};

function formatLoginAt(iso: string | null) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

export function AdminSessionInfo({ activeSessions, lastLogin }: AdminSessionInfoProps) {
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

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-slate-950">Info Sesi</h3>
          <p className="mt-1 text-sm text-slate-600">
            Kamu login di{" "}
            <span className="font-bold text-slate-950">{activeSessions} perangkat</span> sekaligus.
          </p>

          <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
            <p>
              Login terakhir:{" "}
              <span className="font-semibold text-slate-700">
                {formatLoginAt(lastLogin?.at ?? null)}
              </span>
            </p>
            {lastLogin?.ip_address && (
              <p className="mt-1">
                IP: <span className="font-semibold text-slate-700">{lastLogin.ip_address}</span>
              </p>
            )}
            {lastLogin?.user_agent && (
              <p className="mt-1 truncate">
                Device: <span className="font-semibold text-slate-700">{lastLogin.user_agent}</span>
              </p>
            )}
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Cek rutin sesi tidak dikenal dan cabut langsung lewat Login &amp; Keamanan.
          </p>
        </div>
      </div>
    </Card>
  );
}
