import type { Metadata } from "next";

import { ForgotPasswordView } from "@/src/features/auth/components/ForgotPasswordView";
import { redirectIfAuthenticated } from "@/lib/auth/session-redirect";

export const metadata: Metadata = {
  title: "Lupa Password",
  description: "Reset password akun Anda",
};

export default async function ForgotPasswordPage() {
  await redirectIfAuthenticated();

  return <ForgotPasswordView />;
}
