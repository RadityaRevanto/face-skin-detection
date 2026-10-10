"use client";

import { useState, useEffect } from "react";
import { X, UserPlus, Eye, EyeOff, Loader2 } from "lucide-react";
import type { CreateAdminUserPayload } from "@/features/admin/services/adminService";

type InviteDoctorModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateAdminUserPayload) => Promise<unknown>;
  isLoading: boolean;
};

export function InviteDoctorModal({
  open,
  onClose,
  onSubmit,
  isLoading,
}: InviteDoctorModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      setError("Nama dokter, email, dan kata sandi wajib diisi.");
      return;
    }
    setError(null);
    try {
      await onSubmit({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        role: "doctor",
        is_active: true,
      });
      setFullName("");
      setEmail("");
      setPassword("");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengundang dokter.";
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-border/50 animate-scale-up">
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-role-accent-doctor/10 text-role-accent-doctor flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-role-accent-doctor" />
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-ink font-semibold">
                Undang Dokter Spesialis
              </h3>
              <p className="font-caption text-caption text-ink-muted">
                Daftarkan akun praktisi medis baru ke registri SkinCek.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-subtle hover:text-ink hover:bg-surface-alt transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-caption font-caption">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-caption text-caption font-semibold text-ink">
              Nama Lengkap & Gelar Spesialis
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: dr. Sarah Nurdiana, Sp.DVE"
              className="w-full h-11 px-3.5 rounded-xl bg-surface-alt border border-border/60 text-ink text-body-default focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-admin transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-caption text-caption font-semibold text-ink">
              Alamat Email Dokter
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dokter@klinikmedika.id"
              className="w-full h-11 px-3.5 rounded-xl bg-surface-alt border border-border/60 text-ink text-body-default focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-admin transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-caption text-caption font-semibold text-ink">
              Kata Sandi Sementara
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-surface-alt border border-border/60 text-ink text-body-default focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-admin transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-surface-alt hover:bg-surface-container text-ink font-caption text-caption font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-role-accent-admin hover:bg-secondary-container text-surface font-caption text-caption font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Kirim Undangan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
