"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Power, PowerOff, X } from "lucide-react";
import type { AdminUser } from "@/features/admin/services/adminService";

type SuspendUserModalProps = {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onSubmit: (uuid: string) => Promise<void>;
  isLoading: boolean;
};

export function SuspendUserModal({
  open,
  user,
  onClose,
  onSubmit,
  isLoading,
}: SuspendUserModalProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !user) return null;

  const isActive = user.is_active !== false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(user.uuid);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-border">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isActive ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                }`}
              >
                {isActive ? <PowerOff className="w-5 h-5" /> : <Power className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-ink font-semibold">
                  {isActive ? "Tangguhkan Akun Pengguna?" : "Aktifkan Akun Pengguna?"}
                </h3>
                <span className="font-caption text-caption text-ink-subtle">
                  {user.full_name}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-ink-subtle hover:text-ink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="font-body-default text-body-default text-ink-muted mb-4">
            {isActive
              ? "Pengguna ini tidak akan dapat login, berkonsultasi, maupun mengakses data medis platform hingga status dipulihkan."
              : "Pengguna ini akan dipulihkan aksesnya untuk login dan menggunakan seluruh layanan SkinCek kembali."}
          </p>

          {isActive && (
            <div className="space-y-1.5">
              <label className="font-caption text-caption font-semibold text-ink">
                Catatan Penangguhan (Opsional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tuliskan catatan audit penangguhan..."
                rows={3}
                className="w-full p-3 rounded-xl bg-surface-alt text-ink text-body-default placeholder:text-ink-subtle focus:bg-surface focus:outline-none focus:ring-2 focus:ring-warning/40 resize-none shadow-sm border border-border"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-alt flex items-center justify-end gap-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-10 px-4 rounded-xl bg-surface hover:bg-surface-container text-ink font-caption text-caption font-medium transition-colors border border-border"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`h-10 px-5 rounded-xl text-surface font-caption text-caption font-semibold transition-all shadow-sm ${
              isActive
                ? "bg-warning hover:brightness-95"
                : "bg-success hover:brightness-95"
            }`}
          >
            {isLoading
              ? "Memproses..."
              : isActive
                ? "Ya, Tangguhkan Akun"
                : "Ya, Aktifkan Akun"}
          </button>
        </div>
      </div>
    </div>
  );
}
