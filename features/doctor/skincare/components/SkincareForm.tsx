"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { api } from "@/lib/api";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";

import {
  type ApiResponse,
  type SkincareFormProps,
} from "./SkincareFormTypes";
import { SkincareFormBody } from "./SkincareFormBody";

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
  const [genderSuitability, setGenderSuitability] = useState(
    defaultValues?.genderSuitability ?? "unisex",
  );

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
          ? `/skincare-products/${defaultValues.id}`
          : "/skincare-products";

      await (mode === "edit"
        ? api.patch<ApiResponse>(endpoint, {
            concern_id: concernId,
            skin_type_id: skinTypeId,
            name: trimmedName,
            category: trimmedCategory,
            gender: genderSuitability,
            key_ingredients: trimmedKeyIngredients,
            usage_instruction: trimmedUsageInstruction,
            warning: trimmedWarning || null,
            is_active: isActive,
          })
        : api.post<ApiResponse>(endpoint, {
            concern_id: concernId,
            skin_type_id: skinTypeId,
            name: trimmedName,
            category: trimmedCategory,
            gender: genderSuitability,
            key_ingredients: trimmedKeyIngredients,
            usage_instruction: trimmedUsageInstruction,
            warning: trimmedWarning || null,
            is_active: isActive,
          })
      );

      router.push(ROUTES.DOCTOR.SKINCARE);
      router.refresh();
    } catch (error) {
      console.error("Submit skincare error:", error);
      setMessage(getUserFriendlyErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className='overflow-hidden rounded-2xl border-slate-100! bg-white! text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!'>
      <form onSubmit={handleSubmit} className='space-y-6 p-6'>
        <SkincareFormBody
          message={message}
          concernId={concernId}
          setConcernId={setConcernId}
          skinTypeId={skinTypeId}
          setSkinTypeId={setSkinTypeId}
          name={name}
          setName={setName}
          category={category}
          setCategory={setCategory}
          genderSuitability={genderSuitability}
          setGenderSuitability={setGenderSuitability}
          keyIngredients={keyIngredients}
          setKeyIngredients={setKeyIngredients}
          usageInstruction={usageInstruction}
          setUsageInstruction={setUsageInstruction}
          warning={warning}
          setWarning={setWarning}
          isActive={isActive}
          setIsActive={setIsActive}
          isSubmitting={isSubmitting}
          onCancel={() => router.push(ROUTES.DOCTOR.SKINCARE)}
          concerns={concerns}
          skinTypes={skinTypes}
          submitLabel={
            mode === "edit" ? "Simpan Perubahan" : "Tambah Skincare"
          }
        />
      </form>
    </Card>
  );
}
