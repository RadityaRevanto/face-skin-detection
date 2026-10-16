"use client";

import { useState } from "react";
import { Edit3, Info, BookOpen, Cpu, Save, CheckCircle2, AlertCircle } from "lucide-react";

import { catalogService } from "@/features/skin-types/services/catalogService";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";

type SkinConcernDetailEditorProps = {
  concernId: string;
  initialDescription: string;
  onSuccess: (newDesc: string) => void;
  onCancel: () => void;
};

export function SkinConcernDetailEditor({
  concernId,
  initialDescription,
  onSuccess,
  onCancel,
}: SkinConcernDetailEditorProps) {
  const [description, setDescription] = useState(initialDescription);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const trimmed = description.trim();
    if (!trimmed) {
      setErrorMessage("Deskripsi medis tidak boleh kosong.");
      return;
    }

    setIsSubmitting(true);
    try {
      await catalogService.updateSkinConcern(concernId, { description: trimmed });
      setSuccessMessage("Perubahan deskripsi medis berhasil disimpan ke database.");
      onSuccess(trimmed);
    } catch (error) {
      console.error("Update skin concern description error:", error);
      setErrorMessage(getUserFriendlyErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setDescription(initialDescription);
    setErrorMessage("");
    onCancel();
  }

  return (
    <div id="inlineEditorCard" className="bg-surface rounded-2xl p-6 sm:p-8 shadow-xs border border-border/50 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-border/40">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-role-accent-doctor text-on-primary flex items-center justify-center shadow-xs shrink-0">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-ink font-bold">Edit Deskripsi Medis</h2>
            <span className="font-caption text-caption text-ink-muted">Modifikasi konteks referensi diagnosis AI &amp; preskripsi</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-caption text-caption font-semibold bg-role-accent-doctor text-on-primary shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> Mode Penyuntingan Aktif
        </span>
      </div>

      {errorMessage && (
        <div className="mb-4 flex items-center gap-2.5 p-3.5 rounded-xl bg-error-container/30 border border-error/30 text-error font-caption text-caption font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-success font-caption text-caption font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="medicalDescriptionInput" className="font-headline-sm text-caption text-ink font-semibold flex items-center gap-2">
              <span>Deskripsi Medis Lengkap (INCI / ICD-10)</span>
            </label>
            <span className="font-caption text-caption text-ink-subtle">{description.length} Karakter</span>
          </div>

          <textarea
            id="medicalDescriptionInput"
            rows={6}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Masukkan deskripsi patologi, kriteria diagnostik, dan instruksi segmentasi AI..."
            className="w-full bg-surface-alt text-ink font-body-default text-body-default p-4 sm:p-5 rounded-xl border border-border/40 focus:outline-none focus:bg-surface focus:ring-2 focus:ring-role-accent-doctor/30 leading-relaxed transition-all resize-y"
          />

          <div className="flex items-start gap-2 pt-1 text-ink-muted">
            <Info className="w-4 h-4 text-role-accent-doctor shrink-0 mt-0.5" />
            <p className="font-caption text-caption text-ink-muted leading-relaxed">
              Pembaruan deskripsi ini akan dijadikan basis pengetahuan context grounding untuk asisten AI konsultasi dan sinkronisasi pedoman tatalaksana resep otomatis.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
          <div className="bg-surface-alt p-4 rounded-xl border border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-role-accent-doctor shrink-0" />
              <div className="flex flex-col">
                <span className="font-caption text-caption font-semibold text-ink">Pedoman Tatalaksana PERDOSKI</span>
                <span className="font-caption text-caption text-ink-subtle">Kompilasi Standar Pelayanan Medis</span>
              </div>
            </div>
            <span className="font-caption text-caption text-success font-semibold px-2 py-0.5 rounded-full bg-success/10">Tersemat</span>
          </div>

          <div className="bg-surface-alt p-4 rounded-xl border border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-role-accent-doctor shrink-0" />
              <div className="flex flex-col">
                <span className="font-caption text-caption font-semibold text-ink">Model Weight Semantic Mapping</span>
                <span className="font-caption text-caption text-ink-subtle">Prompt injection embedding guard</span>
              </div>
            </div>
            <span className="font-caption text-caption text-role-accent-doctor font-semibold px-2 py-0.5 rounded-full bg-role-accent-doctor/10">Active</span>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-border/30">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-headline-sm text-caption font-semibold text-ink bg-surface-alt hover:bg-surface-container-low transition-colors border border-border/40 text-center cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-headline-sm text-caption font-semibold text-on-primary bg-role-accent-doctor hover:opacity-95 shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Menyimpan..." : "Simpan Pembaruan Deskripsi"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
