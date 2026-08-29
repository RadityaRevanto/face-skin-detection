"use client";

import { Lock } from "lucide-react";

interface PasswordChangeSectionProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  isChangingPassword: boolean;
  passwordMsg: { type: "success" | "error"; text: string } | null;
  setCurrentPassword: (v: string) => void;
  setNewPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  handleChangePassword: (e: React.FormEvent) => void;
}

export function PasswordChangeSection({
  currentPassword,
  newPassword,
  confirmPassword,
  isChangingPassword,
  passwordMsg,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  handleChangePassword,
}: PasswordChangeSectionProps) {
  return (
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
  );
}
