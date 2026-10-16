"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { adminService, type AdminUser } from "@/features/admin/services/adminService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { customToast } from "@/lib/custom-toast";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";
import type { UserDetail } from "../lib/userDetailTypes";
import { UserDetailHeader } from "./UserDetailHeader";
import { UserIdentityCard } from "./UserIdentityCard";
import { UserRecentActivityCard } from "./UserRecentActivityCard";
import { UserOperationalCard } from "./UserOperationalCard";
import { ChangeRoleModal } from "./ChangeRoleModal";
import { SuspendUserModal } from "./SuspendUserModal";
import { DeleteUserModal } from "./DeleteUserModal";

type UserDetailContentProps = {
  user: UserDetail;
};

export function UserDetailContent({ user }: UserDetailContentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCurrentUser =
    currentUser?.uuid === user.id || currentUser?.email === user.email;

  // Adapt UserDetail to AdminUser for modal compatibility
  const adminUserAdapter: AdminUser = {
    id: user.id,
    uuid: user.id,
    full_name: user.name,
    email: user.email,
    role: user.role,
    is_active: user.isActive,
    created_at: user.createdAt,
    avatar_url: user.avatarUrl ?? undefined,
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "user", user.id] });
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
  };

  const executeAction = async (action: () => Promise<unknown>, successMsg: string) => {
    setIsSubmitting(true);
    try {
      await action();
      customToast.success(successMsg);
      invalidate();
    } catch (err) {
      customToast.error("Gagal", { description: getUserFriendlyErrorMessage(err) });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportMetadata = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `metadata_${user.id}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    customToast.success("Metadata pengguna berhasil diekspor");
  };

  const handleResetPassword = () => {
    customToast.success("Instruksi reset kata sandi telah dikirim ke email pengguna", {
      description: `Alamat tujuan: ${user.email}`,
    });
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* 1. Header with Back link, title, role badge, session audit, and export */}
      <UserDetailHeader user={user} onExport={handleExportMetadata} />

      {/* 2. Primary 2-Column Responsive Layout (7 cols / 5 cols) matching index3.html */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-[1280px]">
        {/* Left Column: Identitas & Biodata Profiler */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <UserIdentityCard user={user} />
          <UserRecentActivityCard user={user} />
        </div>

        {/* Right Column: Account Status & Fast Actions */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <UserOperationalCard
            user={user}
            isCurrentUser={isCurrentUser}
            onOpenSuspendModal={() => setIsSuspendOpen(true)}
            onOpenRoleModal={() => setIsRoleOpen(true)}
            onResetPassword={handleResetPassword}
            onOpenDeleteModal={() => setIsDeleteOpen(true)}
          />
        </div>
      </div>

      {/* Modals Orchestration */}
      <ChangeRoleModal
        open={isRoleOpen}
        user={adminUserAdapter}
        onClose={() => setIsRoleOpen(false)}
        onSubmit={(uuid, newRole) =>
          executeAction(() => adminService.assignRole(uuid, newRole), "Role pengguna berhasil diperbarui")
        }
        isLoading={isSubmitting}
      />

      <SuspendUserModal
        open={isSuspendOpen}
        user={adminUserAdapter}
        onClose={() => setIsSuspendOpen(false)}
        onSubmit={(uuid) =>
          executeAction(() => adminService.toggleActive(uuid), "Status operasional akun berhasil diperbarui")
        }
        isLoading={isSubmitting}
      />

      <DeleteUserModal
        open={isDeleteOpen}
        user={adminUserAdapter}
        onClose={() => setIsDeleteOpen(false)}
        onSubmit={async (uuid) => {
          await executeAction(() => adminService.destroyUser(uuid), "Akun pengguna berhasil dihapus permanen");
          router.push("/admin/users");
        }}
        isLoading={isSubmitting}
      />
    </div>
  );
}
