"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";

type RecommendationConcernOption = {
  id: string;
  name: string;
};

type RecommendationProductOption = {
  id: string;
  name: string;
  category: string;
};

type RecommendationFormProps = {
  concerns: RecommendationConcernOption[];
  products: RecommendationProductOption[];
  defaultValues?: {
    id?: string;
    concernId?: string;
    productId?: string;
    title?: string;
    recommendationText?: string;
    priorityLevel?: "low" | "medium" | "high";
    isActive?: boolean;
  };
  mode?: "create" | "edit";
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

export function RecommendationForm({
  concerns,
  products,
  defaultValues,
  mode = "create",
}: RecommendationFormProps) {
  const router = useRouter();

  const [concernId, setConcernId] = useState(defaultValues?.concernId ?? "");
  const [productId, setProductId] = useState(defaultValues?.productId ?? "");
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [recommendationText, setRecommendationText] = useState(
    defaultValues?.recommendationText ?? "",
  );
  const [priorityLevel, setPriorityLevel] = useState<"low" | "medium" | "high">(
    defaultValues?.priorityLevel ?? "medium",
  );
  const [isActive, setIsActive] = useState(defaultValues?.isActive ?? true);

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const trimmedTitle = title.trim();
    const trimmedRecommendationText = recommendationText.trim();

    if (!concernId) {
      setMessage("Skin concern wajib dipilih.");
      return;
    }

    if (!trimmedTitle) {
      setMessage("Judul rekomendasi wajib diisi.");
      return;
    }

    if (!trimmedRecommendationText) {
      setMessage("Isi rekomendasi wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint =
        mode === "edit" && defaultValues?.id
          ? `/api/doctor/recommendations/${defaultValues.id}`
          : "/api/doctor/recommendations";

      const response = await fetch(endpoint, {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          concernId,
          productId: productId || null,
          title: trimmedTitle,
          recommendationText: trimmedRecommendationText,
          priorityLevel,
          isActive,
        }),
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();

        console.error("Non JSON response:", {
          endpoint,
          status: response.status,
          statusText: response.statusText,
          body: text,
        });

        setMessage(
          `API tidak mengembalikan JSON. Status: ${response.status}. Pastikan file app/api/doctor/recommendations/route.ts sudah ada dan dev server sudah direstart.`,
        );

        return;
      }

      const result = (await response.json()) as ApiResponse;

      if (!response.ok) {
        setMessage(result.message || "Gagal menyimpan rekomendasi.");
        return;
      }

      router.push(ROUTES.DOCTOR.RECOMMENDATIONS);
      router.refresh();
    } catch (error) {
      console.error("Submit recommendation error:", error);
      setMessage("Terjadi kesalahan saat menyimpan rekomendasi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className='overflow-hidden rounded-2xl border-slate-100! bg-white! text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!'>
      <form onSubmit={handleSubmit} className='space-y-6 p-6'>
        {message ? (
          <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700'>
            {message}
          </div>
        ) : null}

        <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
          <div>
            <label
              htmlFor='concernId'
              className='mb-2 block text-sm font-semibold text-gray-700'
            >
              Skin Concern
            </label>

            <select
              id='concernId'
              value={concernId}
              onChange={(event) => setConcernId(event.target.value)}
              className='h-12 w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 text-sm font-medium text-gray-700 outline-none transition-colors focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100'
            >
              <option value=''>Pilih skin concern</option>
              {concerns.map((concern) => (
                <option key={concern.id} value={concern.id}>
                  {concern.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor='productId'
              className='mb-2 block text-sm font-semibold text-gray-700'
            >
              Produk Skincare
            </label>

            <select
              id='productId'
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              className='h-12 w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 text-sm font-medium text-gray-700 outline-none transition-colors focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100'
            >
              <option value=''>Tanpa produk khusus</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
          <div>
            <label
              htmlFor='title'
              className='mb-2 block text-sm font-semibold text-gray-700'
            >
              Judul / Routine Step
            </label>

            <input
              id='title'
              type='text'
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder='Contoh: Sunscreen wajib pagi'
              className='h-12 w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 text-sm font-medium text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100'
            />
          </div>

          <div>
            <label
              htmlFor='priorityLevel'
              className='mb-2 block text-sm font-semibold text-gray-700'
            >
              Priority Level
            </label>

            <select
              id='priorityLevel'
              value={priorityLevel}
              onChange={(event) =>
                setPriorityLevel(
                  event.target.value as "low" | "medium" | "high",
                )
              }
              className='h-12 w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 text-sm font-medium text-gray-700 outline-none transition-colors focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100'
            >
              <option value='low'>Low Priority</option>
              <option value='medium'>Medium Priority</option>
              <option value='high'>High Priority</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor='recommendationText'
            className='mb-2 block text-sm font-semibold text-gray-700'
          >
            Catatan Rekomendasi
          </label>

          <textarea
            id='recommendationText'
            rows={5}
            value={recommendationText}
            onChange={(event) => setRecommendationText(event.target.value)}
            placeholder='Tulis rekomendasi dokter untuk user...'
            className='w-full resize-none rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm font-medium leading-6 text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100'
          />
        </div>

        <label className='flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3'>
          <input
            type='checkbox'
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className='h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500'
          />

          <span className='text-sm font-semibold text-gray-700'>
            Rekomendasi aktif
          </span>
        </label>

        <div className='flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end'>
          <Button
            type='button'
            variant='ghost'
            disabled={isSubmitting}
            onClick={() => router.push(ROUTES.DOCTOR.RECOMMENDATIONS)}
            className='h-11 rounded-xl px-5 font-semibold text-gray-500 hover:bg-gray-50!'
          >
            Batal
          </Button>

          <Button
            type='submit'
            variant='success'
            disabled={isSubmitting}
            className='h-11 rounded-xl px-5 font-semibold'
          >
            {isSubmitting
              ? "Menyimpan..."
              : mode === "edit"
                ? "Simpan Perubahan"
                : "Tambah Rekomendasi"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
