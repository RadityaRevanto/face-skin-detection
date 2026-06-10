"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";

type SkincareConcernOption = {
  id: string;
  name: string;
};

type SkincareTypeOption = {
  id: string;
  name: string;
};

type SkincareFormProps = {
  mode?: "create" | "edit";
  concerns: SkincareConcernOption[];
  skinTypes: SkincareTypeOption[];
  defaultValues?: {
    id?: string;
    concernId?: string;
    skinTypeId?: string;
    name?: string;
    category?: string;
    keyIngredients?: string;
    usageInstruction?: string;
    warning?: string;
    isActive?: boolean;
  };
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

const categoryOptions = [
  "Cleanser",
  "Toner",
  "Serum",
  "Moisturizer",
  "Sunscreen",
  "Treatment",
  "Mask",
  "Exfoliator",
];

export function SkincareForm({
  mode = "create",
  concerns,
  skinTypes,
  defaultValues,
}: SkincareFormProps) {
  const router = useRouter();

  const [concernId, setConcernId] = useState(defaultValues?.concernId ?? "");
  const [skinTypeId, setSkinTypeId] = useState(defaultValues?.skinTypeId ?? "");
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [category, setCategory] = useState(defaultValues?.category ?? "");
  const [keyIngredients, setKeyIngredients] = useState(
    defaultValues?.keyIngredients ?? "",
  );
  const [usageInstruction, setUsageInstruction] = useState(
    defaultValues?.usageInstruction ?? "",
  );
  const [warning, setWarning] = useState(defaultValues?.warning ?? "");
  const [isActive, setIsActive] = useState(defaultValues?.isActive ?? true);

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const trimmedKeyIngredients = keyIngredients.trim();
    const trimmedUsageInstruction = usageInstruction.trim();
    const trimmedWarning = warning.trim();

    if (!concernId) {
      setMessage("Skin concern wajib dipilih.");
      return;
    }

    if (!skinTypeId) {
      setMessage("Jenis kulit wajib dipilih.");
      return;
    }

    if (!trimmedName) {
      setMessage("Nama produk wajib diisi.");
      return;
    }

    if (!trimmedCategory) {
      setMessage("Kategori produk wajib dipilih.");
      return;
    }

    if (!trimmedKeyIngredients) {
      setMessage("Key ingredients wajib diisi.");
      return;
    }

    if (!trimmedUsageInstruction) {
      setMessage("Instruksi penggunaan wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint =
        mode === "edit" && defaultValues?.id
          ? `/api/doctor/skincare/${defaultValues.id}`
          : "/api/doctor/skincare";

      const response = await fetch(endpoint, {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          concernId,
          skinTypeId,
          name: trimmedName,
          category: trimmedCategory,
          keyIngredients: trimmedKeyIngredients,
          usageInstruction: trimmedUsageInstruction,
          warning: trimmedWarning || null,
          isActive,
        }),
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();

        console.error("Non JSON skincare response:", {
          endpoint,
          status: response.status,
          statusText: response.statusText,
          body: text,
        });

        setMessage(
          `API tidak mengembalikan JSON. Status: ${response.status}. Pastikan route API skincare sudah dibuat dan dev server sudah direstart.`,
        );

        return;
      }

      const result = (await response.json()) as ApiResponse;

      if (!response.ok) {
        setMessage(result.message || "Gagal menyimpan produk skincare.");
        return;
      }

      router.push(ROUTES.DOCTOR.SKINCARE);
      router.refresh();
    } catch (error) {
      console.error("Submit skincare error:", error);
      setMessage("Terjadi kesalahan saat menyimpan produk skincare.");
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
              htmlFor='skinTypeId'
              className='mb-2 block text-sm font-semibold text-gray-700'
            >
              Jenis Kulit
            </label>

            <select
              id='skinTypeId'
              value={skinTypeId}
              onChange={(event) => setSkinTypeId(event.target.value)}
              className='h-12 w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 text-sm font-medium text-gray-700 outline-none transition-colors focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100'
            >
              <option value=''>Pilih jenis kulit</option>
              {skinTypes.map((skinType) => (
                <option key={skinType.id} value={skinType.id}>
                  {skinType.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
          <div>
            <label
              htmlFor='name'
              className='mb-2 block text-sm font-semibold text-gray-700'
            >
              Nama Produk
            </label>

            <input
              id='name'
              type='text'
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder='Contoh: Gentle Low pH Cleanser'
              className='h-12 w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 text-sm font-medium text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100'
            />
          </div>

          <div>
            <label
              htmlFor='category'
              className='mb-2 block text-sm font-semibold text-gray-700'
            >
              Kategori
            </label>

            <select
              id='category'
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className='h-12 w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 text-sm font-medium text-gray-700 outline-none transition-colors focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100'
            >
              <option value=''>Pilih kategori</option>
              {categoryOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor='keyIngredients'
            className='mb-2 block text-sm font-semibold text-gray-700'
          >
            Key Ingredients
          </label>

          <input
            id='keyIngredients'
            type='text'
            value={keyIngredients}
            onChange={(event) => setKeyIngredients(event.target.value)}
            placeholder='Contoh: Niacinamide, Centella Asiatica, Ceramide'
            className='h-12 w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 text-sm font-medium text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100'
          />
        </div>

        <div>
          <label
            htmlFor='usageInstruction'
            className='mb-2 block text-sm font-semibold text-gray-700'
          >
            Instruksi Penggunaan
          </label>

          <textarea
            id='usageInstruction'
            rows={4}
            value={usageInstruction}
            onChange={(event) => setUsageInstruction(event.target.value)}
            placeholder='Contoh: Gunakan pagi dan malam setelah membersihkan wajah.'
            className='w-full resize-none rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm font-medium leading-6 text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100'
          />
        </div>

        <div>
          <label
            htmlFor='warning'
            className='mb-2 block text-sm font-semibold text-gray-700'
          >
            Warning / Catatan
          </label>

          <textarea
            id='warning'
            rows={3}
            value={warning}
            onChange={(event) => setWarning(event.target.value)}
            placeholder='Contoh: Hentikan penggunaan jika muncul iritasi berlebihan.'
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
            Produk skincare aktif
          </span>
        </label>

        <div className='flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end'>
          <Button
            type='button'
            variant='ghost'
            disabled={isSubmitting}
            onClick={() => router.push(ROUTES.DOCTOR.SKINCARE)}
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
                : "Tambah Skincare"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
