"use client";

import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { adminService } from "@/features/admin/services/adminService";
import { LoadingState } from "@/components/ui/loading-state";
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
        full_name?: string;
        email?: string;
        role?: string;
        roles?: { name: string }[];
        is_active?: boolean;
        avatar_url?: string | null;
        created_at?: string;
      };
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <LoadingState variant="detail" />;
  }

  if (!id || !user) {
    return <ErrorState message="User tidak ditemukan." />;
  }

  const roleObj = user.roles?.[0];
  const role = roleObj ? roleObj.name : user.role;

  return (
    <UserDetailContent
      user={{
        id: user.uuid ?? user.id ?? "unknown",
        name: user.full_name ?? "User",
        email: user.email ?? "-",
        role: (role as "user" | "doctor" | "admin") ?? "user",
        avatarUrl: user.avatar_url ?? null,
        isActive: user.is_active ?? true,
        createdAt: formatDate(user.created_at ?? null),
      }}
    />
  );
}

// Static route — identitas user via query param ?id=<uuid>
export default function AdminUserDetailPage() {
  return (
    <Suspense>
      <UserDetailPageInner />
    </Suspense>
  );
}
