"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/constants";
import {
  productCategoryOptions,
  skinConcerns,
  skinTypeOptions,
  type SkincareProduct,
} from "@/app/(doctor)/doctor/_lib/doctor-content-data";

type SkincareFormProps = {
  mode?: "create" | "edit";
  initialValues?: SkincareProduct;
};

export function SkincareForm({
  mode = "create",
  initialValues,
}: SkincareFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    // TODO: Connect to skincare create/update API when backend is ready.
    await new Promise((resolve) => setTimeout(resolve, 600));

    router.push(ROUTES.DOCTOR.SKINCARE);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="rounded-2xl border-slate-100! bg-white! p-6 text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950! sm:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="product-name">Nama Produk</Label>
            <Input
              id="product-name"
              name="productName"
              placeholder="Contoh: Gentle Hydrating Cleanser"
              defaultValue={initialValues?.name}
              required
              className="h-11 rounded-xl border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              name="brand"
              placeholder="Contoh: DermaCare"
              defaultValue={initialValues?.brand}
              required
              className="h-11 rounded-xl border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <select
              id="category"
              name="category"
              required
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              defaultValue={initialValues?.category ?? ""}
            >
              <option value="" disabled>
                Pilih kategori
              </option>
              {productCategoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="concern">Skin Concern</Label>
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

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Deskripsi Produk</Label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Jelaskan manfaat produk, bahan aktif, dan cara penggunaan."
              defaultValue={initialValues?.description}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-950 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="product-image">Gambar Produk</Label>
            <Input
              id="product-image"
              name="productImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="h-11 rounded-xl border-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-emerald-700"
            />
            <p className="text-xs text-slate-500">
              Format JPG, PNG, atau WEBP. Maksimal 5MB.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href={ROUTES.DOCTOR.SKINCARE}>
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
              ? "Update Skincare"
              : "Simpan Skincare"}
        </Button>
      </div>
    </form>
  );
}
