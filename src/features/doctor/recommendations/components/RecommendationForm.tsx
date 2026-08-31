"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";

import {
  RecommendationFormFields,
  type RecommendationConcernOption,
  type RecommendationProductOption,
} from "./RecommendationFormFields";

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

        <RecommendationFormFields
          concerns={concerns}
          products={products}
          concernId={concernId}
          setConcernId={setConcernId}
          productId={productId}
          setProductId={setProductId}
          title={title}
          setTitle={setTitle}
          recommendationText={recommendationText}
          setRecommendationText={setRecommendationText}
          priorityLevel={priorityLevel}
          setPriorityLevel={setPriorityLevel}
          isActive={isActive}
          setIsActive={setIsActive}
          isSubmitting={isSubmitting}
          mode={mode}
          onCancel={() => router.push(ROUTES.DOCTOR.RECOMMENDATIONS)}
        />
      </form>
    </Card>
  );
}
