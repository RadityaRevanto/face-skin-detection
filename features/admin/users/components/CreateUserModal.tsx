"use client";

import { useState, useEffect } from "react";
import { UserPlus, X, Eye, EyeOff, Shield, Stethoscope, User, Save } from "lucide-react";
import type { CreateAdminUserPayload } from "@/features/admin/services/adminService";

type CreateUserModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateAdminUserPayload) => Promise<void>;
  isLoading: boolean;
};

export function CreateUserModal({ open, onClose, onSubmit, isLoading }: CreateUserModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"admin" | "doctor" | "user">("doctor");
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
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Semua field wajib diisi");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }
    setError(null);
    try {
      await onSubmit({ full_name: fullName.trim(), email: email.trim(), password, role });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan pengguna baru");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-border">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-surface-alt flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-role-accent-admin/10 text-role-accent-admin flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-ink font-semibold">
                Tambah User Baru
              </h3>
              <span className="font-caption text-caption text-ink-subtle">
                Buat akun untuk staf, dokter, atau pasien
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-subtle hover:text-ink hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-error-container/30 text-danger text-caption font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-caption text-caption font-semibold text-ink">Nama Lengkap</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: dr. Fajar Nugroho, Sp.DVE"
                required
                className="w-full h-10 px-3.5 rounded-xl bg-surface-alt text-ink text-body-default placeholder:text-ink-subtle focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-admin/40 shadow-sm border border-border"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-caption text-caption font-semibold text-ink">Alamat Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@skincek.id atau email instansi"
                required
                className="w-full h-10 px-3.5 rounded-xl bg-surface-alt text-ink text-body-default placeholder:text-ink-subtle focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-admin/40 shadow-sm border border-border"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-caption text-caption font-semibold text-ink">Password Awal</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter kombinasi"
                  required
                  className="w-full h-10 px-3.5 pr-10 rounded-xl bg-surface-alt text-ink text-body-default placeholder:text-ink-subtle focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-admin/40 shadow-sm border border-border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="font-caption text-[11px] text-ink-subtle block">
                Pengguna akan diminta mengganti sandi pada login pertama.
              </span>
            </div>

            {/* Radio Pilihan Role */}
            <div className="space-y-2">
              <label className="font-caption text-caption font-semibold text-ink">
                Tetapkan Hak Akses (Role)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "admin", label: "Admin", sub: "Akses Penuh", icon: Shield },
                  { id: "doctor", label: "Doctor", sub: "Diagnosa AI", icon: Stethoscope },
                  { id: "user", label: "User", sub: "Pasien Reguler", icon: User },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const selected = role === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex flex-col p-3 rounded-xl cursor-pointer transition-colors border ${
                        selected ? "bg-role-accent-admin/10 text-role-accent-admin border-role-accent-admin/40" : "bg-surface-alt hover:bg-surface-container border-border text-ink"
                      }`}
                    >
                      <input type="radio" name="role" value={opt.id} checked={selected} onChange={() => setRole(opt.id as "admin" | "doctor" | "user")} className="sr-only" />
                      <div className="flex items-center justify-between mb-1">
                        <Icon className="w-4 h-4" />
                        <span className={`w-3.5 h-3.5 rounded-full ring-2 ${selected ? "ring-role-accent-admin bg-role-accent-admin" : "ring-ink-subtle"}`} />
                      </div>
                      <span className="font-headline-sm text-caption font-semibold">{opt.label}</span>
                      <span className="font-caption text-[11px] text-ink-muted">{opt.sub}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-surface-alt flex items-center justify-end gap-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="h-10 px-4 rounded-xl bg-surface hover:bg-surface-container text-ink font-caption text-caption font-medium transition-colors shadow-sm border border-border"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="h-10 px-5 rounded-xl bg-role-accent-admin text-surface font-caption text-caption font-semibold flex items-center gap-1.5 hover:bg-secondary-container transition-all shadow-sm disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? "Menyimpan..." : "Simpan Pengguna"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
