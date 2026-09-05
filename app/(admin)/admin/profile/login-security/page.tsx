import type { Metadata } from "next";

import { LoginSecurityContainer } from "@/features/user/components/LoginSecurityContainer";

export const metadata: Metadata = {
  title: "Login & Keamanan",
  description: "Kelola password dan sesi login admin",
};

export default function AdminLoginSecurityPage() {
  return <LoginSecurityContainer role="admin" />;
}
