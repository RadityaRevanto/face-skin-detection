import type { ReactNode } from "react";

import NavbarUsers from "@/components/users/navbar-users";
import { requireUserRole } from "@/lib/auth";

export default async function UserLayout({ children }: { children: ReactNode }) {
  const profile = await requireUserRole();

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarUsers 
        initialDisplayName={profile.full_name || "Pengguna"} 
        initialAvatarUrl={profile.avatar_url || profile.google_avatar_url || null}
      />
      {children}
    </div>
  );
}
