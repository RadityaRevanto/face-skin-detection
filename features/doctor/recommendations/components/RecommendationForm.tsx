"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

import { ROUTES } from "@/lib/constants";
import { api } from "@/lib/api";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";

import {
  RecommendationFormCardTarget,
  type RecommendationConcernOption,
  type RecommendationProductOption,
} from "./RecommendationFormCardTarget";
import { RecommendationFormCardProtocol } from "./RecommendationFormCardProtocol";
import { RecommendationFormCardStatus } from "./RecommendationFormCardStatus";

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
          ? `/skin-recommendations/${defaultValues.id}`
          : "/skin-recommendations";

      const payload = {
        concern_id: concernId,
        product_id: productId || null,
        title: trimmedTitle,
        recommendation_text: trimmedRecommendationText,
        priority_level: priorityLevel,
        is_active: isActive,
      };

      await (mode === "edit"
        ? api.patch<ApiResponse>(endpoint, payload)
        : api.post<ApiResponse>(endpoint, payload));

      router.push(ROUTES.DOCTOR.RECOMMENDATIONS);
      router.refresh();
    } catch (error) {
      console.error("Submit recommendation error:", error);
      setMessage(getUserFriendlyErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-28">
      {message && (
        <div className="flex items-center gap-3 rounded-xl bg-error-container/30 border border-error/30 p-4 text-error font-body-default text-body-default font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <RecommendationFormCardTarget
        concernId={concernId}
        setConcernId={setConcernId}
        concerns={concerns}
        productId={productId}
        setProductId={setProductId}
        products={products}
      />

      <RecommendationFormCardProtocol
        title={title}
        setTitle={setTitle}
        priorityLevel={priorityLevel}
        setPriorityLevel={setPriorityLevel}
        recommendationText={recommendationText}
        setRecommendationText={setRecommendationText}
      />

      <RecommendationFormCardStatus
        isActive={isActive}
        setIsActive={setIsActive}
        isSubmitting={isSubmitting}
        mode={mode}
        onCancel={() => router.push(ROUTES.DOCTOR.RECOMMENDATIONS)}
      />
    </form>
  );
}
