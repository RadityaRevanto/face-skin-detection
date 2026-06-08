"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  routineStepOptions,
  severityOptions,
  skinConcerns,
  skincareProducts,
  skinTypeOptions,
  type SkincareRecommendation,
} from "@/app/(doctor)/doctor/_lib/doctor-content-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/constants";

type RecommendationFormProps = {
  mode?: "create" | "edit";
  initialValues?: SkincareRecommendation;
};

export function RecommendationForm({
  mode = "create",
  initialValues,
}: RecommendationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    // TODO: Connect to recommendation create/update API when backend is ready.
    await new Promise((resolve) => setTimeout(resolve, 600));

    router.push(ROUTES.DOCTOR.RECOMMENDATIONS);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="rounded-2xl border-slate-100! bg-white! p-6 text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950! sm:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="concern">Skin Concern dari AI</Label>
            <select
              id="concern"
              name="concern"
              required
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              defaultValue={initialValues?.concern ?? ""}
            >
              <option value="" disabled>
                Pilih skin concern
              </option>
              {skinConcerns.map((concern) => (
                <option key={concern.id} value={concern.name}>
                  {concern.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severity</Label>
            <select
              id="severity"
              name="severity"
              required
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              defaultValue={initialValues?.severity ?? ""}
            >
              <option value="" disabled>
                Pilih severity
              </option>
              {severityOptions.map((severity) => (
                <option key={severity} value={severity}>
                  {severity}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skin-type">Tipe Kulit</Label>
            <select
              id="skin-type"
              name="skinType"
              required
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              defaultValue={initialValues?.skinType ?? ""}
            >
              <option value="" disabled>
                Pilih tipe kulit
              </option>
              {skinTypeOptions.map((skinType) => (
                <option key={skinType} value={skinType}>
                  {skinType}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="routine-step">Step Routine</Label>
            <select
              id="routine-step"
              name="routineStep"
              required
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              defaultValue={initialValues?.routineStep ?? ""}
            >
              <option value="" disabled>
                Pilih step routine
              </option>
              {routineStepOptions.map((step) => (
                <option key={step} value={step}>
                  {step}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="product">Produk Skincare</Label>
            <select
              id="product"
              name="product"
              required
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              defaultValue={initialValues?.productName ?? ""}
            >
              <option value="" disabled>
                Pilih produk skincare
              </option>
              {skincareProducts.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name} - {product.brand}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="doctor-note">Catatan Dokter</Label>
            <textarea
              id="doctor-note"
              name="doctorNote"
              rows={4}
              required
              placeholder="Contoh: Gunakan pada malam hari, hentikan jika terjadi iritasi."
              defaultValue={initialValues?.doctorNote}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            />
          </div>
        </div>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href={ROUTES.DOCTOR.RECOMMENDATIONS}>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl px-5 font-semibold"
          >
            Batal
          </Button>
        </Link>
        <Button
          type="submit"
          variant="success"
          disabled={isSubmitting}
          className="h-11 rounded-xl px-5 font-semibold"
        >
          {isSubmitting
            ? "Menyimpan..."
            : mode === "edit"
              ? "Update Rekomendasi"
              : "Simpan Rekomendasi"}
        </Button>
      </div>
    </form>
  );
}
