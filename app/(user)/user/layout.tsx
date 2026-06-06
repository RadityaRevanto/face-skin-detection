import type { ReactNode } from "react";

import NavbarUsers from "@/components/users/navbar-users";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarUsers />
      {children}
    </div>
  );
}
