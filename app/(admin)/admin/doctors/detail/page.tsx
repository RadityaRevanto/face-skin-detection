"use client";

import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { adminService } from "@/features/admin/services/adminService";
import { DoctorDetailContent } from "@/features/admin/doctors/components/DoctorDetailContent";
import {
  formatDate,
  mapVerificationStatus,
} from "@/features/admin/doctors/lib/doctorDetailUtils";

function DoctorDetailPageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["admin", "doctor", id],
    queryFn: async () => {
      const response = await adminService.user(id!);
      return response as unknown as {
        id?: string;
        uuid?: string;
        full_name?: string;
        email?: string;
        role?: string;
        is_active?: boolean;
        avatar_url?: string | null;
        created_at?: string;
        doctor_verification?: {
          id: string;
          uuid: string;
          str_number: string;
          specialization: string;
          documents: { uuid: string; url: string; file_name: string | null }[];
          verification_status: string;
          created_at: string;
          reviewed_at?: string;
          rejection_reason?: string;
        };
      };
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (!id || !profile || profile.role !== "doctor") {
    return (
      <div className="w-full rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center text-sm text-rose-600">
        Dokter tidak ditemukan.
      </div>
    );
  }

  const latestVerification = profile.doctor_verification;

  return (
    <DoctorDetailContent
      doctor={{
        id: profile.id ?? profile.uuid ?? "unknown",
        name: profile.full_name ?? "Dokter",
        email: profile.email ?? "-",
        role: "doctor",
        isActive: profile.is_active ?? true,
        joinedAt: formatDate(profile.created_at ?? null),
        avatarUrl: profile.avatar_url ?? null,
        latestVerification: latestVerification
          ? {
              id: latestVerification.id,
              identity: latestVerification.str_number ?? "-",
              specialization: latestVerification.specialization ?? "-",
              documents: latestVerification.documents ?? [],
              status: mapVerificationStatus(latestVerification.verification_status),
              rawStatus: latestVerification.verification_status as never,
              submittedAt: formatDate(latestVerification.created_at),
              reviewedAt: formatDate(latestVerification.reviewed_at ?? null),
              rejectionReason: latestVerification.rejection_reason ?? null,
            }
          : null,
      }}
    />
  );
}

// Static route — identitas dokter via query param ?id=<uuid>
export default function AdminDoctorDetailPage() {
  return (
    <Suspense>
      <DoctorDetailPageInner />
    </Suspense>
  );
}
