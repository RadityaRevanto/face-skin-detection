"use client";

import { useEffect, useState } from "react";
import {
  Lock,
  Monitor,
  Smartphone,
  Globe,
  LogOut,
  ShieldCheck,
  AlertTriangle,
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

export function LoginSecurityContent() {
  const [sessions, setSessions] = useState<LoginActivity[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [showLogoutAll, setShowLogoutAll] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoadingSessions(true);
      const res = await fetch("/api/login-activity");
      const json = await res.json();
      setSessions(json.data || []);
    } catch {
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Konfirmasi password tidak cocok" });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "Password baru minimal 8 karakter" });
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success !== false) {
        setPasswordMsg({ type: "success", text: json.meta?.message || "Password berhasil diubah" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({ type: "error", text: json.message || "Gagal mengubah password" });
      }
    } catch {
      setPasswordMsg({ type: "error", text: "Terjadi kesalahan saat mengubah password" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleRevokeSession = async (uuid: string) => {
    try {
      setRevokingId(uuid);
      await fetch(`/api/login-activity/${uuid}`, { method: "DELETE" });
      setSessions((prev) => prev.filter((s) => s.uuid !== uuid));
    } catch {
    } finally {
      setRevokingId(null);
    }
  };

  const handleLogoutAll = async () => {
    try {
      setIsLoggingOutAll(true);
      await fetch("/api/logout-all", { method: "POST" });
      window.location.href = "/login?clear_session=true";
    } catch {
      setIsLoggingOutAll(false);
      setShowLogoutAll(false);
    }
  };

  const formatLocation = (loc: LoginActivity["location"]) => {
    if (!loc) return null;
    const parts = [loc.city, loc.country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : null;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <section className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
            <Lock size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Ubah Password</h2>
            <p className="text-sm text-zinc-500">Pastikan password baru minimal 8 karakter</p>
          </div>
        </div>

        {passwordMsg && (
          <div
            className={`mb-4 p-3 rounded-xl text-sm font-medium ${
              passwordMsg.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                : "bg-rose-50 border border-rose-200 text-rose-700"
            }`}
          >
            {passwordMsg.text}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Password Saat Ini</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="Masukkan password saat ini"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Password Baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="Minimal 8 karakter"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Konfirmasi Password Baru</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="Ulangi password baru"
            />
          </div>
          <button
            type="submit"
            disabled={isChangingPassword}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {isChangingPassword ? "Menyimpan..." : "Ubah Password"}
          </button>
        </form>
      </section>

      {/* Login Activity */}
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

      {/* Logout All */}
      <section className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600">
            <LogOut size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Logout Semua Perangkat</h2>
            <p className="text-sm text-zinc-500">Keluar dari semua sesi di semua perangkat</p>
          </div>
        </div>

        {!showLogoutAll ? (
          <button
            onClick={() => setShowLogoutAll(true)}
            className="px-4 py-2 bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <LogOut size={16} /> Logout Semua Perangkat
          </button>
        ) : (
          <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-rose-900 mb-3">
                  Anda akan keluar dari <strong>semua perangkat</strong>. Sesi aktif lain akan terputus dan Anda perlu login ulang.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleLogoutAll}
                    disabled={isLoggingOutAll}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoggingOutAll ? "Memproses..." : "Ya, Logout Semua"}
                  </button>
                  <button
                    onClick={() => setShowLogoutAll(false)}
                    className="px-4 py-2 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-semibold rounded-lg border border-zinc-200 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
