"use client";

import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { adminService } from "@/features/admin/services/adminService";
import { DetailPageSkeleton } from "@/components/skeletons";
import { ErrorState } from "@/components/ui/error-state";
import { UserDetailContent } from "@/features/admin/users/components/UserDetailContent";
import { formatDate } from "@/features/admin/users/lib/userDetailUtils";

function UserDetailPageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: user, isLoading } = useQuery({
    queryKey: ["admin", "user", id],
    queryFn: async () => {
      const response = await adminService.user(id!);
      return response as unknown as {
        id?: string;
        uuid?: string;
        full_name: string;
        email: string;
        role?: "user" | "doctor" | "admin";
        is_active?: boolean;
        avatar_url?: string | null;
        created_at?: string;
        gender?: string | null;
        age?: number | null;
        phone?: string | null;
        date_of_birth?: string | null;
        email_verified_at?: string | null;
        doctor_verification?: {
          specialization?: string;
          str_number?: string | null;
          verification_status?: string;
        } | null;
      };
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (!id || !user) {
    return <ErrorState message="User tidak ditemukan." />;
  }

  return (
    <UserDetailContent
      user={{
        id: user.uuid ?? user.id ?? "unknown",
        name: user.full_name ?? "User",
        email: user.email ?? "-",
        role: user.role ?? "user",
        avatarUrl: user.avatar_url ?? null,
        isActive: user.is_active ?? true,
        createdAt: formatDate(user.created_at ?? null),
        gender: user.gender ?? null,
        age: user.age ?? null,
        phone: user.phone ?? null,
        dateOfBirth: user.date_of_birth ?? null,
        emailVerifiedAt: user.email_verified_at ?? null,
        doctorVerification: user.doctor_verification ?? null,
      }}
    />
  );
}

// Static route: identitas user via query param ?id=<uuid>
export default function AdminUserDetailPage() {
  return (
    <Suspense>
      <UserDetailPageInner />
    </Suspense>
  );
}
