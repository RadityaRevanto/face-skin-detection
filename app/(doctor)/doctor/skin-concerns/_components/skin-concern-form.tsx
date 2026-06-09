"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES, SKIN_CLASSES } from "@/lib/constants";
import type { SkinConcern } from "@/app/(doctor)/doctor/_lib/doctor-content-data";

type SkinConcernFormProps = {
  mode?: "create" | "edit";
  initialValues?: SkinConcern;
};

export function SkinConcernForm({
  mode = "create",
  initialValues,
}: SkinConcernFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    // TODO: Connect to skin concern create/update API when backend is ready.
    await new Promise((resolve) => setTimeout(resolve, 600));

    router.push(ROUTES.DOCTOR.SKIN_CONCERNS);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="rounded-2xl border-slate-100! bg-white! p-6 text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950! sm:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="concern-name">Nama Concern</Label>
            <Input
              id="concern-name"
              name="name"
              placeholder="Contoh: Inflammatory Acne"
              defaultValue={initialValues?.name}
              required
              className="h-11 rounded-xl border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detected-class">Class AI</Label>
            <select
              id="detected-class"
              name="detectedClass"
              required
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              defaultValue={initialValues?.detectedClass ?? ""}
            >
              <option value="" disabled>
                Pilih class hasil AI
              </option>
              {SKIN_CLASSES.map((skinClass) => (
                <option key={skinClass} value={skinClass}>
                  {skinClass}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Deskripsi</Label>
            <textarea
              id="description"
              name="description"
              rows={5}
              required
              placeholder="Jelaskan kondisi kulit ini dan konteks rekomendasi yang relevan."
              defaultValue={initialValues?.description}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            />
            <p className="text-xs text-slate-500">
              Concern ini akan menjadi penghubung antara hasil analisis AI dan
              rule rekomendasi skincare.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href={ROUTES.DOCTOR.SKIN_CONCERNS}>
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
              ? "Update Concern"
              : "Simpan Concern"}
        </Button>
      </div>
    </form>
  );
}
