"use client";

import { ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";

type SkincareFormClinicalDetailsProps = {
  concernId: string;
  setConcernId: (v: string) => void;
  skinTypeId: string;
  setSkinTypeId: (v: string) => void;
  concerns: { id: string; name: string }[];
  skinTypes: { id: string; name: string }[];
  keyIngredients: string;
  setKeyIngredients: (v: string) => void;
  usageInstruction: string;
  setUsageInstruction: (v: string) => void;
  warning: string;
  setWarning: (v: string) => void;
};

export function SkincareFormClinicalDetails({
  concernId,
  setConcernId,
  skinTypeId,
  setSkinTypeId,
  concerns,
  skinTypes,
  keyIngredients,
  setKeyIngredients,
  usageInstruction,
  setUsageInstruction,
  warning,
  setWarning,
}: SkincareFormClinicalDetailsProps) {
  return (
    <>
      {/* Card 2: Klasifikasi Dermatologi */}
      <section className="bg-surface rounded-xl p-6 md:p-8 shadow-xs border border-border/50 space-y-5">
        <div className="flex items-center gap-3 pb-2 border-b border-border/30">
          <div className="w-8 h-8 rounded-lg bg-surface-container-low text-role-accent-doctor flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md text-ink font-semibold">
              2. Klasifikasi Dermatologi
            </h2>
            <p className="font-caption text-caption text-ink-subtle">
              Pemetaan kondisi klinis dan dermatofisiologi target pasien
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              className="block font-headline-sm text-caption text-ink font-semibold mb-1.5"
              htmlFor="skin-concern"
            >
              Target Skin Concern <span className="text-danger">*</span>
            </label>
            <select
              id="skin-concern"
              value={concernId}
              onChange={(e) => setConcernId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-alt text-ink font-body-default text-body-default border border-border/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-doctor/30 cursor-pointer"
            >
              <option value="">Pilih target skin concern</option>
              {concerns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block font-headline-sm text-caption text-ink font-semibold mb-1.5"
              htmlFor="skin-type"
            >
              Jenis Kulit yang Cocok <span className="text-danger">*</span>
            </label>
            <select
              id="skin-type"
              value={skinTypeId}
              onChange={(e) => setSkinTypeId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-alt text-ink font-body-default text-body-default border border-border/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-doctor/30 cursor-pointer"
            >
              <option value="">Pilih jenis kulit</option>
              {skinTypes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Card 3: Detail Klinis & Formulasi */}
      <section className="bg-surface rounded-xl p-6 md:p-8 shadow-xs border border-border/50 space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-border/30">
          <div>
            <h2 className="font-headline-md text-headline-md text-ink font-semibold">
              3. Detail Klinis &amp; Formulasi
            </h2>
            <p className="font-caption text-caption text-ink-subtle">
              Kandungan terapeutik, regimen aplikasi harian, dan peringatan medis
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container text-ink font-caption text-caption rounded-full font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-role-accent-doctor" />
            Standar Medis
          </span>
        </div>

        <div>
          <label
            className="block font-headline-sm text-caption text-ink font-semibold mb-1.5"
            htmlFor="key-ingredients"
          >
            Kandungan Utama / Key Ingredients <span className="text-danger">*</span>
          </label>
          <textarea
            id="key-ingredients"
            rows={3}
            value={keyIngredients}
            onChange={(e) => setKeyIngredients(e.target.value)}
            placeholder="Contoh: Salicylic Acid 2%, Centella Asiatica Extract 1%, Zinc PCA..."
            className="w-full px-4 py-3 rounded-xl bg-surface-alt text-ink font-body-default text-body-default border border-border/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-doctor/30 resize-y"
          />
        </div>

        <div>
          <label
            className="block font-headline-sm text-caption text-ink font-semibold mb-1.5"
            htmlFor="usage-instructions"
          >
            Petunjuk Penggunaan &amp; Regimen Klinis <span className="text-danger">*</span>
          </label>
          <textarea
            id="usage-instructions"
            rows={3}
            value={usageInstruction}
            onChange={(e) => setUsageInstruction(e.target.value)}
            placeholder="Jelaskan frekuensi pemakaian (pagi/malam), durasi kontak kulit, serta tata cara aplikasi..."
            className="w-full px-4 py-3 rounded-xl bg-surface-alt text-ink font-body-default text-body-default border border-border/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-doctor/30 resize-y"
          />
        </div>

        <div className="p-4 rounded-xl bg-error-container/20 border border-error/20 space-y-2">
          <label
            className="flex items-center gap-2 font-headline-sm text-caption text-error font-semibold"
            htmlFor="warnings"
          >
            <AlertCircle className="w-4 h-4 text-error" />
            Peringatan &amp; Kontraindikasi <span className="text-error">*</span>
          </label>
          <textarea
            id="warnings"
            rows={3}
            value={warning}
            onChange={(e) => setWarning(e.target.value)}
            placeholder="Contoh: Hindari area kontur mata. Jangan dikombinasikan dengan retinoid konsentrasi tinggi..."
            className="w-full px-4 py-3 rounded-xl bg-surface text-ink font-body-default text-body-default border border-error/30 focus:outline-none focus:ring-2 focus:ring-error/40 resize-y"
          />
        </div>
      </section>
    </>
  );
}
