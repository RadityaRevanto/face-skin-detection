"use client";

import { useEffect, useState } from "react";
import { Laptop, Smartphone, Globe, ShieldCheck, LogOut, X, Loader2, AlertTriangle, Monitor, Apple } from "lucide-react";
import { getLoginActivity, revokeSession, revokeAllOtherSessions, type LoginActivity } from "@/lib/api/security";

export function SecuritySessions() {
  const [sessions, setSessions] = useState<LoginActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isRevoking, setIsRevoking] = useState<string | null>(null);
  const [isRevokingAll, setIsRevokingAll] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  const [revokeAllConfirm, setRevokeAllConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      const data = await getLoginActivity();
      setSessions(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat memuat data sesi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const confirmRevoke = async () => {
    if (!revokeTarget) return;
    const tokenId = revokeTarget;
    try {
      setIsRevoking(tokenId);
      await revokeSession(tokenId);
      setSessions((prev) => prev.filter((s) => s.uuid !== tokenId));
      setRevokeTarget(null);
      setSuccessMsg("Sesi perangkat berhasil dicabut!");
    } catch (err: any) {
      alert(err.message || "Gagal mencabut akses perangkat.");
    } finally {
      setIsRevoking(null);
    }
  };

  const confirmRevokeAll = async () => {
    try {
      setIsRevokingAll(true);
      await revokeAllOtherSessions();
      await fetchSessions();
      setRevokeAllConfirm(false);
      setSuccessMsg("Semua sesi perangkat lain berhasil dicabut!");
    } catch (err: any) {
      alert(err.message || "Gagal mencabut akses semua perangkat lain.");
    } finally {
      setIsRevokingAll(false);
    }
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "Tidak diketahui";
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  const getDeviceIcon = (name?: string | null) => {
    if (!name) return <Laptop size={20} className="text-slate-500" />;
    const n = name.toLowerCase();
    if (n.includes("mac") || n.includes("iphone") || n.includes("ipad")) return <Apple size={20} className="text-slate-500" />;
    if (n.includes("windows") || n.includes("linux")) return <Monitor size={20} className="text-slate-500" />;
    if (n.includes("android") || n.includes("mobile")) return <Smartphone size={20} className="text-slate-500" />;
    return <Laptop size={20} className="text-slate-500" />;
  };

  if (isLoading && sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
        <p className="text-sm text-slate-500">Memuat data sesi keamanan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8 overflow-hidden relative">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-5 pointer-events-none">
          <ShieldCheck size={200} />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={26} />
              Aktivitas Login
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-lg">
              Tinjau perangkat yang sedang *login* ke akun Anda. Cabut akses perangkat yang tidak Anda kenali untuk menjaga keamanan.
            </p>
          </div>
          
          {sessions.length > 1 && (
            <button
              onClick={() => setRevokeAllConfirm(true)}
              disabled={isRevokingAll}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {isRevokingAll ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogOut size={16} />
              )}
              Keluar dari Semua Perangkat Lain
            </button>
          )}
        </div>

        {errorMsg ? (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm">{errorMsg}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div 
                key={session.uuid} 
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-colors ${
                  session.is_current 
                    ? "bg-emerald-50/30 border-emerald-100 hover:bg-emerald-50/50" 
                    : "bg-white border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full mt-1 ${
                  session.is_current ? "bg-emerald-100" : "bg-slate-100"
                }`}>
                  {getDeviceIcon(session.device)}
                </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 text-base">
                        {session.device || "Perangkat Tidak Dikenal"}
                      </h4>
                      {session.is_current && (
                        <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                          Perangkat Ini
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs font-medium text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Globe size={14} className="text-slate-400" />
                        IP: {session.ip_address || "Unknown"} {session.location ? `(${session.location.city || session.location.country})` : ""}
                      </div>
                      <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Terakhir aktif:</span>
                        {formatTime(session.last_used_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {!session.is_current && (
                  <button
                    onClick={() => setRevokeTarget(session.uuid)}
                    disabled={isRevoking === session.uuid}
                    className="flex items-center justify-center gap-1.5 sm:w-auto w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors disabled:opacity-50"
                  >
                    {isRevoking === session.uuid ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <X size={16} />
                    )}
                    Keluarkan
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revoke Single Session Modal */}
      {revokeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Keluarkan Perangkat?</h3>
            <p className="text-slate-500 mb-6 text-sm">
              Apakah Anda yakin ingin mengeluarkan perangkat ini? Perangkat ini akan segera logout dan harus login kembali untuk masuk.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setRevokeTarget(null)}
                disabled={isRevoking !== null}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={confirmRevoke}
                disabled={isRevoking !== null}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors disabled:opacity-50"
              >
                {isRevoking !== null && <Loader2 size={16} className="animate-spin" />}
                Ya, Keluarkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke All Sessions Modal */}
      {revokeAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200 border-2 border-rose-100">
            <div className="flex items-center gap-3 mb-2 text-rose-500">
              <AlertTriangle size={24} />
              <h3 className="text-xl font-bold text-slate-900">Keluar dari Semua?</h3>
            </div>
            <p className="text-slate-500 mb-6 text-sm">
              AWAS! Ini akan mengeluarkan Anda dari <strong>SEMUA</strong> perangkat lain selain perangkat yang sedang Anda gunakan saat ini. Lanjutkan?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setRevokeAllConfirm(false)}
                disabled={isRevokingAll}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={confirmRevokeAll}
                disabled={isRevokingAll}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors disabled:opacity-50"
              >
                {isRevokingAll && <Loader2 size={16} className="animate-spin" />}
                Ya, Keluarkan Semua
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Berhasil!</h3>
            <p className="text-slate-500 mb-6 text-sm">{successMsg}</p>
            <button
              onClick={() => setSuccessMsg("")}
              className="w-full py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
