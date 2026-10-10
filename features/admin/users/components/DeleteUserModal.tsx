"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Info, X } from "lucide-react";
import type { AdminUser } from "@/features/admin/services/adminService";

type DeleteUserModalProps = {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onSubmit: (uuid: string) => Promise<void>;
  isLoading: boolean;
};

export function DeleteUserModal({
  open,
  user,
  onClose,
  onSubmit,
  isLoading,
}: DeleteUserModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !user) return null;

  const handleSubmit = async () => {
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
              <div className="w-10 h-10 rounded-xl bg-error-container text-danger flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-ink font-semibold">
                  Hapus Akun Pengguna
                </h3>
                <span className="font-caption text-caption text-danger font-medium">
                  Tindakan Permanen & Tidak Dapat Dibatalkan
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
            Apakah Anda yakin ingin menghapus akun{" "}
            <strong className="text-ink">{user.full_name}</strong> ({user.email}) secara permanen?
            Semua riwayat diagnosa scan dan kredensial autentikasi akan diputus dari server SkinCek.
          </p>

          <div className="p-3 rounded-xl bg-error-container/30 flex items-center gap-2.5 border border-error-container">
            <Info className="w-4 h-4 text-danger shrink-0" />
            <span className="font-caption text-caption text-ink font-medium">
              Data rekam medis terenkripsi akan diarsipkan sesuai regulasi Kemenkes.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-alt flex items-center justify-end gap-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-10 px-4 rounded-xl bg-surface hover:bg-surface-container text-ink font-caption text-caption font-medium transition-colors border border-border"
          >
            Batalkan
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="h-10 px-5 rounded-xl bg-danger text-surface font-caption text-caption font-semibold hover:bg-error transition-all shadow-sm disabled:opacity-50"
          >
            {isLoading ? "Menghapus..." : "Hapus Permanen"}
          </button>
        </div>
      </div>
    </div>
  );
}
