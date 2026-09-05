"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";

import { RecommendationActionIcon } from "./RecommendationActionIcon";

type DeleteRecommendationButtonProps = {
  recommendationId: string;
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
      await api.delete(`/skin-recommendations/${recommendationId}`);
      router.refresh();
    } catch (error) {
      console.error("Delete recommendation error:", error);
      alert(getUserFriendlyErrorMessage(error));
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
