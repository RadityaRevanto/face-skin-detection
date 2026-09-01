import type { Metadata } from "next";

import { RegisterView } from "@/features/auth/components/RegisterView";
import { RedirectIfAuthenticated } from "@/features/auth/components/RedirectIfAuthenticated";

export const metadata: Metadata = {
  title: "Register",
  description: "Daftar akun baru",
};

export default function RegisterPage() {
  return (
    <RedirectIfAuthenticated>
      <RegisterView />
    </RedirectIfAuthenticated>
  );
}
