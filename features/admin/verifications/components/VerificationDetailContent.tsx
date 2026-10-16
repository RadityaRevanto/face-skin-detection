"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/features/admin/services/adminService";
import { customToast } from "@/lib/custom-toast";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";
import type {
  DoctorVerificationDetail,
  VerificationDocument,
} from "../lib/verificationDetailTypes";
import { VerificationDossierHeader } from "./VerificationDossierHeader";
import { VerificationIdentityCard } from "./VerificationIdentityCard";
import { VerificationPracticeCard } from "./VerificationPracticeCard";
import { VerificationDocumentListCard } from "./VerificationDocumentListCard";
import { VerificationInlineDocumentViewer } from "./VerificationInlineDocumentViewer";
import { VerificationDecisionPanel } from "./VerificationDecisionPanel";
import { VerificationRevisionModal } from "./VerificationRevisionModal";
import { VerificationRejectionModal } from "./VerificationRejectionModal";

type VerificationDetailContentProps = {
  doctor: DoctorVerificationDetail;
};

export function VerificationDetailContent({
  doctor,
}: VerificationDetailContentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedDoc, setSelectedDoc] = useState<VerificationDocument | null>(null);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const invalidateCaches = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "verifications"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "verifications-count"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "verification", doctor.id] });
    queryClient.invalidateQueries({ queryKey: ["admin", "doctors"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await adminService.reviewVerification(doctor.id, "approved");
      customToast.success("Pengajuan verifikasi dokter berhasil disetujui", {
        description: "Akun dokter telah diaktifkan untuk praktik telekonsultasi.",
      });
      invalidateCaches();
      router.push("/admin/doctors");
      router.refresh();
    } catch (err) {
      customToast.error("Gagal menyetujui verifikasi", {
        description: getUserFriendlyErrorMessage(err),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevisionSubmit = async (note: string) => {
    setIsSubmitting(true);
    try {
      await adminService.reviewVerification(doctor.id, "needs_revision", note);
      customToast.info("Permintaan revisi berkas berhasil dikirim", {
        description: "Dokter akan menerima notifikasi perbaikan dokumen.",
      });
      setIsRevisionModalOpen(false);
      invalidateCaches();
      router.push("/admin/doctor-verifications?status=needs_revision");
      router.refresh();
    } catch (err) {
      customToast.error("Gagal mengirim permintaan revisi", {
        description: getUserFriendlyErrorMessage(err),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectionSubmit = async (reason: string) => {
    setIsSubmitting(true);
    try {
      await adminService.reviewVerification(doctor.id, "rejected", reason);
      customToast.error("Pengajuan verifikasi dokter ditolak", {
        description: "Alasan penolakan telah tercatat dalam sistem dan dikirimkan.",
      });
      setIsRejectionModalOpen(false);
      invalidateCaches();
      router.push("/admin/doctor-verifications?status=rejected");
      router.refresh();
    } catch (err) {
      customToast.error("Gagal menolak verifikasi", {
        description: getUserFriendlyErrorMessage(err),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* 1. Dossier Header */}
      <VerificationDossierHeader doctor={doctor} />

      {/* 2. Main 12-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2 max-w-[1280px]">
        {/* Kolom Kiri (7/12 on LG, 8/12 on XL) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 min-w-0">
          <VerificationIdentityCard doctor={doctor} />
          <VerificationPracticeCard doctor={doctor} />
          <VerificationDocumentListCard
            doctor={doctor}
            onPreviewDocument={(doc) => setSelectedDoc(doc)}
          />
          {selectedDoc && (
            <VerificationInlineDocumentViewer
              document={selectedDoc}
              onClose={() => setSelectedDoc(null)}
            />
          )}
        </div>

        {/* Kolom Kanan (5/12 on LG, 4/12 on XL) - Sticky Panel */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
          <VerificationDecisionPanel
            doctor={doctor}
            isSubmitting={isSubmitting}
            onApprove={handleApprove}
            onOpenRevisionModal={() => setIsRevisionModalOpen(true)}
            onOpenRejectionModal={() => setIsRejectionModalOpen(true)}
          />
        </div>
      </div>

      {/* 3. Decision Modals */}
      <VerificationRevisionModal
        isOpen={isRevisionModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsRevisionModalOpen(false)}
        onSubmit={handleRevisionSubmit}
      />
      <VerificationRejectionModal
        isOpen={isRejectionModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsRejectionModalOpen(false)}
        onSubmit={handleRejectionSubmit}
      />
    </div>
  );
}
