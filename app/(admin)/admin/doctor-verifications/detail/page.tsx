"use client";

import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { adminService } from "@/features/admin/services/adminService";
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
    return (
      <div className="w-full space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (!id || !verification) {
    return (
      <div className="w-full rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center text-sm text-rose-600">
        Data verifikasi tidak ditemukan.
      </div>
    );
  }

  const row = verification as unknown as {
    uuid: string;
    doctor_id?: string;
    specialization: string;
    str_number: string;
    documents?: { uuid: string; url: string; file_name: string }[];
    verification_status: string;
    created_at: string;
    reviewed_at?: string;
    rejection_reason?: string | null;
    doctor?: { id: string; uuid: string; name: string; email: string };
  };
  const profile = row.doctor;

  return (
    <VerificationDetailContent
      doctor={{
        id: row.uuid,
        doctorId: row.doctor_id ?? profile?.uuid ?? "",
        name: profile?.name ?? "Dokter",
        email: profile?.email ?? "-",
        phone: "-",
        address: "-",
        identity: row.str_number ?? "-",
        specialization: row.specialization ?? "-",
        documents: row.documents ?? [],
        status: mapVerificationStatus(row.verification_status),
        rawStatus: row.verification_status as never,
        submittedAt: formatDate(row.created_at),
        rejectionReason: row.rejection_reason ?? null,
      }}
    />
  );
}

// Static route — identitas verifikasi via query param ?id=<uuid>
export default function AdminDoctorVerificationDetailPage() {
  return (
    <Suspense>
      <VerificationDetailPageInner />
    </Suspense>
  );
}
