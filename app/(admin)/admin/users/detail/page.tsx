"use client";

import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { adminService } from "@/features/admin/services/adminService";
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
    return (
      <div className="w-full space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (!id || !user) {
    return (
      <div className="w-full rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center text-sm text-rose-600">
        User tidak ditemukan.
      </div>
    );
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
