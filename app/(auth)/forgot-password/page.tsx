import type { Metadata } from "next";

import { ForgotPasswordView } from "@/features/auth/components/ForgotPasswordView";
import { RedirectIfAuthenticated } from "@/features/auth/components/RedirectIfAuthenticated";

export const metadata: Metadata = {
  title: "Lupa Password",
  description: "Reset password akun Anda",
};

export default function ForgotPasswordPage() {
  return (
    <RedirectIfAuthenticated>
      <ForgotPasswordView />
    </RedirectIfAuthenticated>
  );
}
