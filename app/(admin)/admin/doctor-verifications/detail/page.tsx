"use client";

import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { adminService } from "@/features/admin/services/adminService";
import { DetailPageSkeleton } from "@/components/skeletons";
import { ErrorState } from "@/components/ui/error-state";
import { VerificationDetailContent } from "@/features/admin/verifications/components/VerificationDetailContent";
import {
  formatDate,
  mapVerificationStatus,
} from "@/features/admin/verifications/lib/verificationDetailUtils";

function VerificationDetailPageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: verification, isLoading } = useQuery({
    queryKey: ["admin", "verification", id],
    queryFn: () => adminService.verification(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (!id || !verification) {
    return <ErrorState message="Data verifikasi tidak ditemukan." />;
  }

  const row = verification as unknown as {
    uuid: string;
    doctor_id?: string;
    str_number: string;
    title?: string | null;
    specialization: string;
    sub_specialization?: string | null;
    experience_years?: number | null;
    alma_mater?: string | null;
    practice_locations?: Array<{ name: string; dept?: string; schedule?: string }> | string[] | null;
    professional_organizations?: string[] | null;
    revision_note?: string | null;
    documents?: { uuid: string; url: string; file_name: string }[];
    verification_status: string;
    created_at: string;
    reviewed_at?: string;
    rejection_reason?: string | null;
    doctor?: {
      id?: string;
      uuid?: string;
      full_name?: string;
      email?: string;
      phone?: string | null;
      avatar_url?: string | null;
    };
  };
  const profile = row.doctor;

  const normalizedLocations = Array.isArray(row.practice_locations)
    ? row.practice_locations.map((loc) =>
        typeof loc === "string" ? { name: loc } : loc
      )
    : [];

  return (
    <VerificationDetailContent
      doctor={{
        id: row.uuid,
        doctorId: row.doctor_id ?? profile?.uuid ?? "",
        name: profile?.full_name ?? "Dokter",
        email: profile?.email ?? "-",
        phone: profile?.phone ?? null,
        avatarUrl: profile?.avatar_url ?? null,
        title: row.title ?? null,
        identity: row.str_number ?? "-",
        specialization: row.specialization ?? "Dermatologi & Venereologi",
        subSpecialization: row.sub_specialization ?? null,
        experienceYears: row.experience_years ?? null,
        almaMater: row.alma_mater ?? null,
        practiceLocations: normalizedLocations,
        professionalOrganizations: row.professional_organizations ?? [],
        documents: row.documents ?? [],
        status: mapVerificationStatus(row.verification_status),
        rawStatus: row.verification_status as never,
        submittedAt: formatDate(row.created_at),
        reviewedAt: row.reviewed_at ? formatDate(row.reviewed_at) : null,
        rejectionReason: row.rejection_reason ?? null,
        revisionNote: row.revision_note ?? null,
      }}
    />
  );
}

// Static route: identitas verifikasi via query param ?id=<uuid>
export default function AdminDoctorVerificationDetailPage() {
  return (
    <Suspense>
      <VerificationDetailPageInner />
    </Suspense>
  );
}
