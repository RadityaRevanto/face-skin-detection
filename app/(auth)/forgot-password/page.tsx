import type { Metadata } from "next";

import { ForgotPasswordView } from "@/components/auth/forgot-password-view";
import { redirectIfAuthenticated } from "@/lib/auth/session-redirect";

export const metadata: Metadata = {
  title: "Lupa Password | Face Skin Detection",
  description: "Reset password akun Anda",
};

export default async function ForgotPasswordPage() {
  await redirectIfAuthenticated();

  return <ForgotPasswordView />;
}
