"use client";

import { useState, useEffect } from "react";
import { UserCog, Shield, Stethoscope, User, X } from "lucide-react";
import type { AdminUser } from "@/features/admin/services/adminService";

type ChangeRoleModalProps = {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onSubmit: (uuid: string, role: string) => Promise<void>;
  isLoading: boolean;
};

export function ChangeRoleModal({
  open,
  user,
  onClose,
  onSubmit,
  isLoading,
}: ChangeRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>(user?.role ?? "user");

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(user.uuid, selectedRole);
    onClose();
  };

  const options = [
    {
      id: "admin",
      label: "Administrator",
      sub: "Akses penuh panel admin dan logs",
      icon: Shield,
      color: "text-role-accent-admin",
    },
    {
      id: "doctor",
      label: "Dokter Spesialis",
      sub: "Diagnosa AI dan resep obat",
      icon: Stethoscope,
      color: "text-role-accent-doctor",
    },
    {
      id: "user",
      label: "User Reguler",
      sub: "Akses aplikasi pasien SkinCek",
      icon: User,
      color: "text-ink-muted",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-border">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-role-accent-admin/10 text-role-accent-admin flex items-center justify-center shrink-0">
                <UserCog className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-ink font-semibold">
                  Ubah Role Pengguna
                </h3>
                <span className="font-caption text-caption text-ink-muted">
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
          <p className="font-body-default text-caption text-ink-muted">
            Mengubah role akan langsung memperbarui izin portal dokter, audit rekam medis, dan fitur telekonsultasi.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-2">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedRole === opt.id;
              const isCurrent = user.role === opt.id;

              return (
                <label
                  key={opt.id}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors border ${
                    isSelected
                      ? "bg-surface-container-high/40 border-role-accent-admin/40"
                      : "bg-surface-alt hover:bg-surface-container border-border"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-5 h-5 ${opt.color}`} />
                    <div className="flex flex-col">
                      <span className="font-caption text-caption font-semibold text-ink">
                        {opt.label} {isCurrent && "(Saat Ini)"}
                      </span>
                      <span className="font-caption text-[11px] text-ink-subtle">
                        {opt.sub}
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="change_role"
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => setSelectedRole(opt.id)}
                    className="text-role-accent-admin focus:ring-0"
                  />
                </label>
              );
            })}
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
              type="submit"
              disabled={isLoading || selectedRole === user.role}
              className="h-10 px-5 rounded-xl bg-role-accent-admin text-surface font-caption text-caption font-semibold hover:bg-secondary-container transition-all disabled:opacity-50"
            >
              {isLoading ? "Memperbarui..." : "Perbarui Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
