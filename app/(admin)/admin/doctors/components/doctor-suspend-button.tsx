"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { ActionIcon } from "./doctor-action-icon";

type DoctorSuspendButtonProps = {
  doctorId: string;
  isActive: boolean;
};

export function DoctorSuspendButton({
  doctorId,
  isActive,
}: DoctorSuspendButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSuspend() {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/doctors/${doctorId}/suspend`, {
        method: "POST",
      });

      if (!response.ok) {
        const result = await response.json();
        alert(result.message || "Gagal mengubah status dokter.");
        return;
      }

      router.refresh();
    } catch {
      alert("Terjadi kesalahan saat mengubah status dokter.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      type='button'
      variant='ghost'
      size='sm'
      title={isActive ? "Suspend" : "Activate"}
      disabled={isLoading}
      onClick={handleSuspend}
      className='h-10 w-10 rounded-xl p-0 text-gray-400 transition-all duration-200 hover:bg-rose-50! hover:text-rose-600'
    >
      <ActionIcon type='suspend' />
    </Button>
  );
}
