"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { adminService, type AdminUser } from "@/features/admin/services/adminService";
import { customToast } from "@/lib/custom-toast";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";
import { SuspendUserModal } from "@/features/admin/users/components/SuspendUserModal";
import type { DoctorDetail } from "../lib/doctorDetailTypes";
import { DoctorDossierHeader } from "./DoctorDossierHeader";
import { DoctorProfileCard } from "./DoctorProfileCard";
import { DoctorCredentialsCard } from "./DoctorCredentialsCard";
import { DoctorDocumentIntegrityCard } from "./DoctorDocumentIntegrityCard";

type DoctorDetailContentProps = {
  doctor: DoctorDetail;
};

export function DoctorDetailContent({ doctor }: DoctorDetailContentProps) {
  const queryClient = useQueryClient();
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleStatus = async (uuid: string) => {
    setIsSubmitting(true);
    const targetStatus = !doctor.isActive;
    try {
      await adminService.toggleActive(uuid);
      customToast.success(
        targetStatus
          ? "Akun dokter berhasil diaktifkan kembali"
          : "Akun dokter berhasil ditangguhkan"
      );
      queryClient.invalidateQueries({ queryKey: ["admin", "doctor", doctor.id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "doctors"] });
    } catch (err) {
      customToast.error("Gagal mengubah status akun", {
        description: getUserFriendlyErrorMessage(err),
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const adminUserForModal: AdminUser = {
    id: 0,
    uuid: doctor.id,
    full_name: doctor.name,
    email: doctor.email,
    role: "doctor",
    is_active: doctor.isActive,
    created_at: doctor.joinedAt,
    updated_at: doctor.joinedAt,
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* 1. Header with Status & Dossier CTA */}
      <DoctorDossierHeader doctor={doctor} />

      {/* 2. Main 12-Column Dossier Grid matching index5.html */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1280px]">
        {/* Left Column (4 cols) */}
        <div className="lg:col-span-4">
          <DoctorProfileCard
            doctor={doctor}
            onToggleStatus={() => setIsSuspendModalOpen(true)}
          />
        </div>

        {/* Right Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <DoctorCredentialsCard doctor={doctor} />
          <DoctorDocumentIntegrityCard
            documents={doctor.latestVerification?.documents}
          />
        </div>
      </div>

      {/* Status Toggle Modal */}
      <SuspendUserModal
        open={isSuspendModalOpen}
        user={adminUserForModal}
        onClose={() => setIsSuspendModalOpen(false)}
        onSubmit={handleToggleStatus}
        isLoading={isSubmitting}
      />
    </div>
  );
}
