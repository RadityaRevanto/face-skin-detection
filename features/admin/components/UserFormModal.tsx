"use client";

import { useState } from "react";

import { adminService } from "@/features/admin/services/adminService";
import { useDialogEscape } from "@/features/shared/hooks/useDialogEscape";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";
import { customToast } from "@/lib/custom-toast";
import { Input } from "@/components/ui/input";

export type UserFormInitial = {
  uuid: string;
  full_name: string;
  email: string;
  role: string;
};

type UserFormModalProps = {
  open: boolean;
  /** null = create; selain itu edit user tsb. */
  initial: UserFormInitial | null;
  /** Role prefill saat create (mis. "doctor" dari halaman dokter). */
  defaultRole?: string;
  onClose: () => void;
  onSaved: () => void;
};

const ROLES = [
  { value: "user", label: "User" },
  { value: "doctor", label: "Dokter" },
  { value: "admin", label: "Admin" },
] as const;

export function UserFormModal({ open, initial, defaultRole = "user", onClose, onSaved }: UserFormModalProps) {
  const isEdit = initial !== null;
  const [fullName, setFullName] = useState(initial?.full_name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>(initial?.role ?? defaultRole);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useDialogEscape(open, onClose);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setError("Nama dan email wajib diisi.");
      return;
    }
    if (!isEdit && password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      if (isEdit) {
        await adminService.updateUser(initial.uuid, {
          full_name: fullName.trim(),
          email: email.trim(),
          ...(password ? { password } : {}),
        });
        if (role !== initial.role) {
          await adminService.assignRole(initial.uuid, role);
        }
        customToast.success("Perubahan tersimpan");
      } else {
        await adminService.createUser({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
          role: role as "admin" | "doctor" | "user",
        });
        customToast.success("User berhasil dibuat");
      }
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("user");
      onSaved();
    } catch (err: unknown) {
      setError(getUserFriendlyErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-form-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 id="user-form-title" className="text-lg font-bold text-zinc-900">
          {isEdit ? "Edit User" : "Tambah User"}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          {isEdit
            ? "Kosongkan password bila tidak ingin mengubahnya."
            : "User baru langsung aktif dan bisa login dengan password ini."}
        </p>

        {error && (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="uf-name" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Nama lengkap
            </label>
            <Input
              id="uf-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama"
              required
            />
          </div>

          <div>
            <label htmlFor="uf-email" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Email
            </label>
            <Input
              id="uf-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="uf-pass" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Password
            </label>
            <Input
              id="uf-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEdit ? "Biarkan kosong untuk tetap" : "Minimal 8 karakter"}
              required={!isEdit}
            />
          </div>

          <div>
            <label htmlFor="uf-role" className="mb-1.5 block text-sm font-medium text-zinc-700">
              Role
            </label>
            <select
              id="uf-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {isEdit && initial.role === "doctor" && role !== "doctor" && (
              <p className="mt-1.5 text-xs text-amber-700">
                Catatan: melepas role dokter tidak menghapus data verifikasinya.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="flex-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              {busy ? "Menyimpan..." : isEdit ? "Simpan" : "Buat User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
