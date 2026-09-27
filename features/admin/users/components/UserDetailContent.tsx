import Link from "next/link";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import type { UserDetail } from "@/features/admin/users/lib/userDetailTypes";
import { UserIdentityCard } from "./UserIdentityCard";

type UserDetailContentProps = {
  user: UserDetail;
};

export function UserDetailContent({ user }: UserDetailContentProps) {
  return (
    <div className="w-full space-y-6">
      <PageHeader
        backHref="/admin/users"
        backLabel="Kembali ke daftar user"
        eyebrow="Detail Akun"
        title="Detail User"
        description="Profil user yang terdaftar di sistem SkinCek."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UserIdentityCard user={user} />

        <div className="flex flex-col gap-6">
          <Card>
            <div className="border-b border-[var(--line)] px-6 py-4">
              <h3 className="font-heading text-base font-semibold text-[var(--ink)]">
                Info Teknis
              </h3>
              <p className="mt-0.5 text-sm text-[var(--ink-muted)]">
                Identifikasi internal akun.
              </p>
            </div>

            <div className="space-y-3 p-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                  UUID
                </p>
                <p className="mt-0.5 break-all font-mono text-sm text-[var(--ink-soft)]">
                  {user.id}
                </p>
              </div>
            </div>
          </Card>

          <Card className="px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
              Aksi cepat
            </p>
            <p className="mt-1.5 text-sm text-[var(--ink-soft)]">
              Ubah role, suspend, atau hapus user lewat daftar{" "}
              <Link
                href="/admin/users"
                className="font-semibold text-[var(--role-accent-strong)] hover:underline"
              >
                Manajemen User
              </Link>
              .
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}