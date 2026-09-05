"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { adminService } from "@/features/admin/services/adminService";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";

import { ActionIcon } from "./DoctorActionIcon";

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
      // Proxy lama POST /suspend → BE PATCH /admin/users/{uuid}/toggle-active.
      await adminService.toggleActive(doctorId);
      router.refresh();
    } catch (error) {
      alert(getUserFriendlyErrorMessage(error));
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
