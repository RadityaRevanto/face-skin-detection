import type { Metadata } from "next";

import { LoginView } from "@/features/auth/components/LoginView";
import { RedirectIfAuthenticated } from "@/features/auth/components/RedirectIfAuthenticated";

export const metadata: Metadata = {
  title: "Login",
  description: "Login ke akun Anda",
};

export default function LoginPage() {
  return (
    <RedirectIfAuthenticated>
      <LoginView />
    </RedirectIfAuthenticated>
  );
}
