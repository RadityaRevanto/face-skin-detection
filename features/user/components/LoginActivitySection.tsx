"use client";

import {
  Monitor,
  Smartphone,
  Globe,
  ShieldCheck,
  MapPin,
  Clock,
  RefreshCw,
} from "lucide-react";

interface LoginActivity {
  uuid: string;
  device: string;
  ip_address: string;
  location: { city?: string; country?: string } | null;
  is_current: boolean;
  last_used_at: string;
  created_at: string;
}

interface LoginActivitySectionProps {
  sessions: LoginActivity[];
  isLoadingSessions: boolean;
  revokingId: string | null;
  fetchSessions: () => void;
  handleRevokeSession: (uuid: string) => void;
  formatLocation: (loc: LoginActivity["location"]) => string | null;
  formatDate: (iso: string) => string;
}

export function LoginActivitySection({
  sessions,
  isLoadingSessions,
  revokingId,
  fetchSessions,
  handleRevokeSession,
  formatLocation,
  formatDate,
}: LoginActivitySectionProps) {
  return (
    <section className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
            <Monitor size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Di Mana Anda Login</h2>
            <p className="text-sm text-zinc-500">Semua sesi aktif di berbagai perangkat</p>
          </div>
        </div>
        <button
          onClick={fetchSessions}
          disabled={isLoadingSessions}
          className="p-2 text-zinc-400 hover:text-zinc-600 rounded-lg transition-colors"
          title="Muat ulang"
        >
          <RefreshCw size={18} className={isLoadingSessions ? "animate-spin" : ""} />
        </button>
      </div>

      {isLoadingSessions ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-zinc-400 text-sm text-center py-8">Tidak ada sesi aktif</p>
      ) : (
        <div className="divide-y divide-zinc-100">
          {sessions.map((session) => (
            <div key={session.uuid} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <div className="p-2.5 bg-zinc-100 rounded-xl text-zinc-500 shrink-0">
                {/Android|iOS|iPhone|iPad/.test(session.device) ? (
                  <Smartphone size={22} />
                ) : (
                  <Monitor size={22} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-zinc-900 truncate">{session.device}</p>
                  {session.is_current && (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200/50">
                      <ShieldCheck size={12} /> Saat ini
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-zinc-500">
                  {session.ip_address && (
                    <span className="flex items-center gap-1">
                      <Globe size={12} /> {session.ip_address}
                    </span>
                  )}
                  {formatLocation(session.location) && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {formatLocation(session.location)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {formatDate(session.last_used_at || session.created_at)}
                  </span>
                </div>
              </div>
              {!session.is_current && (
                <button
                  onClick={() => handleRevokeSession(session.uuid)}
                  disabled={revokingId === session.uuid}
                  className="shrink-0 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200/50 transition-colors disabled:opacity-50"
                >
                  {revokingId === session.uuid ? "Mencabut..." : "Cabut Sesi"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
