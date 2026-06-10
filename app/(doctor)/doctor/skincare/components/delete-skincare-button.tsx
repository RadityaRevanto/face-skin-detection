"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { SkincareActionIcon } from "./skincare-action-icon";

type DeleteSkincareButtonProps = {
  productId: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
};

export function DeleteSkincareButton({ productId }: DeleteSkincareButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Yakin ingin menghapus produk skincare ini? Data yang dihapus tidak bisa dikembalikan.",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/doctor/skincare/${productId}`, {
        method: "DELETE",
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();

        console.error("Non JSON delete skincare response:", {
          status: response.status,
          statusText: response.statusText,
          body: text,
        });

        alert(
          `API tidak mengembalikan JSON. Status: ${response.status}. Cek route DELETE skincare.`,
        );

        return;
      }

      const result = (await response.json()) as ApiResponse;

      if (!response.ok) {
        alert(result.message || "Gagal menghapus produk skincare.");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Delete skincare error:", error);
      alert("Terjadi kesalahan saat menghapus produk skincare.");
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
      <SkincareActionIcon type='delete' />
    </Button>
  );
}
