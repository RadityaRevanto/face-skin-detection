"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { RecommendationActionIcon } from "./recommendation-action-icon";

type DeleteRecommendationButtonProps = {
  recommendationId: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
};

export function DeleteRecommendationButton({
  recommendationId,
}: DeleteRecommendationButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Yakin ingin menghapus rekomendasi ini? Data yang dihapus tidak bisa dikembalikan.",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/doctor/recommendations/${recommendationId}`,
        {
          method: "DELETE",
        },
      );

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();

        console.error("Non JSON delete response:", {
          status: response.status,
          statusText: response.statusText,
          body: text,
        });

        alert(
          `API tidak mengembalikan JSON. Status: ${response.status}. Cek API route delete.`,
        );

        return;
      }

      const result = (await response.json()) as ApiResponse;

      if (!response.ok) {
        alert(result.message || "Gagal menghapus rekomendasi.");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Delete recommendation error:", error);
      alert("Terjadi kesalahan saat menghapus rekomendasi.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button
      type='button'
      variant='ghost'
      size='sm'
      title='Delete'
      disabled={isDeleting}
      onClick={handleDelete}
      className='h-10 w-10 rounded-xl p-0 text-gray-400 transition-all duration-200 hover:bg-rose-50! hover:text-rose-600'
    >
      <RecommendationActionIcon type='delete' />
    </Button>
  );
}
