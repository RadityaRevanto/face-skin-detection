"use client";

import { Button } from "@/components/ui/button";
import { categoryOptions } from "./SkincareFormTypes";
import { SkincareFormInput } from "./SkincareFormInput";
import { SkincareFormSelect } from "./SkincareFormSelect";
import { SkincareFormTextarea } from "./SkincareFormTextarea";

type SkincareFormBodyProps = {
  message: string;
  concernId: string;
  setConcernId: (v: string) => void;
  skinTypeId: string;
  setSkinTypeId: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  genderSuitability: string;
  setGenderSuitability: (v: string) => void;
  keyIngredients: string;
  setKeyIngredients: (v: string) => void;
  usageInstruction: string;
  setUsageInstruction: (v: string) => void;
  warning: string;
  setWarning: (v: string) => void;
  isActive: boolean;
  setIsActive: (v: boolean) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  concerns: { id: string; name: string }[];
  skinTypes: { id: string; name: string }[];
  submitLabel: string;
};

export function SkincareFormBody({
  message,
  concernId,
  setConcernId,
  skinTypeId,
  setSkinTypeId,
  name,
  setName,
  category,
  setCategory,
  genderSuitability,
  setGenderSuitability,
  keyIngredients,
  setKeyIngredients,
  usageInstruction,
  setUsageInstruction,
  warning,
  setWarning,
  isActive,
  setIsActive,
  isSubmitting,
  onCancel,
  concerns,
  skinTypes,
  submitLabel,
}: SkincareFormBodyProps) {
  return (
    <>
      {message ? (
        <div className='rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700'>
          {message}
        </div>
      ) : null}

      <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
        <SkincareFormSelect
          id='concernId'
          label='Skin Concern'
          value={concernId}
          onChange={setConcernId}
          placeholder='Pilih skin concern'
          options={concerns.map((c) => ({ value: c.id, label: c.name }))}
        />
        <SkincareFormSelect
          id='skinTypeId'
          label='Jenis Kulit'
          value={skinTypeId}
          onChange={setSkinTypeId}
          placeholder='Pilih jenis kulit'
          options={skinTypes.map((s) => ({ value: s.id, label: s.name }))}
        />
      </div>

      <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
        <SkincareFormInput
          id='name'
          label='Nama Produk'
          value={name}
          onChange={setName}
          placeholder='Contoh: Gentle Low pH Cleanser'
        />
        <SkincareFormSelect
          id='category'
          label='Kategori'
          value={category}
          onChange={setCategory}
          placeholder='Pilih kategori'
          options={categoryOptions.map((c) => ({ value: c, label: c }))}
        />
      </div>

      <SkincareFormSelect
        id='genderSuitability'
        label='Peruntukan Gender'
        value={genderSuitability}
        onChange={setGenderSuitability}
        options={[
          { value: "unisex", label: "Unisex" },
          { value: "laki_laki", label: "Laki-laki" },
          { value: "perempuan", label: "Perempuan" },
        ]}
      />

      <SkincareFormInput
        id='keyIngredients'
        label='Key Ingredients'
        value={keyIngredients}
        onChange={setKeyIngredients}
        placeholder='Contoh: Niacinamide, Centella Asiatica, Ceramide'
      />

      <SkincareFormTextarea
        id='usageInstruction'
        label='Instruksi Penggunaan'
        value={usageInstruction}
        onChange={setUsageInstruction}
        rows={4}
        placeholder='Contoh: Gunakan pagi dan malam setelah membersihkan wajah.'
      />

      <SkincareFormTextarea
        id='warning'
        label='Warning / Catatan'
        value={warning}
        onChange={setWarning}
        rows={3}
        placeholder='Contoh: Hentikan penggunaan jika muncul iritasi berlebihan.'
      />

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
          onClick={onCancel}
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
          {isSubmitting ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </>
  );
}
