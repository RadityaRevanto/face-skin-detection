"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  /** Label input konfirmasi — bila diisi, user wajib mengetik teks ini. */
  confirmText?: string;
  confirmLabel?: string;
  tone?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

/**
 * Konfirmasi aksi destruktif — pengganti `window.confirm` / `alert`.
 * Opsi `confirmText`: untuk aksi berisiko tinggi, user wajib mengetik teks persis.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmText,
  confirmLabel = "Lanjutkan",
  tone = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState("");
  const satisfied = !confirmText || typed === confirmText;

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!loading) {
          setTyped("");
          onCancel();
        }
      }}
      title={title}
      description={description}
      size="sm"
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            disabled={loading}
            onClick={() => {
              setTyped("");
              onCancel();
            }}
          >
            Batal
          </Button>
          <Button
            variant={tone === "danger" ? "danger" : "primary"}
            disabled={!satisfied || loading}
            onClick={async () => {
              await onConfirm();
              setTyped("");
            }}
          >
            {loading ? "Memproses..." : confirmLabel}
          </Button>
        </div>
      }
    >
      {confirmText ? (
        <div>
          <label htmlFor="confirm-dialog-input" className="mb-1.5 block text-sm font-medium text-slate-700">
            Ketik <span className="font-mono font-semibold">{confirmText}</span> untuk konfirmasi
          </label>
          <input
            id="confirm-dialog-input"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            className="h-10 w-full rounded-[var(--radius-control)] border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-[var(--role-accent)] focus:ring-2 focus:ring-[var(--role-accent-soft)]"
          />
        </div>
      ) : null}
    </Modal>
  );
}