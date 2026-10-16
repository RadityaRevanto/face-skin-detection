"use client";

import { FileText, Eye } from "lucide-react";

type RecommendationFormCardProtocolProps = {
  title: string;
  setTitle: (v: string) => void;
  priorityLevel: "low" | "medium" | "high";
  setPriorityLevel: (v: "low" | "medium" | "high") => void;
  recommendationText: string;
  setRecommendationText: (v: string) => void;
};

export function RecommendationFormCardProtocol({
  title,
  setTitle,
  priorityLevel,
  setPriorityLevel,
  recommendationText,
  setRecommendationText,
}: RecommendationFormCardProtocolProps) {
  return (
    <section className="bg-surface rounded-2xl p-6 shadow-xs border border-border/50 flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-surface-container-low text-role-accent-doctor flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <h2 className="font-headline-md text-headline-md text-ink font-semibold">
            Isi Protokol Rekomendasi
          </h2>
        </div>
        <span className="font-caption text-caption text-ink-subtle font-medium">
          Bagian 2 dari 3
        </span>
      </div>

      {/* Judul Aturan / Langkah Rutinitas */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="ruleTitle"
          className="font-headline-sm text-caption text-ink font-semibold flex items-center gap-1"
        >
          Judul Aturan / Langkah Rutinitas <span className="text-danger font-bold">*</span>
        </label>
        <input
          id="ruleTitle"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Misal: Langkah 1: Cleansing Lembut Pagi Hari"
          className="w-full h-11 px-3.5 rounded-xl bg-surface-alt text-ink font-body-default text-body-default border border-border/40 focus:outline-none focus:bg-surface focus:ring-2 focus:ring-role-accent-doctor/30 placeholder:text-ink-subtle transition-all"
        />
        <p className="font-caption text-caption text-ink-subtle">
          Gunakan judul yang ringkas dan memandu urutan pemakaian harian.
        </p>
      </div>

      {/* Tingkat Prioritas Segmented Control */}
      <div className="flex flex-col gap-2">
        <span className="font-headline-sm text-caption text-ink font-semibold">
          Tingkat Prioritas
        </span>
        <div className="grid grid-cols-3 gap-3 p-1.5 bg-surface-container-low rounded-xl">
          {/* Pilihan Rendah */}
          <label className="cursor-pointer relative">
            <input
              type="radio"
              name="priorityLevel"
              value="low"
              checked={priorityLevel === "low"}
              onChange={() => setPriorityLevel("low")}
              className="peer sr-only"
            />
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-transparent text-ink-muted transition-all peer-checked:bg-surface peer-checked:text-info peer-checked:shadow-xs">
              <span className="w-2 h-2 rounded-full bg-info/40 peer-checked:bg-info" />
              <span className="font-headline-sm text-caption font-medium">Rendah</span>
              <span className="font-eyebrow text-eyebrow px-1.5 py-0.5 rounded bg-info/10 text-info font-semibold hidden md:inline">
                Tier 3
              </span>
            </div>
          </label>

          {/* Pilihan Sedang */}
          <label className="cursor-pointer relative">
            <input
              type="radio"
              name="priorityLevel"
              value="medium"
              checked={priorityLevel === "medium"}
              onChange={() => setPriorityLevel("medium")}
              className="peer sr-only"
            />
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-transparent text-ink-muted transition-all peer-checked:bg-surface peer-checked:text-warning peer-checked:shadow-xs">
              <span className="w-2 h-2 rounded-full bg-warning/40 peer-checked:bg-warning" />
              <span className="font-headline-sm text-caption font-medium">Sedang</span>
              <span className="font-eyebrow text-eyebrow px-1.5 py-0.5 rounded bg-warning/10 text-warning font-semibold hidden md:inline">
                Tier 2
              </span>
            </div>
          </label>

          {/* Pilihan Tinggi */}
          <label className="cursor-pointer relative">
            <input
              type="radio"
              name="priorityLevel"
              value="high"
              checked={priorityLevel === "high"}
              onChange={() => setPriorityLevel("high")}
              className="peer sr-only"
            />
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-transparent text-ink-muted transition-all peer-checked:bg-surface peer-checked:text-error peer-checked:shadow-xs">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
              <span className="font-headline-sm text-caption font-semibold">Tinggi</span>
              <span className="font-eyebrow text-eyebrow px-1.5 py-0.5 rounded bg-error-container/40 text-error font-semibold">
                Wajib
              </span>
            </div>
          </label>
        </div>
        <p className="font-caption text-caption text-ink-subtle">
          Prioritas Tinggi akan dimunculkan di urutan teratas pada kartu resep digital pasien.
        </p>
      </div>

      {/* Penjelasan Rekomendasi & Catatan Klinis */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="clinicalNotes"
            className="font-headline-sm text-caption text-ink font-semibold flex items-center gap-1"
          >
            Penjelasan Rekomendasi &amp; Catatan Klinis <span className="text-danger font-bold">*</span>
          </label>
          <span className="font-caption text-caption text-ink-subtle">
            {recommendationText.length} karakter
          </span>
        </div>
        <textarea
          id="clinicalNotes"
          rows={5}
          required
          value={recommendationText}
          onChange={(e) => setRecommendationText(e.target.value)}
          placeholder="Tuliskan instruksi klinis dan edukasi pemakaian komprehensif bagi pasien..."
          className="w-full p-3.5 rounded-xl bg-surface-alt text-ink font-body-default text-body-default border border-border/40 focus:outline-none focus:bg-surface focus:ring-2 focus:ring-role-accent-doctor/30 placeholder:text-ink-subtle transition-all resize-y leading-relaxed"
        />
        <div className="flex items-center justify-between mt-0.5">
          <p className="font-caption text-caption text-ink-subtle flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-role-accent-doctor shrink-0" />
            <span>Penjelasan ini akan dibaca langsung oleh pasien di aplikasi hasil diagnosis AI.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
