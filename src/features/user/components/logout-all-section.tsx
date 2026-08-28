"use client";

import { LogOut, AlertTriangle } from "lucide-react";

interface LogoutAllSectionProps {
  showLogoutAll: boolean;
  isLoggingOutAll: boolean;
  setShowLogoutAll: (v: boolean) => void;
  handleLogoutAll: () => void;
}

export function LogoutAllSection({
  showLogoutAll,
  isLoggingOutAll,
  setShowLogoutAll,
  handleLogoutAll,
}: LogoutAllSectionProps) {
  return (
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
  );
}
