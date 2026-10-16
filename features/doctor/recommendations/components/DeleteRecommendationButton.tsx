"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { api } from "@/lib/api";
import { customToast } from "@/lib/custom-toast";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";

import { RecommendationActionIcon } from "./RecommendationActionIcon";

type DeleteRecommendationButtonProps = {
  recommendationId: string;
  recommendationTitle?: string;
};

export function DeleteRecommendationButton({
  recommendationId,
  recommendationTitle,
}: DeleteRecommendationButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await api.delete(`/skin-recommendations/${recommendationId}`);
      customToast.success("Rekomendasi dihapus");
      setOpen(false);
      router.refresh();
    } catch (error) {
      customToast.error("Gagal", { description: getUserFriendlyErrorMessage(error) });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        title="Hapus"
        aria-label="Hapus rekomendasi"
        disabled={isDeleting}
        onClick={() => setOpen(true)}
        className="h-9 w-9 rounded-[var(--radius-control)] p-0 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
      >
        <RecommendationActionIcon type="delete" />
      </Button>

      <ConfirmDialog
        open={open}
        title="Hapus rekomendasi?"
        description={
          recommendationTitle
            ? `"${recommendationTitle}" akan dihapus permanen. Data tidak bisa dikembalikan.`
            : "Rekomendasi akan dihapus permanen. Data tidak bisa dikembalikan."
        }
        confirmLabel="Hapus Rekomendasi"
        tone="danger"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}